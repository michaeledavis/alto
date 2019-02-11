import middleware from 'swagger-express-middleware';
import {Application} from 'express';
import path from 'path';
import {BadRequestError, DriverNotFoundError, TripNotFoundError, VehicleNotFoundError} from "../../api/errors/errors";

export default function (app: Application, routes: (app: Application) => void) {
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

    // Error handler to display the validation error as HTML
    // app.use(function (err, req, res, next) {
    //   res.status(err.status);
    //   res.send(
    //     '<h1>' + err.status + ' Error</h1>' +
    //     '<pre>' + err.message + '</pre>'
    //   );
    // });

    routes(app);

    const serviceName = 'alto-trip-service';

    app.use(function(err, req, res, next) {

      if (err.name === TripNotFoundError.name ||
          err.name === DriverNotFoundError.name ||
          err.name === VehicleNotFoundError.name) {

        res
          .status(404)
          .json({
            message: err.message,
            code: 404,
            service: serviceName
          })
      } else if (err.name === BadRequestError.name) {
        res
          .status(400)
          .json({
            message: err.message,
            code: 400,
            service: serviceName
          })
      } else {
        res
          .status(500)
          .json({
            message: 'An unexpected error occurred.',
            code: '1000',
            service: serviceName
          });
      }
    });

  });
}
