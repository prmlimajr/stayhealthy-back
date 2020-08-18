import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/signin', UserController.store);
routes.post('/sessions', SessionController.store);

routes.put('/users', authMiddleware, UserController.update);
routes.delete('/users', authMiddleware, UserController.delete);

export default routes;
