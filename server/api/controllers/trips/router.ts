import express from 'express';
import controller from './controller'

export default express.Router()
  .get('/current', controller.currentByUser)
  .get('/:id', controller.byId)
  .delete('/:id', controller.cancel)
  .put('/:id/note', controller.setNote);