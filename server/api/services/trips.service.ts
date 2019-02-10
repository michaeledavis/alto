import Promise from 'bluebird';
import log from '../../common/logger'
import _ from 'lodash';
import moment from 'moment';
import {Moment} from "moment";

interface Money {
    currency: string,
    amount: number,
}

interface FareEstimate {
    lowEstimate: Money,
    highEstimate: Money
}

interface GpsCoordinates {
    latitude: number,
    longitude: number
}

interface Location {
    shortName?: string,
    fullName: string[],
    coordinates: GpsCoordinates
}

interface Driver {
    friendlyName: string,
    description: string
}

interface Vehicle {
    imageURI: string,
    makeAndModel: string,
    color: string,
    name: string
}

interface Vibe {
    name: string
}

interface Trip {
    id: string,
    userId: string,
    estimatedArrival: Moment,
    requested: Moment,
    completed?: Moment,
    cancelled?: Moment,
    estimatedFare: FareEstimate,
    note: string,
    destination: Location,
    origin: Location,
    vehicle: Vehicle,
    driver: Driver,
    vibe: Vibe
}

let trips = new Map<string, Trip>();
trips.set('1234', {
    id: '1234',
    userId: '5654',
    estimatedArrival: moment().add(20, 'minutes'),
    requested: moment(),
    estimatedFare: {
        lowEstimate: {
            currency: 'USD',
            amount: 65
        },
        highEstimate: {
            currency: 'USD',
            amount: 75
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
        shortName: null,
        fullName: [
            '449 Flora St.',
            'Dallas, Texas 75201'
        ],
        coordinates: {
            latitude: 32.890453,
            longitude: -97.036203
        }
    },
    vehicle: {
        imageURI: '/images/alto09',
        makeAndModel: '2019 Volkswagen Atlas',
        color: 'Pure White',
        name: 'Alto 09'
    },
    driver: {
        friendlyName: 'Steph',
        description: 'Steph Festiculma is a graduate of Parsons New School in New York and fluent in' +
            'Portuguese, Spanish, and English. Steph has been driving with Alto since 2018.'
    },
    vibe: {
        name: 'Vaporwave Beats'
    }
});

export class TripsService {

    byId(tripId: string): Promise<Trip> {
        log.info(`Retrieving trip for tripId: [${tripId}]`);
        const trip = trips.get(tripId);

        if (!trip) {
            log.warn(`Current trip could not be found for tripId: [${tripId}]`);
            return Promise.resolve(null);
        } else {
            log.info(`Returning trip with tripId: [${tripId}]`);
            return Promise.resolve(trip);
        }
    }

    currentByUser(userId: string): Promise<Trip> {
        log.info(`Retrieving current trip for userId: [${userId}]`);
        const currentTrip = _.find([...trips.values()], (trip) => {
            return trip.userId === userId && !trip.cancelled && !trip.completed && trip.requested.isBefore(moment());
        });

        if (!currentTrip) {
            log.warn(`Current trip could not be found for userId: [${userId}]`);
            return Promise.resolve(null);
        } else {
            log.info(`Returning trip with tripId: [${currentTrip.id}] for userId: [${userId}]`);
            return Promise.resolve(currentTrip);
        }
    }

    cancelById(tripId: string): Promise<void> {
        log.info(`Cancelling trip for tripId: [${tripId}]`);

        return this.byId(tripId).then((trip) => {
            if (!trip) {
                throw new Error(`Could not find trip for tripId: [${tripId}]`);
            }
            trips.set(trip.id, {...trip,
                cancelled: moment()
            });
        });
    }
}

export default new TripsService();