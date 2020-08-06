const User = require('../../models/users');
const Reimbursements = require('../../models/reimbursement_requests');
const Orgs = require('../../models/organizations');

const leadRepo = require('../leads/repository');

function getAllLeads(page, callback){
    leadRepo.getAllLeadsInDB((err, leads) => {
        let paginated = [];
        for(let i = 50*page; i < 50*page + 50; i++){
            if(!leads[i]) break;
            paginated.push(leads[i]);
        }
        callback(err, paginated);
    })
}

function getAccount(username, callback){
    User.findOne({username}, callback);
}

function getAccounts(callback){
    User.find((err, accounts) => {
        if(err) 
            return callback(global.DB_ERROR);
        let arr = [];
        for(let i = 0; i < accounts.length; i++){ 
            arr.push(accounts[i].username);
        }
        return callback(false, arr);
    })
}

function incrementAccountLeads(username, rating, by, callback){
    User.findOne({username}, (err, account) => {
        if(err) 
            return callback(err);
        if(!account) 
            return callback({code: 404});

        rating = parseInt(rating);
        by = parseInt(by);

        account.data.account.leads_due.set(rating, account.data.account.leads_due[rating] + by);
        account.save(callback);
    })
}

function decrementAccountLeads(username, rating, by, callback){
    User.findOne({username}, (err, account) => {
        if(err) return callback(err);
        if(!account) return callback(true);

        rating = parseInt(rating);
        by = parseInt(by);

        account.data.account.leads_due.set(rating, account.data.account.leads_due[rating] - by);
        account.save(callback);
    })
}

function pauseAccount(username, callback){
    User.findOneAndUpdate({username}, {'data.account.paused': true}, (err) => {
        callback(err);
    })
}

function unpauseAccount(username, callback){
    User.findOneAndUpdate({username}, {'data.account.paused': true}, (err) => {
        callback(err);
    })
}

function getLeadReimbursementRequests(page = 0, callback){
    Reimbursements.find({solved: false}, (err, reqs) => {
        if(err) 
            return callback(err);
        let i, passedReqs = [];
        for(i in reqs){
            if(i < page*25 + 25)
                passedReqs.push({
                    id: reqs[i].id,
                    username: reqs[i].username,
                    created: reqs[i].created,
                    comment: reqs[i].comment,
                    lead_name: reqs[i].lead_name
                });
        }
        callback(false, passedReqs);
    });
}

function getSolvedLeadReimbursementRequests(page = 0, callback){
    Reimbursements.find({solved: true}, (err, reqs) => {
        if(err) 
            return callback(err);
        let i, passedReqs = [];
        for(i in reqs){
            if(i < page*25 + 25)
                passedReqs.push({
                    id: reqs[i].id,
                    username: reqs[i].username,
                    created: reqs[i].created,
                    comment: reqs[i].comment,
                    lead_name: reqs[i].lead_name
                });
        }
        callback(false, passedReqs);
    });
}

function getOrgs(page = 0, callback){
    Orgs.find({}, (err, organizations) => {
        if(err) 
            return callback(err);
        let i, passedOrgs = [];
        for(i in organizations){
            if(i < page*25 + 25)
            passedOrgs.push({
                    name: organizations[i].name,
                    created: organizations[i].created,
                    code: organizations[i].code,
                    number_users: organizations[i].account_num
                });
        }
        callback(false, passedOrgs);
    });
}

function changeOrg(username, newCode, callback){
    User.findOneAndUpdate({username}, {'data.organization': newCode}, callback);
}

module.exports = {
    getAccount,
    getAccounts,
    incrementAccountLeads,
    decrementAccountLeads,
    getLeadReimbursementRequests,
    getSolvedLeadReimbursementRequests,
    pauseAccount,
    unpauseAccount,
    changeOrg,
    getAllLeads,
    getOrgs
}