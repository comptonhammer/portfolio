const repo = require('./repository');

function registerPage(req, res){
    const message = req.query.message;

    let attr = {};
    if(message) 
        attr = {
            message:{
                message: message,
                error: true
            }
        }

    res.render('register', attr);
}

function verificationCodePage(req, res){
    const secret = req.query.session;
    const message = req.query.message;

    let attr = {};
    if(message) 
        attr = {
            message:{
                message: message,
                error: true
            }
        }

    attr.secret = secret;
    res.render('register_verify', attr);
}

function verify(req, res){
    const {code, secret} = req.body;
    
    repo.verifyAccount(code, secret, (err) => {
        if(err) 
            res.redirect(`/register/verify?session=${secret}&message=${err.msg}`);
        else 
            res.redirect('/login');
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
        password_confirm,
        organization_code
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
        password_confirm,
        organization_code
    }

    repo.registerAccount(user, (err, session) => {
        if(err){
            console.log(err);
            return res.redirect(`/register?message=${err.msg}`);
        }
        else 
            return res.redirect(`/register/verify?session=${session}`);
    })
}

function forgotPasswordPage(req, res){
    res.render('forgot_password', {});
}

function changePasswordPage(req, res){
    let {key} = req.params;
    repo.verifyResetCode(key, (err, isMatch) => {
        if(err) 
            res.redirect('/404');
        else if(isMatch) 
            res.render('forgot_password_change', {key});
        else 
            res.redirect('/404');
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
    let { key } = req.params;
    let { password, password_confirm } = req.body;

    if(password != password_confirm) return res.redirect('/reset/' + key + '?msg=Password mismatch');
    else repo.verifyResetCode(key, (err, isMatch) => {
        if(err) return res.render('forgot_password', {
            message:{
                error: true, 
                message: err.msg || err 
            }
        });
        if(!isMatch) return res.redirect('back');
        repo.resetPassword(key, password, (err) => {
            if(err) res.redirect('/reset/' + key);
            else res.render('login', {
                message:{
                    success:true, 
                    message:'Success! Password reset.'
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