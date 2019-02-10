import TripsService from '../../services/trips.service';
import {Request, Response} from 'express';

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
      if (!result) {
        res.status(404).end();
      } else {
        res.json(result);
      }
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

}
export default new Controller();
