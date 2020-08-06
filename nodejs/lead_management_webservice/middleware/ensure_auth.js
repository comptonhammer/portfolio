function ensureAuthenticated(req, res, next) {
    if(req.user){
        if(Object.entries(req.params).length > 0){
            const { username } = req.params;
            if(username){ // If trying to access a /:username/ url,
                if(username === req.user.username){  // verify it's their own username.
                    if(req.user.organization_code) 
                        return next();
                    else 
                        return res.redirect(`/user/${username}/org/add`); // User needs an org_code
                }
                else 
                    return res.redirect(`/user/${req.user.username}/dash/cell`); // User not allowed, redirect.
            }
            else if(!username){ 
                if(req.user.organization_code) 
                    return next(); 
                else 
                    return res.redirect(`/user/${req.user.username}/org/add`);
            } // Not trying to access a /:username/ url
            
        }
        else{ 
            if(req.user.organization_code) 
                return next();
            else 
                return res.redirect(`/user/${req.user.username}/org/add`);
        }
    }

    let query = '';
    let path = req.originalUrl;
    Object.entries(req.query).forEach(entry => {
        query += `&${entry[0]}=${entry[1]}`;
    })
    return res.redirect(`/login?redir=${path}${query}`); // Maintain a redirect link for login
}

module.exports = ensureAuthenticated;