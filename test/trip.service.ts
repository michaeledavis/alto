import 'mocha';
import {Trip} from '../server/api/models/trip.models';
import {expect} from 'chai';
import {TripNotFoundError} from "../server/api/errors/errors";
import moment from "moment";
import {TripService} from "../server/api/services/trip.service";
import tripEmitter from '../server/api/emitters/trip.eventemitter';

describe('TripService', () => {

  const trips = new Map<string, Trip>();
  const trip = {
    id: '1',
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
  };
  trips.set(trip.id, trip);

  const sharedPhoneNumbers = [
    '+15558908989',
    '+15558908654',
    '+15558906735',
    '+15558901111',
  ];

  let tripService: TripService;

  beforeEach(() => {
    console.log('blah');
    tripService = new TripService(trips, sharedPhoneNumbers);
  });

  it('should return the trip', async () => {
    const result = await tripService.byId(trip.id);

    expect(result.id)
      .to.equal(trip.id);

    expect(result.vehicle)
      .to.have.property('imageURI');
    expect(result.vehicle)
      .to.have.property('makeAndModel');
    expect(result.vehicle)
      .to.have.property('color');
    expect(result.vehicle)
      .to.have.property('name');
    expect(result.vehicle)
      .to.have.property('seats');

    expect(result.driver)
      .to.have.property('friendlyName');
    expect(result.driver)
      .to.have.property('description');
  });

  it('should throw a TripNotFoundError for a missing trip', async () => {
    try {
      await tripService.byId('abcd');
      expect.fail();
    } catch(err) {
      expect(err).to.be.an.instanceOf(TripNotFoundError);
    }
  });

  it('should return the user\'s current trip', async () => {
    const result = await tripService.currentByUser(trip.userId);

    expect(result.id)
      .to.equal(trip.id);
  });

  it('should throw a TripNotFoundError when the user doesn\'t have a current trip', async () => {
    try {
      await tripService.currentByUser('abcd');
      expect.fail();
    } catch(err) {
      expect(err).to.be.an.instanceOf(TripNotFoundError);
    }
  });

  it('should cancel the trip', async () => {
    let emitted = false;
    tripEmitter.once(trip.id, () => {
      emitted = true;
    });

    const result = await tripService.cancelById(trip.id);

    expect(result)
      .to.be.undefined;
    expect(emitted).to.equal(true);
  });

  it('should throw a TripNotFoundError cancelling a non-existent trip', async () => {
    try {
      await tripService.cancelById('abcd');
      expect.fail();
    } catch(err) {
      expect(err).to.be.an.instanceOf(TripNotFoundError);
    }
  });

  it('should set a note', async () => {
    const updatedNote = 'This is an updated note';

    let emitted = false;
    tripEmitter.once(trip.id, () => {
      emitted = true;
    });

    await tripService.setNoteById(trip.id, updatedNote);
    const result = await tripService.byId(trip.id);

    expect(result)
      .to.have.property('note').and.to.equal(updatedNote);
    expect(emitted).to.equal(true);
  });

  it('should throw a TripNotFoundError setting a note on a non-existent trip', async () => {
    try {
      await tripService.setNoteById('abcd', 'note');
      expect.fail();
    } catch(err) {
      expect(err).to.be.an.instanceOf(TripNotFoundError);
    }
  });

  it('should set the vibe', async () => {
    const updatedVibe = 'FIZZ';

    let emitted = false;
    tripEmitter.once(trip.id, () => {
      emitted = true;
    });

    await tripService.setVibeById(trip.id, updatedVibe);
    const result = await tripService.byId(trip.id);

    expect(result)
      .to.have.property('vibeId').and.to.equal(updatedVibe);
    expect(emitted).to.equal(true);
  });

  it('should throw a TripNotFoundError setting a vibe on a non-existent trip', async () => {
    try {
      await tripService.setVibeById('abcd', 'FIZZ');
      expect.fail();
    } catch(err) {
      expect(err).to.be.an.instanceOf(TripNotFoundError);
    }
  });

  it('should get the driver contact info', async () => {
    const result = await tripService.getDriverContactInfoById(trip.id);

    expect(result)
      .to.have.property('phoneNumber')
      .and.to.be.oneOf(sharedPhoneNumbers);
  });

  it('should get the same driver contact info when called twice', async () => {
    const result = await tripService.getDriverContactInfoById(trip.id);

    expect(result)
      .to.have.property('phoneNumber')
      .and.to.be.oneOf(sharedPhoneNumbers);

    const phoneNumber = result.phoneNumber;

    const secondResult = await tripService.getDriverContactInfoById(trip.id);

    expect(secondResult)
      .to.have.property('phoneNumber')
      .and.to.equal(phoneNumber);
  });

  it('should throw a TripNotFoundError for get contact info on a non-existent trip', async () => {
    try {
      await tripService.getDriverContactInfoById('abcd');
      expect.fail();
    } catch(err) {
      expect(err).to.be.an.instanceOf(TripNotFoundError);
    }
  });

  it('should identify the vehicle', async () => {
    const result = await tripService.requestIdentificationById(trip.id, '#FF0001');

    expect(result)
      .to.be.undefined;
  });

  it('should throw a TripNotFoundError cancelling a non-existent trip', async () => {
    try {
      await tripService.requestIdentificationById('abcd', '#FF0001');
      expect.fail();
    } catch(err) {
      expect(err).to.be.an.instanceOf(TripNotFoundError);
    }
  });

});
