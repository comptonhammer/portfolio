const repo = require('./repository');

function registerPage(req, res){
    return res.render('register', {});
}

function verificationCodePage(req, res){
    const secret = req.query.session;
    const message = req.query.message || '';
    if(!secret) 
        return res.status(400).end();
    return res.render('register_verify', {secret, message});
}

function verify(req, res){
    const {code, secret} = req.body;
    repo.verifyAccount(code, secret, (err) => {
        if(err) 
            return res.redirect(`/register/verify?session=${secret}&message=${err.msg}`);
        return res.redirect('/login');
    })
}

function register(req, res){
    const {
        name, 
        email, 
        address,
        home_phone,
        cell_phone, 
        desired_username, 
        organization,
        password, 
        password_confirm
    } = req.body;

    let user = {
        name, 
        email, 
        address,
        home_phone,
        cell_phone, 
        desired_username, 
        organization,
        password, 
        password_confirm
    }

    repo.registerAccount(user, (err, session) => {
        if(err) return res.redirect(`/register?message=${err.msg}`);
        else return res.redirect(`/register/verify?session=${session}`);
    })
}

function forgotPasswordPage(req, res){
    res.render('forgot_password', {});
}

function changePasswordPage(req, res){
    let {key} = req.params;
    repo.verifyResetCode(key, (err, isMatch) => {
        if(err) 
            return res.redirect('/404');
        else if(isMatch) 
            return res.render('forgot_password_change', {key});
        return res.redirect('/404');
    })
    
}

function forgotPassword(req, res){
    repo.sendResetCode(req.body.username, (err) => {
        if(err) return res.render('forgot_password', {
            message:{
                error:true, 
                message:"There was an error. Please try again."
            }
        });
        else res.render('forgot_password', {
            message:{
                success:true, 
                message:"Ok! Check your email for further instructions."
            }
        });
    })
}

function changePassword(req, res){
    let {key} = req.params;
    let {password, password_confirm} = req.body;

    if(password != password_confirm) 
        return res.redirect('/reset/' + key + '?msg=Password mismatch');
    else repo.verifyResetCode(key, (err, isMatch) => {
        if(err) 
            return res.render('forgot_password', {
                message:{
                    error: true, 
                    message: err.msg || err 
                }
            });
        if(!isMatch) 
            return res.redirect('back');
        repo.resetPassword(key, password, (err) => {
            if(err) 
                return res.redirect('/reset/' + key);
            return res.render('login', {
                message:{
                    success:true, 
                    message:'/?msg=Success! Password reset.'
                }
            });
        })
    }) 
}

module.exports = {
    registerPage,
    register,
    verificationCodePage,
    verify,
    forgotPasswordPage,
    changePasswordPage,
    forgotPassword,
    changePassword
}
