import 'mocha';
import {Driver} from '../server/api/models/trip.models';
import {DriverService} from '../server/api/services/driver.service';
import {expect} from 'chai';
import {DriverNotFoundError} from "../server/api/errors/errors";

describe('DriverService', () => {

  const drivers = new Map<string, Driver>();
  const driver = {
    id: '0809',
    friendlyName: 'Steph',
    description: 'Steph Festiculma is a graduate of Parsons New School in New York and fluent in' +
      'Portuguese, Spanish, and English. Steph has been driving with Alto since 2018.'
  };
  drivers.set(driver.id, driver);

  const driverService = new DriverService(drivers);

  it('should return the driver', async () => {
    const result = await driverService.byId(driver.id);

    expect(result)
      .to.equal(driver);
  });

  it('should throw a DriverNotFoundError for a missing driver', async () => {
    try {
      await driverService.byId('abcd');
      expect.fail();
    } catch(err) {
      expect(err).to.be.an.instanceOf(DriverNotFoundError);
    }
  });

});
