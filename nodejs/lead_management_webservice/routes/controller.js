const fs = require('fs');
const passport = require('../middleware/passport');
const repo = require('./repository');
const logger = require('../common/logger');

function purchasePage(req, res){
    fs.readFile(global.appRoot + '/items.json', (err, data) => {
        if(err){ 
            res.status(500).end();
            logger.log('main', `Error finding items.json, more info=> ${err}`);
        }
        else{ 
            let attr = repo.createLeadViewAttr(req.user);
            attr.items = JSON.parse(data).items;
            attr.stripePublicKey = process.env.STRIPE_PUB_KEY;
            attr.active.buy.css = 'active';

            res.render('buy', attr);
        }
    })
}

function loginPage(req, res){
    if(req.user) 
        res.redirect(`/user/${req.user.username}/dash/cell`)
    else 
        res.render('login', {
            redir: req.query.redir
        });
}

function login(req, res){
    passport.authenticate('local', function(err, account){
        if (err){ 
            logger.log('main', `Error logging in for ${req.body.username}, couldn't connect to server`);
            return res.render('login', {
                username: req.body.username, 
                redir: req.body.redir || '', 
                message:{
                    error: true, 
                    message:"Couldn't connect to the server."
                }
                
            });
        }
        else if(!account) 
            return res.render('login', {
                username: req.body.username, 
                redir: req.body.redir, 
                message:{
                    error: true, 
                    message:"Couldn't find that account."
                }
            });
        const redir = req.body.redir == '' 
            ? `/user/${account.username}/dash/cell` 
            : req.body.redir; // redir is the page they were trying to access
        req.login(account, (err) => {
            if(err){
                logger.log('main', `Error logging in for ${account.username}, more info- ${err}`);
                let attr = {
                    username: account.username, 
                    redir: req.body.redir, 
                    message:{
                        error: true, 
                        message:"There was an error logging in. Try again."
                    }
                };
                res.render('login', attr);
            }
            else if(account.username === "admin")
                res.redirect('/admin');
            else if(!account.organization_code){
                res.redirect(`/user/${account.username}/org/add`);
            }
            else res.redirect(redir);
        })
    })(req, res); 
}

function logout(req, res){
    req.logout();
    res.redirect('/');
}

function dashboardPage(req, res){
    let page = req.query.page || 0;
    let limit = req.query.limit || 25;

    if(page < 0) page = 0;
    if(limit < 0) limit = 0;

    let sorted = repo.sortDashNewOldDead(req.user.leads, page, limit);
    let attr = repo.createLeadViewAttr(req.user);
    attr.active.dash.css = 'active';
    attr.active.dash.includeFeatures = true;

    attr.leads = sorted;
    attr.limit = limit;
    attr.page = page;

    res.render('dash', attr);
}

function cellboardPage(req, res){
    let page = req.query.page || 0;
    let limit = req.query.limit || 25;

    if(page < 0) 
        page = 0;
    if(limit < 0) 
        limit = 0;

    let sorted = repo.sortDashNewOldDead(req.user.leads, page, limit);
    let attr = repo.createLeadViewAttr(req.user);
    attr.active.cell.css = 'active';
    attr.active.dash.includeFeatures = true;

    attr.leads = sorted;
    attr.limit = limit;
    attr.page = page;

    res.render('dash_cellview', attr);
}

function statsPage(req, res){
    let attr = repo.createLeadViewAttr(req.user);
    attr.active.stats.css = 'active';
    attr.active.dash.includeFeatures = true;

    attr.data = repo.getUserStats(req.user);

    res.render('dash_stats', attr);
}

function archivePage(req, res){
    let attr = repo.createLeadViewAttr(req.user);
    attr.active.archive.css = 'active';
    attr.active.dash.includeFeatures = true;

    attr.leads = repo.sortArchiveNewOld(req.user.archived_leads);

    res.render('archive', attr);
}

function purchaseSuccessPage(req, res){
    let amt = req.query.amt;
    let attr = repo.createLeadViewAttr(req.user);
    
    attr.tags = [
        {
            title:'Purchase Successful',
            class:'active',
            href:''
        }
    ];
    attr.amountAdded = amt;

    res.render('purchase_success', attr);
}

module.exports = {
    purchasePage,
    login,
    loginPage,
    logout,
    dashboardPage,
    cellboardPage,
    archivePage,
    purchaseSuccessPage,
    statsPage
}