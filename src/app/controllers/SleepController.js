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
      .where({ user_id: req.userId, day });

    const sleptToday =
      sleepExists.length > 0 ? Number(sleepExists[0].hours) + hours : hours;

    const sleep = {
      user_id: req.userId,
      hours: sleptToday,
      day,
    };

    const insertedSleep =
      sleepExists.length > 0
        ? await connection('sleep')
            .update(sleep)
            .where({ user_id: req.userId, day })
        : await connection('sleep').insert(sleep);

    return res.json({ ...sleep });
  }

  async update(req, res) {
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
      .where({ user_id: req.userId, day });

    if (sleepExists.length === 0) {
      return res.status(401).json({ error: 'No sleep time found' });
    }

    const sleep = {
      user_id: req.userId,
      hours,
      day,
      updated_at: new Date(),
    };

    const updated = await connection('sleep').update(sleep).where('day', day);

    return res.json({
      ...sleep,
    });
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      day: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { day } = req.body;
    const sleepExists = await connection('sleep')
      .select('sleep.*')
      .where({ user_id: req.userId, day });

    if (sleepExists.length === 0) {
      return res.status(401).json({ error: 'No sleep time found' });
    }

    const deleted = await connection('sleep')
      .del()
      .where({ user_id: req.userId, day });

    return res.json({ ...sleepExists[0] });
  }
}

export default new SleepController();
