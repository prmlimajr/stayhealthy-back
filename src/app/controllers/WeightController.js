import * as Yup from 'yup';
import connection from '../../database/connection';

class WeightController {
  async store(req, res) {
    const schema = Yup.object().shape({
      weight: Yup.number().positive().required(),
      day: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { weight, day } = req.body;

    const newWeight = {
      user_id: req.userId,
      weight,
      created_at: day || new Date(),
    };

    const insertedWeight = await connection('weight').insert(newWeight);

    return res.json({ ...newWeight });
  }

  async listUserHistory(req, res) {
    const weightList = await connection('weight')
      .select('weight.*')
      .where({ user_id: req.userId });

    if (weightList.length === 0) {
      return res.status(401).json({ error: 'Empty list' });
    }

    return res.json({ ...weightList });
  }
}

export default new WeightController();
