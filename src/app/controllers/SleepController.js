import * as Yup from 'yup';
import connection from '../../database/connection';

class SleepController {
  async store(req, res) {
    const schema = Yup.object().shape({
      hours: Yup.number().positive().required(),
      day: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { hours, day } = req.body;

    const sleep = {
      user_id: req.userId,
      hours,
      day,
    };

    const insertedSleep = await connection('sleep').insert(sleep);

    return res.json({ ...sleep });
  }
}

export default new SleepController();
