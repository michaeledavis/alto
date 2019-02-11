import express, {Application} from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import os from 'os';
import swaggerify from './swagger';
import log from "./logger";

const app = express();

export default class ExpressServer {
  constructor() {
    const root = path.normalize(__dirname + '/../..');
    app.set('appPath', root + 'client');
    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(express.static(`${root}/public`));
  }

  router(routes: (app: Application) => void, errorHandler: (app: Application) => void): ExpressServer {
    swaggerify(app, routes, errorHandler);
    return this;
  }

  listen(p: string | number = process.env.PORT): Application {
    const welcome = port => () =>
      log.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname() } on port: ${port}}`);
    http.createServer(app).listen(p, welcome(p));
    return app;
  }
}
