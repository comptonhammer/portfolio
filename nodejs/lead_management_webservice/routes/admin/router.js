module.exports = function(app){
    const ensureAdmin = require('../../middleware/ensure_admin');
    const controller = require('./controller');

    app.get('/admin', ensureAdmin, controller.adminPage);

    app.get('/admin/accounts', ensureAdmin, controller.accountsPage);

    app.get('/admin/limits', ensureAdmin, controller.adminPage);

    //app.get('/admin/robins', ensureAdmin, controller.adminPage);

    app.get('/admin/reimbursements', ensureAdmin, controller.reimbursementPage);

    app.get('/admin/reimbursements/:id', ensureAdmin, controller.reimbursementPage);

    app.get('/admin/orgs', ensureAdmin, controller.organizationsPage);

    app.get('/admin/accounts/:username', ensureAdmin, controller.editUserPage);

    app.get('/admin/leads', ensureAdmin, controller.allLeadsPage);

    app.post('/admin/accounts/:username/save', ensureAdmin, controller.adminPage);

    app.post('/admin/accounts/:username/increment', ensureAdmin, controller.increment);

    app.post('/admin/accounts/:username/decrement', ensureAdmin, controller.decrement);

    app.post('/admin/accounts/:username/pause', ensureAdmin, controller.pause);

    app.post('/admin/accounts/:username/unpause', ensureAdmin, controller.unPause);
    
    app.post('/admin/accounts/:username/org/change', ensureAdmin, controller.changeOrg);

}