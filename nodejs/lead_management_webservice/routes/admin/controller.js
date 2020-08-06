const repo = require('./repository');

function adminPage(req, res){
    res.render('admin/admin', {});
}

function accountsPage(req, res){
    repo.getAccounts((err, accounts) => {
        if(err) 
            return console.log(err);

        res.render('admin/accounts', {accounts});
    })
}

function allLeadsPage(req, res){
    let {page} = req.query;
    if(!page) page = 0;
    repo.getAllLeads(page, (err, leads) => {
        if(err)
            res.send(err);
        else
            res.render('admin/view_leads', {page, leads});
    })
}

function reimbursementPage(req, res){
    let {solved, page} = req.query;
    if(!page) page = 0;

    if(solved){
        repo.getSolvedLeadReimbursementRequests(page, (err, reimbursements) => {
            if(err) 
                return res.send(err);
            if(reimbursements)
                res.render('admin/reimbursements', {reimbursements, page, solved});
            else
                res.render('admin/reimbursements', {reimbursements: [], page, solved});
        })
    }
    else{
        repo.getLeadReimbursementRequests(page, (err, reimbursements) => {
            if(err) 
                return res.send(err);
            if(reimbursements)
                res.render('admin/reimbursements', {reimbursements, page});
            else
                res.render('admin/reimbursements', {reimbursements: [], page});
        })
        
    }
}

function organizationsPage(req, res){
    let {page} = req.query;
    if(!page) page = 0;

    repo.getOrgs(page, (err, orgs) => {
        if(err) 
            return res.send(err);
        if(orgs)
            res.render('admin/orgs', {orgs, page});
        else
            res.render('admin/orgs', {orgs: [], page});
    })
}

function editUserPage(req, res){
    repo.getAccount(req.params.username, (err, doc) =>{
        if(err)
            return res.send(err);
        if(!doc)
            return res.send('404');
        let attr = {
            username: doc.username,
            email: doc.email,
            leads: doc.data.account.max,
            active: doc.data.account.active,
            paused: doc.data.account.paused,
            organization_code: doc.organization_code
        }
        if(req.query.s === '1'){
            attr.msg.color = 'green';
            if(req.query.action === 'i') 
                attr.msg.text = 'User incremented successfully!'
            if(req.query.action === 'd')
                attr.msg.text = 'User decremented successfully.'
        }
        else if(req.query.s === '0')
            attr.msg = {
                text: 'There was an error. Please try again.',
                color: 'red'
            }
        res.render('admin/edit_user', attr);
    })
    
}

function increment(req, res){
    repo.incrementAccountLeads(req.body.username, req.body.rating || 0, req.body.amount, (err) => {
        if(err)
            return res.send(err);
        res.redirect('/admin/accounts/' + req.body.username + '?s=1&action=i');
    })
}

function decrement(req, res){
    repo.incrementAccountLeads(req.body.username, req.body.rating, req.body.amount, (err) => {
        if(err)
            return res.send(err);
        res.redirect('/admin/accounts/' + req.body.username + '?s=1&action=d');
    })
}

function pause(req, res){
    repo.pauseAccount(req.body.username, (err) => {
        if(err)
            return res.send(err);
        res.redirect('/admin/accounts/' + req.body.username);
        
    })
}

function unPause(req, res){
    repo.unpauseAccount(req.body.username, (err) => {
        if(err)
            return res.send(err);
        res.redirect('/admin/accounts/' + req.body.username);
        
    })
}

function changeOrg(req, res){
    const {username, organization_code} = req.body;
    repo.changeOrg(username, organization_code, (err) => {
        if(err)
            return res.send(err);
        res.redirect('/admin/accounts/' + req.body.username);
    })
}

module.exports = {
    adminPage,
    accountsPage,
    increment,
    decrement,
    editUserPage,
    pause,
    unPause,
    changeOrg,
    allLeadsPage,
    reimbursementPage,
    organizationsPage
}