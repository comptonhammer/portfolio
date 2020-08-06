function ensureAdmin(req, res, next) {
    if(req.user && req.user.username === process.env.ADMIN_NAME) next();
    else res.redirect('/');
}

module.exports = ensureAdmin;