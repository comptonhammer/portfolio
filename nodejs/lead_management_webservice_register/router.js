module.exports = function(app){
    const controller = require('./controller');
    const limiter = require('../../middleware/limiter');

    app.get('/register', limiter.createAccount, controller.registerPage);
    app.post('/register', limiter.createAccount, controller.register);
    
    app.get('/register/verify', controller.verificationCodePage);
    app.post('/register/verify', controller.verify);

    app.get('/forgot-password', limiter.createAccount, controller.forgotPasswordPage);
    app.post('/forgot-password', limiter.createAccount, controller.forgotPassword);
    
    app.get('/reset/:key', limiter.createAccount, controller.changePasswordPage);
    app.post('/reset/:key', limiter.createAccount, controller.changePassword);
    
    return app;
}
