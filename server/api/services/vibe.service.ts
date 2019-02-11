import Promise from 'bluebird';
import log from '../../common/logger'
import {BadRequestError} from "../errors/errors";
import _ from 'lodash';

let vibes = ['VAPORWAVE_BEATS', 'FIZZ', 'LIFTOFF'];

// This service is mocked - it would call out to a different service
export class VibeService {

  validateVibe(vibeId: string): Promise<void> {
    log.info(`Validating vibeId: [${vibeId}]`);

    const valid = _.includes(vibes, vibeId);

    if (!valid) {
      return Promise.reject(new BadRequestError(`${vibeId} is not a valid vibeId`));
    } else {
      return Promise.resolve();
    }
  }

}

export default new VibeService();