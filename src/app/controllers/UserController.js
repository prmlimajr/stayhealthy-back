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

  async update(req, res) {}
}

export default new UserController();
