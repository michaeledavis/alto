import middleware from 'swagger-express-middleware';
import {Application} from 'express';
import path from 'path';

export default function (app: Application, routes: (app: Application) => void, errorHandler: (app: Application) => void) {
  middleware(path.join(__dirname, 'Api.yaml'), app, function(err, middleware) {

    // Enable Express' case-sensitive and strict options
    // (so "/entities", "/Entities", and "/Entities/" are all different)
    app.enable('case sensitive routing');
    app.enable('strict routing');

    app.use(middleware.metadata());
    app.use(middleware.files(app, {
      apiPath: process.env.SWAGGER_API_SPEC,
    }));

    app.use(middleware.parseRequest({
      // Don't allow JSON content over 100kb (default is 1mb)
      json: {
        limit: process.env.REQUEST_LIMIT
      }
    }));

    // These two middleware don't have any options (yet)
    app.use(
      middleware.CORS(),
      middleware.validateRequest());

    routes(app);
    errorHandler(app);
  });
}
