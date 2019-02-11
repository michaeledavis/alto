import Promise from 'bluebird';
import log from '../../common/logger'
import {VehicleNotFoundError} from "../errors/errors";
import {Vehicle} from "../models/trip.models";

const vehicles = new Map<string, Vehicle>();
vehicles.set('alto09', {
  id: 'alto09',
  imageURI: '/images/alto09',
  makeAndModel: '2019 Volkswagen Atlas',
  color: 'Pure White',
  name: 'Alto 09',
  seats: {
    min: 1,
    max: 5
  }
});

vehicles.set('alto08', {
  id: 'alto08',
  imageURI: '/images/alto08',
  makeAndModel: '2018 Volkswagen Atlas',
  color: 'Pure Grey',
  name: 'Alto 08',
  seats: {
    min: 1,
    max: 5
  }
});

// This service is mocked - it would call out to a different service
export class VehicleService {

  vehicles: Map<string, Vehicle>;

  constructor(vehicles: Map<string, Vehicle>) {
    this.vehicles = vehicles;
  }

  byId(vehicleId: string): Promise<Vehicle> {
    log.info(`Retrieving vehicle for vehicleId: [${vehicleId}]`);
    const vehicle = this.vehicles.get(vehicleId);

    if (!vehicle) {
      log.warn(`Vehicle could not be found for vehicleId: [${vehicleId}]`);
      throw new VehicleNotFoundError(vehicleId)
    } else {
      log.info(`Returning vehicle with vehicleId: [${vehicleId}]`);
      return Promise.resolve(vehicle);
    }
  }

}

export default new VehicleService(vehicles);