import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import connection from '../../database/connection';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { email, password } = req.body;
    const trx = await connection.transaction();

    /**
     * Checks if the user is registered in the database
     */
    const userExists = await trx('users')
      .select('users.*')
      .where('email', email);

    if (!userExists[0]) {
      return res.status(401).json({ error: 'User not found' });
    }

    /**
     * Checks if the password is the same as the encrypted password in the database
     */
    const checkPassword = (password) => {
      return bcrypt.compare(password, userExists[0].password);
    };

    if (!(await checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    return res.json({
      user: {
        id: userExists[0].id,
        name: userExists[0].name,
        email,
      },
      token: jwt.sign({ id: userExists[0].id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
