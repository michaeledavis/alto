export class TripNotFoundError extends Error {
  constructor(tripId: string) {
    super(`Trip could not be found for tripId: [${tripId}].`);

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class VehicleNotFoundError extends Error {
  constructor(vehicleId: string) {
    super(`Vehicle could not be found for vehicleId: [${vehicleId}].`);

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class DriverNotFoundError extends Error {
  constructor(driverId: string) {
    super(`Driver could not be found for driverId: [${driverId}].`);

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}