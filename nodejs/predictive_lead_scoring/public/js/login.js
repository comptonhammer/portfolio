$('#i-form').submit(function(e){
    e.preventDefault();
    
    const formData = $('#i-form').serialize();
    
    $.post('/login', formData)
        .done(res => {
            if(res) 
                window.location.replace(res.url)
            else {
                document.getElementById("password").style.backgroundColor = "pink";
                document.getElementById("error-def").innerHTML = "Hmm, we couldn't find that account, or the password is wrong. Give it another try or <a href='https://REDACTED.com/support'>contact us</a>."
            }
        })
        .fail(xhr => {
            if(xhr.status == 429){
                document.getElementById("password").style.backgroundColor = "pink";
                document.getElementById("error-def").innerHTML = "You've had too many login attempts. Wait and try again."
            }
        })
});
