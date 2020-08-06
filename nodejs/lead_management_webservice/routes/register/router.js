module.exports = function(app){
    const controller = require('./controller');
    const limiter = require('../../middleware/limiter');

    if(process.env.ENVIRONMENT === "PROD"){ 
        app.get('/register', limiter.createAccount, controller.registerPage);
        app.post('/register', limiter.createAccount, controller.register);
        app.get('/forgot-password', limiter.createAccount, controller.forgotPasswordPage);
        app.post('/forgot-password', limiter.createAccount, controller.forgotPassword);
        app.get('/reset/:key', limiter.createAccount, controller.changePasswordPage);
        app.post('/reset/:key', limiter.createAccount, controller.changePassword);
    }
    else{
        app.get('/register', controller.registerPage);
        app.post('/register', controller.register);
        app.get('/forgot-password', controller.forgotPasswordPage);
        app.post('/forgot-password', controller.forgotPassword);
        app.get('/reset/:key', controller.changePasswordPage);
        app.post('/reset/:key', controller.changePassword);
    }

    app.get('/register/verify', controller.verificationCodePage);
    app.post('/register/verify', controller.verify);
    
    return app;
}