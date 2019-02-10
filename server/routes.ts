import { Application } from 'express';
import tripsRouter from './api/controllers/trips/router'

export default function routes(app: Application): void {
  app.use('/api/v1/trips', tripsRouter);
};