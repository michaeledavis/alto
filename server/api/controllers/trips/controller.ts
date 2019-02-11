import tripsService from '../../services/trip.service';
import {Request, Response} from 'express';
import tripEmitter from '../../emitters/trip.eventemitter';

export class Controller {

  currentByUser(req: Request, res: Response, next: any): void {
    // TODO: Get the current user from their authentication
    tripsService.currentByUser('5654').then(result => {
      if (!result) {
        res.status(404).end();
      } else {
        res.json(result);
      }
    }).catch(next);
  }

  byId(req: Request, res: Response, next: any): void {
    tripsService.byId(req.params.id).then(result => {
      res.json(result);
    }).catch(next);
  }

  streamTripUpdates(req: Request, res: Response, next: any): void {
    const tripId = req.params.id;

    tripsService.byId(tripId).then(_ => {

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

      tripEmitter.addListener(tripId, listener);

      console.log(tripEmitter.listenerCount(tripId));

      req.on('close', () => {
        clearInterval(heartbeat);
        tripEmitter.removeListener(tripId, listener);
      });

    }).catch(next);
  }

  cancel(req: Request, res: Response, next: any): void {
    tripsService.cancelById(req.params.id).then(() => {
      res.status(204).end();
    }).catch(next);
  }

  setNote(req: Request, res: Response, next: any): void {
    tripsService.setNoteById(req.params.id, req.body.note).then(() => {
      res.status(204).end();
    }).catch(next);
  }

  setVibe(req: Request, res: Response, next: any): void {
    tripsService.setVibeById(req.params.id, req.body.vibeId).then(() => {
      res.status(204).end();
    }).catch(next);
  }

  requestIdentification(req: Request, res: Response, next: any): void {
    tripsService.requestIdentificationById(req.params.id, req.body.color).then(() => {
      res.status(204).end();
    }).catch(next);
  }

}
export default new Controller();
