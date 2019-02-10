import express from 'express';
import controller from './controller'

export default express.Router()
  .get('/current', controller.currentByUser)
  .get('/:id', controller.byId)
  .delete('/:id', controller.cancel)
  .put('/:id/note', controller.setNote)
  .put('/:id/vibe', controller.setVibe)
  .post('/:id/vehicle/identification-request', controller.requestIdentification);