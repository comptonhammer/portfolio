module.exports = (req, res, next) => { 
    // Just checks user, not org code or access path as ensure_auth does
    if(req.params.username){
        if(req.params.username == req.user.username)
            return next();
        else res.redirect('/login');
    }
    else if(req.user) 
        return next();
    else 
        res.redirect('/login');
}