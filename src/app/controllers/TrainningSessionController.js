import * as Yup from 'yup';
import connection from '../../database/connection';

class TrainningSessionController {
  async store(req, res) {
    const { trainning_type_id, exercise, series, repetitions, load } = req.body;
    const trx = await connection.transaction();

    const newExercise = {
      user_id: req.userId,
      trainning_type_id,
      exercise,
      series,
      repetitions,
      load,
    };

    const insertedExercise = await trx('trainning_session').insert(newExercise);
    const exercise_id = insertedExercise[0];

    await trx.commit();

    return res.json({
      id: exercise_id,
      ...newExercise,
    });
  }
}

export default new TrainningSessionController();
