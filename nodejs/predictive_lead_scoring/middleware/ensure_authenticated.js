//@ts-check
let log = require('clg-color');

function ensureAuthenticated(req, res, next) {
    log.info('Checking auth...')
    if(req.user){
      log.success('Auth ensured!')
      next();
    }
    else return res.redirect('/');
}

module.exports = ensureAuthenticated;
