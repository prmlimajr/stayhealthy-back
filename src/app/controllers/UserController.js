import bcrypt from 'bcryptjs';
import * as Yup from 'yup';

import connection from '../../database/connection';

class UserController {
  async store(req, res) {
    /**
     * Creates the validations cases.
     */
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { name, email, password } = req.body;
    const trx = await connection.transaction();

    /**
     * Checks if the email is already in use.
     */
    const userExists = await trx('users')
      .select('users.*')
      .where('email', email);

    if (userExists[0]) {
      return res.status(400).json({ error: 'User already exists' });
    }

    /**
     * Encrypts the password
     */
    const hashedPassword = await bcrypt.hash(password, 8);

    const user = {
      name,
      email,
      password: hashedPassword,
    };

    const insertedId = await trx('users').insert(user);
    const user_id = insertedId[0];

    await trx.commit();

    return res.json({
      id: user_id,
      ...user,
    });
  }

  async update(req, res) {
    // const schema = Yup.object().shape({
    //   name: Yup.string(),
    //   email: Yup.string().email(),
    //   oldPassword: Yup.string().min(6),
    //   password: Yup.string()
    //     .min(6)
    //     .when('oldPassword', (oldPassword, field) =>
    //       oldPassword ? field.required() : field
    //     ),
    //   confirmPassword: Yup.string().when('password', (password, field) =>
    //     password ? field.required().oneOf([Yup.ref('password')]) : field
    //   ),
    // });

    // if (!(await schema.isValid(req.body))) {
    //   return res.status(400).json({ error: 'Validation failed' });
    // }

    const { name, email, oldPassword, password } = req.body;
    const trx = await connection.transaction();
    /**
     * Checks if the user is registered in the database and if the desired email is already in use
     */
    const users = await trx('users').select('users.*');
    const userExists = users.filter((user) => user.id === req.userId);
    const emailExists = users.filter((user) => user.email === email);

    if (emailExists.length > 0) {
      if (emailExists[0].email === email) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    /**
     * Checks if the old password informed is the same as the one stored in the database
     */
    const checkPassword = (password) => {
      return bcrypt.compare(password, userExists[0].password);
    };

    if (oldPassword && !(await checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    /**
     * If the user is trying to change the password, encrypts it, else it reuses the same password stored in the database
     */
    const hashedPassword = password
      ? await bcrypt.hash(password, 8)
      : userExists[0].password;

    const user = {
      name: name || userExists[0].name,
      email: email || userExists[0].email,
      password: hashedPassword,
      updated_at: new Date(),
    };

    const updated = await trx('users').update(user).where('id', req.userId);

    await trx.commit();

    return res.json({
      id: req.userId,
      ...user,
    });
  }

  async delete(req, res) {
    const { password } = req.body;
    const trx = await connection.transaction();

    const userExists = await trx('users')
      .select('users.*')
      .where('id', req.userId);

    if (!password) {
      return res.status(401).json({ error: 'Password is required' });
    }

    const checkPassword = (password) => {
      return bcrypt.compare(password, userExists[0].password);
    };

    if (password && !(await checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const deleted = await trx('users').del().where('id', req.userId);

    trx.commit();

    return res.json({
      ...userExists[0],
    });
  }
}

export default new UserController();
