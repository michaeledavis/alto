import 'mocha';
import {Vehicle} from '../server/api/models/trip.models';
import {expect} from 'chai';
import {BadRequestError, VehicleNotFoundError} from "../server/api/errors/errors";
import {VehicleService} from "../server/api/services/vehicle.service";
import {VibeService} from "../server/api/services/vibe.service";

describe('VehicleService', () => {

  const vibes = ['VAPORWAVE_BEATS', 'FIZZ', 'LIFTOFF'];

  const vibeService = new VibeService(vibes);

  it('should validate the vibe', async () => {
    const result = await vibeService.validateVibe(vibes[0]);

    expect(result)
      .to.be.undefined;
  });

  it('should throw a BadRequestError for an invalid vibe', async () => {
    try {
      await vibeService.validateVibe('abcd');
      expect.fail();
    } catch(err) {
      expect(err).to.be.an.instanceOf(BadRequestError);
    }
  });

});
