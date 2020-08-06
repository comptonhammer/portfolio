//@ts-check
let User = require('../models/users/users');

let repository = require('./repository');
let passport = require('../middleware/passport');
let log = require('clg-color');
let bcrypt = require('bcrypt');

let { findModelFromName } = require('./predictive_models');
let { getAllModelNamesExceptOnesThatIncludeTheStringsInThisArray } = require('../models/predictivemodels/predictivemodels');
let { changePassword } = require('./users');

function loginPage(req, res){
  if(req.user) 
    res.redirect('/home');
  else 
    res.render('login',{ title: "Login" });
}

function homePage(req, res){ //pred analytics home
  res.render('home', {
    title: 'Home',
    user: req.user.username,
    model: req.user.ml_model.name,
    type: req.user.account.type,
    pulls: req.user.account.pulls,
    pullsLeft: req.user.account.throttle - req.user.account.pulls,
    sendTo: req.user.account.email
  });
}

function leadPage(req, res){ //pred analytics infopage
  const {
    addr, 
    givenName, 
    phone, 
    leadDate, 
    city, 
    state, 
    zip
  } = req.query;
  
  res.render('info',{
    title: 'Lead',
    username: req.user.username,
    model: req.user.ml_model.name,
    type: req.user.account.type,
    address: addr,
    givenName,
    phone,
    leadDate,
    city,
    state,
    zip
  });
}

function settingsPage(req, res){ //acct settings
    let renewalDate = 'Exempt';
  
    if(req.user.subscription.renewal) 
      renewalDate = req.user.subscription.renewal;
  
    getAllModelNamesExceptOnesThatIncludeTheStringsInThisArray(['extendedData','(Private)'], modelNames =>
      res.render('settings', {
        title: 'Settings',
        username: req.user.username,
        sub: req.user.account.throttle,
        type: req.user.account.type,
        model: req.user.ml_model.name,
        email: req.user.account.email,
        renewal: renewalDate,
        modelNames
      })
    )
}

function downloadTemplate(req, res){
    let filePath = global.appRoot + '/public/download/juju_template.csv';
    res.download(filePath);
}

function logout(req, res){
    req.logout();
    return res.redirect('/');
}

function registerPage(req, res){ //login
    res.render('register',{
        title: 'Register'
    });
}

function sendFileToUser(req, res){
    const {file} = req.query;
    if(file.split('-')[0] == req.user.username)
        repository.downloadFileToServer(file, savedFilePath => res.status(200).download(savedFilePath, file));
}

function deleteFile(req, res){
  let {file} = req.query;
  if(file.split('-')[0] == req.user.username)
    repository.deleteFileFromServer(file, () => res.send(true));
}

function historyPage(req, res){
    const { username } = req.user;
    let { page } = req.query;
    if (page === undefined) page = 0;
  
    repository.listHistoryWithDates(username + '-', (err, filesDates) => {
        if(err) 
          return res.send(err);
      
        let arr = repository.paginate(filesDates, 6);
        if (page >= arr.length) 
          page = 0;
        res.render('history', {
            arr: arr[page],
            title: 'History',
            page: page,
            pageCount: arr.length
        })
    })
}

function login(req, res){
    passport.authenticate('local', (err, account) => {
      if (err){
        log.error(err); 
        return res.send(false);
      }
      else if(account == false){ 
        return res.send(false);
      }
      else{
        const { username } = req.body;
        let entityBody = {
          username,
          url:'', //this is so we can redirect to whatever page they were tryna access... implement this later
          pulls:'',
          model:''
        }
        if (account.standing == true){
          entityBody.pulls = account.pulls;
          entityBody.model = account.model;
          entityBody.url = '/home';
          req.login(account, err => {
            if(err) 
              log.error('login err', err);
            else 
              res.send(entityBody);
          });
        }
      }
    })(req, res);
}

function updateSettings(req, res){
  const username = req.user.username;
  const {newPassword, oldPassword, email, model} = req.body;
  var changesMade = false; //keep as var... should be blocked scope
  if(newPassword != '') 
    bcrypt.compare(oldPassword, req.user.hash, function(err, success){
      if(err) 
        return res.send(err); //render stat page??
      if(success) 
        changePassword(username, newPassword, (err) => {
          if(!err && !changesMade) 
            res.send({succMsg:'Success! Password updated'});
          else if(!changesMade)
            res.send(err.errMsg);
        });
      else if(!changesMade) 
        res.send({errMsg:'Invalid password.'});
      changesMade = true;
    });

  if(email != req.user.account.email && email != undefined){
    User.update({username}, {email}, function(err){
      if(!changesMade) 
        res.send({succMsg:'Success! Email updated'});
      changesMade = true;
    });
  }

  if(
      model != req.user.ml_model.name
      && req.user.ml_model.name != 'extendedData'
      && req.user.ml_model.name != 'Custom'
    ){
    findModelFromName(model, (mlModel) => {
      const updatedInfo = {
        ...mlModel,
        model
      }
      User.updateOne({ username }, updatedInfo, (err) => {
        if(err) 
          console.log('Couldnt update model,', err);
        else if(!changesMade) 
          res.send({ succMsg:'Success! Model updated' });
        changesMade = true;
      })
    });
  }
}

function privacy(req, res){
  res.sendFile(global.appRoot + '/views/privacyPolicy.html');
}

function terms(req, res){
  res.sendFile(global.appRoot + '/views/terms.html');
}

module.exports = {
  loginPage,
  homePage,
  leadPage,
  settingsPage,
  downloadTemplate,
  logout,
  registerPage,
  sendFileToUser,
  deleteFile,
  historyPage,
  login,
  updateSettings,
  privacy,
  terms
}
