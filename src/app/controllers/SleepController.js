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

    const sleepExists = await connection('sleep')
      .select('sleep.*')
      .where('day', day);

    const sleptToday =
      sleepExists.length > 0 ? Number(sleepExists[0].hours) + hours : hours;

    const sleep = {
      user_id: req.userId,
      hours: sleptToday,
      day,
    };

    const insertedSleep =
      sleepExists.length > 0
        ? await connection('sleep').update(sleep).where('day', day)
        : await connection('sleep').insert(sleep);

    return res.json({ ...sleep });
  }

  async update(req, res) {
    const { hours, day } = req.body;
  }
}

export default new SleepController();
