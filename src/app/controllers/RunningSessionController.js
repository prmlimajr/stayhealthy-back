import * as Yup from 'yup';
import connection from '../../database/connection';

class RunningSessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      distance: Yup.number().positive().required(),
      minutes: Yup.number().positive().required(),
      day: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { distance, minutes, day } = req.body;

    const run = {
      user_id: req.userId,
      distance,
      minutes,
      created_at: new Date(),
    };

    const insertedExercise = await connection('running_session').insert(run);

    return res.json({ ...run });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      distance: Yup.number().positive().required(),
      minutes: Yup.number().positive().required(),
      created_at: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { distance, minutes, created_at } = req.body;
    const runExists = await connection('running_session')
      .select('running_session.*')
      .where({ user_id: req.userId, created_at });

    if (runExists.length === 0) {
      return res.status(401).json({ error: 'Empty list' });
    }

    const run = {
      userId: req.userId,
      distance: distance || runExists[0].distance,
      minutes: minutes || runExists[0].minutes,
      created_at,
      updated_at: new Date(),
    };

    const updated = await connection('running_session')
      .update(run)
      .where({ user_id: req.userId, created_at });

    return res.json({ ...run });
  }
}

export default new RunningSessionController();
