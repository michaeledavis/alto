import {EventEmitter} from 'events';

// TODO: In a real, production environment, this event solution would need to be horizontally scalable so that users
// would receive updates generated in other instances of the application. I would probably default to using
// Redis for pub/sub support, but Firebase is a good choice if we're already using it
export class TripEmitter extends EventEmitter {}

export default new TripEmitter();