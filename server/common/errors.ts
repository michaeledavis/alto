export class TripNotFoundError extends Error {
  constructor(tripId: string) {
    super(`Trip could not be found for tripId: [${tripId}].`);

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}