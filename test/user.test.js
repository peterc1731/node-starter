/* eslint-disable no-unused-expressions */

const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../api/server');
const config = require('../config');
const User = require('../api/models/User');
const helpers = require('./helpers');

const testEmail = 'test';
const testPass = 'test';
const testUser = 'test';

describe('User Integration Tests', () => {
  before((done) => {
    if (!(mongoose.connection.readyState === 1)) {
      mongoose.connection.once('open', () => {
        setTimeout(done, 100);
      });
    } else {
      done();
    }
  });

  after(() => User.remove({}));

  describe('[POST] /register', () => {
    it('should successfully create a new user when posting valid user data', () => request(app)
      .post(`${config.baseUrl}/register`)
      .send({
        name: testUser,
        email: testEmail,
        password: testPass,
      })
      .expect(200)
      .then((res) => {
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.equal('User test successfully created');
      }));

    it('should return a 400 error when posting invalid user data', () => request(app)
      .post(`${config.baseUrl}/register`)
      .send({
        name: '',
        password: testPass,
      })
      .expect(400)
      .then((res) => {
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('Invalid user data');
      }));
  });

  describe('[POST] /login', () => {
    it('should successfully login a user when posting valid user data', () => request(app)
      .post(`${config.baseUrl}/login`)
      .send({
        email: testEmail,
        password: testPass,
      })
      .expect(200)
      .then((res) => {
        expect(res.body.success).to.be.true;
        expect(res.body.token).to.not.be.undefined;
      }));

    it('should return a 404 error when the user does not exist', () => request(app)
      .post(`${config.baseUrl}/login`)
      .send({
        email: 'test1',
        password: testPass,
      })
      .expect(404)
      .then((res) => {
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('User not found.');
      }));

    it('should return a 401 error when the password is incorrect', () => request(app)
      .post(`${config.baseUrl}/login`)
      .send({
        email: testEmail,
        password: 'test1',
      })
      .expect(401)
      .then((res) => {
        expect(res.body.success).to.be.false;
        expect(res.body.token).to.be.null;
      }));
  });

  describe('[GET] /me', () => {
    it('should successfully return user data when a valid token is provided', () => request(app)
      .get(`${config.baseUrl}/me`)
      .set('Authorization', `Bearer ${helpers.getToken(testUser)}`)
      .expect(200)
      .then((res) => {
        expect(res.body.success).to.be.true;
        expect(res.body.user.email).to.equal(testEmail);
      }));

    it('should return a 404 error when the user does not exist', () => request(app)
      .get(`${config.baseUrl}/me`)
      .set('Authorization', `Bearer ${helpers.getToken('test1')}`)
      .expect(404)
      .then((res) => {
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('User not found.');
      }));

    it('should return a 401 error when no token is provided', () => request(app)
      .get(`${config.baseUrl}/me`)
      .expect(401)
      .then((res) => {
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('No token provided. Format is: Bearer [token]');
      }));

    it('should return a 401 error when the token is invalid', () => request(app)
      .get(`${config.baseUrl}/me`)
      .set('Authorization', 'Bearer abc123')
      .expect(401)
      .then((res) => {
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('Failed to authenticate token.');
      }));
  });

  describe('[GET] /logout', () => {
    it('should return a null token when a valid token is provided', () => request(app)
      .get(`${config.baseUrl}/logout`)
      .set('Authorization', `Bearer ${helpers.getToken(testUser)}`)
      .expect(200)
      .then((res) => {
        expect(res.body.success).to.be.true;
        expect(res.body.token).to.be.null;
      }));

    it('should return a 404 error when the user does not exist', () => request(app)
      .get(`${config.baseUrl}/logout`)
      .set('Authorization', `Bearer ${helpers.getToken('test1')}`)
      .expect(404)
      .then((res) => {
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('User not found.');
      }));

    it('should return a 401 error when no token is provided', () => request(app)
      .get(`${config.baseUrl}/logout`)
      .expect(401)
      .then((res) => {
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('No token provided. Format is: Bearer [token]');
      }));

    it('should return a 401 error when the token is invalid', () => request(app)
      .get(`${config.baseUrl}/logout`)
      .set('Authorization', 'Bearer abc123')
      .expect(401)
      .then((res) => {
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('Failed to authenticate token.');
      }));
  });

  describe('[GET] /unregister', () => {
    it('should successfully remove a user when a valid token is provided', () => request(app)
      .get(`${config.baseUrl}/unregister`)
      .set('Authorization', `Bearer ${helpers.getToken(testUser)}`)
      .expect(200)
      .then((res) => {
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.equal('User successfully removed');
        expect(User.findOne({ user: testUser }).then((user => user))).to.be.empty;
      }));

    it('should return a 404 error when the user does not exist', () => request(app)
      .get(`${config.baseUrl}/unregister`)
      .set('Authorization', `Bearer ${helpers.getToken('test1')}`)
      .expect(404)
      .then((res) => {
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('User not found.');
      }));

    it('should return a 401 error when no token is provided', () => request(app)
      .get(`${config.baseUrl}/unregister`)
      .expect(401)
      .then((res) => {
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('No token provided. Format is: Bearer [token]');
      }));

    it('should return a 401 error when the token is invalid', () => request(app)
      .get(`${config.baseUrl}/unregister`)
      .set('Authorization', 'Bearer abc123')
      .expect(401)
      .then((res) => {
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('Failed to authenticate token.');
      }));
  });
});
