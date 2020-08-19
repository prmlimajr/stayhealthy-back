import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import TrainningSessionController from './app/controllers/TrainningSessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/signin', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.put('/users', UserController.update);
routes.delete('/users', UserController.delete);
routes.post('/trainningsession', TrainningSessionController.store);

export default routes;
