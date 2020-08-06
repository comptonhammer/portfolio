//@ts-check
module.exports = function(app) {
    let ensureAuthenticated = require('../middleware/ensure_authenticated');
    let bruteforce = require('../middleware/bruteforce');
    const controller = require('./controller');

    require('./users/router')(app);
    require('./admin/router')(app);

    app.get('/leadjuju', controller.loginPage);
    app.get('/login', controller.loginPage);
    app.get('/', controller.loginPage);

    app.get('/home', ensureAuthenticated, controller.homePage);

    app.get('/details', ensureAuthenticated, controller.leadPage);

    app.get('/settings', ensureAuthenticated, controller.settingsPage);

    app.get('/template', controller.downloadTemplate);

    app.post('/logout', ensureAuthenticated, controller.logout);

    app.get('/register', controller.registerPage);

    app.get('/file/download', ensureAuthenticated, controller.sendFileToUser);

    app.get('/file/delete', ensureAuthenticated, controller.deleteFile);

    app.get('/history', ensureAuthenticated, controller.historyPage);

    app.get('/privacy', controller.privacy);

    app.get('/terms', controller.terms);

    app.post('/login', bruteforce.prevent, controller.login);

    app.post('/settings/update', ensureAuthenticated, controller.updateSettings);
};
