import { Application } from 'express';
import authenticationRouter from './api/controllers/authentication/router';
export default function routes(app: Application): void {
  app.use('/api/authentication', authenticationRouter);
}
