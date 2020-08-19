import * as Yup from 'yup';
import connection from '../../database/connection';

class TrainningSessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      trainning_type_id: Yup.number().positive().max(3).required(),
      exercise: Yup.string().required(),
      series: Yup.number().positive(),
      repetitions: Yup.number().positive(),
      load: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { trainning_type_id, exercise, series, repetitions, load } = req.body;
    const trx = await connection.transaction();

    const exerciseExists = await trx('trainning_session')
      .select('trainning_session.*')
      .where('exercise', exercise);

    /**
     * Checks if the exercise is already registered on the same trainning type
     */
    if (exerciseExists.length > 0) {
      for (let i in exerciseExists) {
        if (
          exerciseExists[i].exercise === exercise &&
          exerciseExists[i].trainning_type_id === trainning_type_id
        ) {
          return res.status(401).json({ error: 'Exercise already exists' });
        }
      }
    }

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
