const userController = require('../controllers/PostController');
const authController = require('../controllers/AuthController');
const verifyToken = require('../middleware/verifyToken');

const { baseUrl } = require('../../config.json');

module.exports = (app) => {
  app.route(`${baseUrl}/posts`)
    .get(userController.get_all_posts)
    .post(userController.create_a_post);

  app.route(`${baseUrl}/posts/:id`)
    .get(userController.get_a_post)
    .put(userController.update_a_post)
    .delete(userController.delete_a_post);

  app.route(`${baseUrl}/register`)
    .post(authController.register_a_new_user);

  app.route(`${baseUrl}/me`)
    .get(verifyToken, authController.get_user_from_token);

  app.route(`${baseUrl}/unregister`)
    .get(verifyToken, authController.unregister_a_user);

  app.route(`${baseUrl}/login`)
    .post(authController.login_an_existing_user);

  app.route(`${baseUrl}/logout`)
    .get(verifyToken, authController.logout_a_user);
};
