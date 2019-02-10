import TripsService from '../../services/trips.service';
import {Request, Response} from 'express';
import TripEmitter from '../../../common/trip.eventemitter';

export class Controller {

  currentByUser(req: Request, res: Response, next: any): void {
    TripsService.currentByUser('5654').then(result => {
      if (!result) {
        res.status(404).end();
      } else {
        res.json(result);
      }
    }).catch(next);
  }

  byId(req: Request, res: Response, next: any): void {
    TripsService.byId(req.params.id).then(result => {
      res.json(result);
    }).catch(next);
  }

  streamTripUpdates(req: Request, res: Response, next: any): void {
    const tripId = req.params.id;

    TripsService.byId(tripId).then(_ => {

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });

      const heartbeat = setInterval(() => {
        res.write(':heartbeat' + '\n\n');
      }, 1000);

      const listener = (trip) => {
        res.write('data: ' + JSON.stringify(trip) + '\n\n');
      };

      TripEmitter.addListener(tripId, listener);

      console.log(TripEmitter.listenerCount(tripId));

      req.on('close', () => {
        clearInterval(heartbeat);
        TripEmitter.removeListener(tripId, listener);
      });

    }).catch(next);
  }

  cancel(req: Request, res: Response, next: any): void {
    TripsService.cancelById(req.params.id).then(() => {
      res.status(204).end();
    }).catch(next);
  }

  setNote(req: Request, res: Response, next: any): void {
    TripsService.setNoteById(req.params.id, req.body.note).then(() => {
      res.status(204).end();
    }).catch(next);
  }

  setVibe(req: Request, res: Response, next: any): void {
    TripsService.setVibeById(req.params.id, req.body.vibe).then(() => {
      res.status(204).end();
    }).catch(next);
  }

  requestIdentification(req: Request, res: Response, next: any): void {
    TripsService.requestIdentificationById(req.params.id, req.body.color).then(() => {
      res.status(204).end();
    }).catch(next);
  }

}
export default new Controller();
