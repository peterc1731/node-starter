module.exports = function(app) {
    var userController = require('../controllers/UserController'),
        authController = require('../controllers/AuthController')
        verifyToken = require('../helpers/verifyToken')
    
    app.route('/api/users')
        .get(userController.get_all_users)
        .post(userController.create_a_user)
        
    app.route('/api/users/:id')
        .get(userController.get_a_user)
        .put(userController.update_a_user)
        .delete(userController.delete_a_user)
        
    app.route('/api/register')
        .post(authController.register_a_new_user)
        
    app.route('/api/me')
        .get(verifyToken, authController.get_user_from_token)
        
    app.route('/api/login')
        .post(authController.login_an_existing_user)
        
    app.route('/api/logout')
        .get(verifyToken, authController.logout_a_user)
    
};