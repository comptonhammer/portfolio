module.exports = function(app){
    const controller = require('./controller');
    const ensureAuth = require('../middleware/ensure_auth');
    const limiter = require('../middleware/limiter');

    if(process.env.ENVIRONMENT === "PROD"){ // Apply rate limiter in production
        app.get('/', limiter.standard, controller.loginPage);
        app.get('/login', limiter.standard, controller.loginPage);
        app.post('/login', limiter.standard, controller.login);
    }
    else{
        app.get('/', controller.loginPage);
        app.get('/login', controller.loginPage);
        app.post('/login', controller.login);
    }

    app.get('/logout', controller.logout);

    app.get('/buy', ensureAuth, controller.purchasePage);

    app.get('/purchase-success', ensureAuth, controller.purchaseSuccessPage);

    app.get('/archive', ensureAuth, controller.archivePage);

    //TODO move these:
    app.get('/user/:username/dash', ensureAuth, controller.dashboardPage);

    app.get('/user/:username/dash/cell', ensureAuth, controller.cellboardPage);

    app.get('/user/:username/dash/stats', ensureAuth, controller.statsPage);
    //END TODO

    require('./users/router')(app);
    require('./leads/router')(app); // Basically admin-only lead editing stuff
    require('./robins/router')(app); // The id maker and counter for round robin
    require('./register/router')(app); // Contains 'forgot password' router/controller as well.
    require('./admin/router')(app);
    
    return app;
}