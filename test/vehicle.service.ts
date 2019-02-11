import 'mocha';
import {Vehicle} from '../server/api/models/trip.models';
import {expect} from 'chai';
import {VehicleNotFoundError} from "../server/api/errors/errors";
import {VehicleService} from "../server/api/services/vehicle.service";

describe('VehicleService', () => {

  const vehicles = new Map<string, Vehicle>();
  const vehicle = {
    id: 'alto09',
    imageURI: '/images/alto09',
    makeAndModel: '2019 Volkswagen Atlas',
    color: 'Pure White',
    name: 'Alto 09',
    seats: {
      min: 1,
      max: 5
    }
  };
  vehicles.set('alto09', vehicle);

  const vehicleService = new VehicleService(vehicles);

  it('should return the vehicle', async () => {
    const result = await vehicleService.byId(vehicle.id);

    expect(result)
      .to.equal(vehicle);
  });

  it('should throw a DriverNotFoundError for a missing driver', async () => {
    try {
      await vehicleService.byId('abcd');
      expect.fail();
    } catch(err) {
      expect(err).to.be.an.instanceOf(VehicleNotFoundError);
    }
  });

});
