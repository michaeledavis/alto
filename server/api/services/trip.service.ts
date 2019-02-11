import Promise from 'bluebird';
import log from '../../common/logger'
import _ from 'lodash';
import moment from 'moment';
import {TripNotFoundError} from '../errors/errors';
import tripEmitter from '../emitters/trip.eventemitter';
import {ContactInfo, Trip} from '../models/trip.models';
import vehicleService from '../services/vehicle.service';
import driverService from '../services/driver.service';
import vibeService from '../services/vibe.service';

let trips = new Map<string, Trip>();
trips.set('1234', {
  id: '1234',
  userId: '5654',
  estimatedArrival: moment().add(20, 'minutes'),
  requested: moment(),
  estimatedFare: {
    lowEstimate: {
      currency: 'USD',
      amount: 6500
    },
    highEstimate: {
      currency: 'USD',
      amount: 7500
    }
  },
  note: 'Can you drop me off at AA International Bag Drop please?',
  destination: {
    shortName: 'DFW Int\'l Airport - Terminal E',
    fullName: [
      'DFW International Airport',
      'American Airlines Terminal E',
      'Irving, Texas 75261'
    ],
    coordinates: {
      latitude: 32.890453,
      longitude: -97.036203
    }
  },
  origin: {
    fullName: [
      '449 Flora St.',
      'Dallas, Texas 75201'
    ],
    coordinates: {
      latitude: 32.890453,
      longitude: -97.036203
    }
  },
  currentLocation: {
    latitude: 32.890453,
    longitude: -97.036203
  },
  vehicle: {
    id: 'alto09'
  },
  driver: {
    id: '0809'
  },
  vibeId: 'VAPORWAVE_BEATS',
  paymentInfo: {
    id: '576858',
    nickname: 'Amex01'
  }
});

const sharedPhoneNumbers = [
  '+15558908989',
  '+15558908654',
  '+15558906735',
  '+15558901111',
];

export class TripService {

  byId(tripId: string): Promise<Trip> {
    log.info(`Retrieving trip for tripId: [${tripId}]`);
    const trip = trips.get(tripId);

    if (!trip) {
      log.warn(`Trip could not be found for tripId: [${tripId}]`);
      throw new TripNotFoundError(tripId)
    } else {
      return Promise.all([
        vehicleService.byId(trip.vehicle.id),
        driverService.byId(trip.driver.id)
      ]).then(([vehicle, driver]) => {
        const updatedTrip = {
          ...trip,
          vehicle,
          driver
        };
        log.info(`Returning trip with tripId: [${tripId}]`);
        return updatedTrip;
      });
    }
  }

  currentByUser(userId: string): Promise<Trip> {
    log.info(`Retrieving current trip for userId: [${userId}]`);
    const currentTrip = _.find([...trips.values()], (trip) => {
      return trip.userId === userId && !trip.cancelled && !trip.completed && trip.requested.isBefore(moment());
    });

    if (!currentTrip) {
      log.warn(`Trip could not be found for userId: [${userId}]`);
      throw new TripNotFoundError(null);
    } else {
      return this.byId(currentTrip.id);
    }
  }

  cancelById(tripId: string): Promise<void> {
    log.info(`Cancelling trip for tripId: [${tripId}]`);

    return this.byId(tripId).then((trip) => {
      const updatedTrip = {
        ...trip,
        cancelled: moment()
      };
      trips.set(trip.id, updatedTrip);
      tripEmitter.emit(tripId, updatedTrip);
    });
  }

  setNoteById(tripId: string, note: string): Promise<void> {
    log.info(`Updating note for trip with tripId: [${tripId}]`);

    return this.byId(tripId).then((trip) => {
      const updatedTrip = {
        ...trip,
        note
      };
      trips.set(trip.id, updatedTrip);
      tripEmitter.emit(tripId, updatedTrip);
    });
  }

  setVibeById(tripId: string, vibeId: string): Promise<void> {
    log.info(`Updating vibe for trip with tripId: [${tripId}] to vibeId: [${vibeId}]`);

    return vibeService.validateVibe(vibeId).then(() => {
      return this.byId(tripId).then((trip) => {
        const updatedTrip = {
          ...trip,
          vibeId
        };
        trips.set(trip.id, updatedTrip);
        tripEmitter.emit(tripId, updatedTrip);
      });
    });
  }

  getDriverContactInfoById(tripId: string): Promise<ContactInfo> {
    log.info(`Retrieving contact info for trip with tripId: [${tripId}]`);

    return this.byId(tripId).then((trip) => {
      if (trip.contactInfo) {
        return trip.contactInfo;
      } else {
        log.info(`Generating a private phone number for trip with tripId: [${tripId}]`);

        const phoneNumber = _.sample(sharedPhoneNumbers);
        const updatedTrip = {
          ...trip,
          contactInfo: {
            phoneNumber
          }
        };
        trips.set(trip.id, updatedTrip);

        return updatedTrip.contactInfo;
      }
    });
  }

  requestIdentificationById(tripId: string, color: string): Promise<void> {
    log.info(`Request identification for trip with tripId: [${tripId}] with color: [${color}]`);

    return this.byId(tripId).then(() => {
      // TODO: Call the vehicle-service to flash the identification lights with the given color
      return;
    });
  }
}

export default new TripService();