/* eslint-disable no-unused-expressions */

const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../api/server');
const config = require('../config');
const Post = require('../api/models/Post');

const testTitle = 'Test Title';
const testAuthor = 'Mr Test';
const testBody = 'test';
const invalidPostId = 'test';
const missingPostId = mongoose.Types.ObjectId.createFromTime(Date.now());
const updatedPostTitle = 'New Title';
let testPostId = '';

describe('Post Integration Tests', () => {
  before((done) => {
    if (!(mongoose.connection.readyState === 1)) {
      mongoose.connection.once('open', () => {
        setTimeout(done, 100);
      });
    } else {
      done();
    }
  });

  after(() => Post.remove({}));

  describe('[POST] /posts', () => {
    it('should successfully create a new post when sending valid data', () => request(app)
      .post(`${config.baseUrl}/posts`)
      .send({
        title: testTitle,
        author: testAuthor,
        body: testBody,
      })
      .expect(200)
      .then((res) => {
        expect(res.body.title).to.equal(testTitle);
        expect(res.body.author).to.equal(testAuthor);
        expect(res.body.body).to.equal(testBody);
      }));

    it('should return a 400 error when posting invalid data', () => request(app)
      .post(`${config.baseUrl}/posts`)
      .send({
        name: 'test',
        bob: true,
      })
      .expect(400)
      .then((res) => {
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal('Invalid Post Data');
      }));
  });

  describe('[GET] /posts', () => {
    it('should get all posts', () => request(app)
      .get(`${config.baseUrl}/posts`)
      .expect(200)
      .then((res) => {
        expect(res.body[0].title).to.equal(testTitle);
        expect(res.body[0].author).to.equal(testAuthor);
        expect(res.body[0].body).to.equal(testBody);
        expect(res.body[0]._id).to.not.be.undefined;
        return res;
      })
      .then((res) => {
        testPostId = res.body[0]._id;
      }));
  });

  describe('[GET] /posts/:post_id', () => {
    it('should get a post by id', () => request(app)
      .get(`${config.baseUrl}/posts/${testPostId}`)
      .expect(200)
      .then((res) => {
        expect(res.body.title).to.equal(testTitle);
        expect(res.body.author).to.equal(testAuthor);
        expect(res.body.body).to.equal(testBody);
      }));

    it('should return a 404 when there is no post with the specified id', () => request(app)
      .get(`${config.baseUrl}/posts/${missingPostId}`)
      .expect(404)
      .then((res) => {
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal(`No post found with id: ${missingPostId}`);
      }));

    it('should return a 400 when the post id supplied is an invalid id', () => request(app)
      .get(`${config.baseUrl}/posts/${invalidPostId}`)
      .expect(400)
      .then((res) => {
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal(`Invalid ObjectId: ${invalidPostId}`);
      }));
  });

  describe('[PUT] /posts/:post_id', () => {
    it('should update a post by id', () => request(app)
      .put(`${config.baseUrl}/posts/${testPostId}`)
      .send({
        title: updatedPostTitle,
      })
      .expect(200)
      .then((res) => {
        expect(res.body.title).to.equal(updatedPostTitle);
        expect(res.body.author).to.equal(testAuthor);
        expect(res.body.body).to.equal(testBody);
      }));

    it('should return 200 but not update a post when sending invalid data', () => request(app)
      .put(`${config.baseUrl}/posts/${testPostId}`)
      .send({
        name: 'test',
        bob: true,
      })
      .expect(200)
      .then((res) => {
        expect(res.body.title).to.equal(updatedPostTitle);
        expect(res.body.author).to.equal(testAuthor);
        expect(res.body.body).to.equal(testBody);
        expect(res.body.name).to.be.undefined;
        expect(res.body.bob).to.be.undefined;
      }));

    it('should return a 404 when there is no post with the specified id', () => request(app)
      .put(`${config.baseUrl}/posts/${missingPostId}`)
      .send({
        title: updatedPostTitle,
      })
      .expect(404)
      .then((res) => {
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal(`No post found with id: ${missingPostId}`);
      }));

    it('should return a 400 when the post id supplied is an invalid id', () => request(app)
      .put(`${config.baseUrl}/posts/${invalidPostId}`)
      .send({
        title: updatedPostTitle,
      })
      .expect(400)
      .then((res) => {
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal(`Invalid ObjectId: ${invalidPostId}`);
      }));
  });

  describe('[DELETE] /posts/:post_id', () => {
    it('should delete a post by id', () => request(app)
      .delete(`${config.baseUrl}/posts/${testPostId}`)
      .expect(200)
      .then((res) => {
        expect(res.body.title).to.equal(updatedPostTitle);
        expect(res.body.author).to.equal(testAuthor);
        expect(res.body.body).to.equal(testBody);
      }));

    it('should return a 404 when there is no post with the specified id', () => request(app)
      .delete(`${config.baseUrl}/posts/${missingPostId}`)
      .expect(404)
      .then((res) => {
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal(`No post found with id: ${missingPostId}`);
      }));

    it('should return a 400 when the post id supplied is an invalid id', () => request(app)
      .delete(`${config.baseUrl}/posts/${invalidPostId}`)
      .expect(400)
      .then((res) => {
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal(`Invalid ObjectId: ${invalidPostId}`);
      }));
  });
});
