import 'mocha';
import { expect } from 'chai';
import request from 'supertest';
import Server from '../server';

describe('Trips', () => {

  it('should get the current trip', async () => {
    const result = await request(Server)
      .get('/api/v1/trips/current')
      .expect('Content-Type', /json/);

      expect(result.body)
        .to.be.an('object');
      expect(result.status)
        .to.equal(200);
  });

  it('should get the trip by id', async () => {
    const result = await request(Server)
      .get('/api/v1/trips/1234')
      .expect('Content-Type', /json/);

    expect(result.body)
      .to.be.an('object');
    expect(result.status)
      .to.equal(200);
  });

  it('should return a 404 for a non-existent trip', async () => {
    const result = await request(Server)
      .get('/api/v1/trips/5678')
      .expect('Content-Type', /json/);

    expect(result.body)
      .to.be.an('object');
    expect(result.status)
      .to.equal(404);
  });

  it('should delete a trip', async () => {
    const result = await request(Server)
      .delete('/api/v1/trips/1234');

    expect(result.body)
      .to.be.an('object');
    expect(result.status)
      .to.equal(204);
  });

  it('should return a 404 when deleting a non-existent trip', async () => {
    const result = await request(Server)
      .delete('/api/v1/trips/5678');

    expect(result.body)
      .to.be.an('object');
    expect(result.status)
      .to.equal(404);
  });

  it('should update a trip\'s note', async () => {
    const tripId = '1234';
    const updatedNote = 'updated note';

    const result = await request(Server)
      .put(`/api/v1/trips/${tripId}/note`)
      .send({note: updatedNote});

    expect(result.body)
      .to.be.an('object');
    expect(result.status)
      .to.equal(204);

    const updatedResult = await request(Server)
      .get(`/api/v1/trips/${tripId}`);

    expect(updatedResult.body)
      .to.be.an('object');
    expect(updatedResult.status)
      .to.equal(200);
    expect(updatedResult.body.note)
      .to.equal(updatedNote);
  });

  it('should return a 404 when updating a non-existent trip\'s note', async () => {
    const tripId = '5678';
    const updatedNote = 'updated note';

    const result = await request(Server)
      .put(`/api/v1/trips/${tripId}/note`)
      .send({note: updatedNote});

    expect(result.body)
      .to.be.an('object');
    expect(result.status)
      .to.equal(404);
  });

  it('should update a trip\'s vibe', async () => {
    const tripId = '1234';
    const updatedVibe = 'FIZZ';

    const result = await request(Server)
      .put(`/api/v1/trips/${tripId}/vibe`)
      .send({vibe: updatedVibe});

    expect(result.body)
      .to.be.an('object');
    expect(result.status)
      .to.equal(204);

    const updatedResult = await request(Server)
      .get(`/api/v1/trips/${tripId}`);

    expect(updatedResult.body)
      .to.be.an('object');
    expect(updatedResult.status)
      .to.equal(200);
    expect(updatedResult.body.vibeId)
      .to.equal(updatedVibe);
  });

  it('should return a 404 when updating a non-existent trip\'s vibe', async () => {
    const tripId = '5678';
    const updatedVibe = 'FIZZ';

    const result = await request(Server)
      .put(`/api/v1/trips/${tripId}/vibe`)
      .send({vibe: updatedVibe});

    expect(result.body)
      .to.be.an('object');
    expect(result.status)
      .to.equal(404);
  });

  it('should return a 400 when updating to an invalid vibe', async () => {
    const tripId = '5678';
    const updatedVibe = 'FIZZBUZZ';

    const result = await request(Server)
      .put(`/api/v1/trips/${tripId}/vibe`)
      .send({vibe: updatedVibe});

    expect(result.body)
      .to.be.an('object');
    expect(result.status)
      .to.equal(400);
  });

  it('should request vehicle identification', async () => {
    const result = await request(Server)
      .post(`/api/v1/trips/1234/vehicle/identification-request`)
      .send({color: '#FF0011'});

    expect(result.body)
      .to.be.an('object');
    expect(result.status)
      .to.equal(204);
  });

  it('should return a 404 when requesting vehicle identification for a non-existent trip', async () => {
    const result = await request(Server)
      .post(`/api/v1/trips/5678/vehicle/identification-request`)
      .send({color: '#FF0011'});

    expect(result.body)
      .to.be.an('object');
    expect(result.status)
      .to.equal(404);
  });

});
