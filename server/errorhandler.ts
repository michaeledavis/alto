import {BadRequestError, DriverNotFoundError, TripNotFoundError, VehicleNotFoundError} from "./api/errors/errors";
import {Application} from "express";


export default function errorHandler(app: Application): void {
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
};