import Promise from 'bluebird';
import log from '../../common/logger'
import {DriverNotFoundError} from "../errors/errors";
import {Driver} from "../models/trip.models";

let drivers = new Map<string, Driver>();
drivers.set('0809', {
  id: '0809',
  friendlyName: 'Steph',
  description: 'Steph Festiculma is a graduate of Parsons New School in New York and fluent in' +
    'Portuguese, Spanish, and English. Steph has been driving with Alto since 2018.'
});

// This service is mocked - it would call out to a different service
export class DriverService {

  byId(driverId: string): Promise<Driver> {
    log.info(`Retrieving driver for driverId: [${driverId}]`);
    const driver = drivers.get(driverId);

    if (!driver) {
      log.warn(`Driver could not be found for driverId: [${driverId}]`);
      throw new DriverNotFoundError(driverId)
    } else {
      log.info(`Returning driver with driverId: [${driverId}]`);
      return Promise.resolve(driver);
    }
  }

}

export default new DriverService();