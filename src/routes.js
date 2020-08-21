import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import TrainningSessionController from './app/controllers/TrainningSessionController';
import SleepController from './app/controllers/SleepController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/signin', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.get('/users', UserController.listAll);
routes.get('/users/:id', UserController.listOne);
routes.put('/users', UserController.update);
routes.delete('/users', UserController.delete);

routes.get('/trainningsession', TrainningSessionController.listAll);
routes.get('/trainningsession/type', TrainningSessionController.listByType);
routes.post('/trainningsession', TrainningSessionController.store);
routes.put('/trainningsession', TrainningSessionController.update);
routes.delete('/trainningsession', TrainningSessionController.delete);

routes.post('/sleep', SleepController.store);
routes.put('/sleep', SleepController.update);
routes.delete('/sleep', SleepController.delete);
routes.get('/sleep/history', SleepController.listUserHistory);
routes.get('/sleep', SleepController.listByDate);

export default routes;
