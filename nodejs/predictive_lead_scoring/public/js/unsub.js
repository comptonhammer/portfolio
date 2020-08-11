$('#i-form').submit(function(e){
    e.preventDefault();
    let cancel = confirm("This will cancel your subscription after this billing month (ie. after the month you already paid for). Continue?");
    if(cancel){
      unsub();
    }
});

function unsub(){
    const formData = $('#i-form').serialize();
    $.post('/unsubscribe', formData, data => {
        if (data && data.active) 
            window.location.replace(data.url);
        else if(!data.active){
            document.getElementById("errorDef").innerHTML = "Hmm, looks like that subscription is already inactive/cancelled. <a href='https://leadjuju.com/support'>Contact us</a> if you're having any problems."
        }
        else if(data.err){
            document.getElementById("errorDef").innerHTML = data.errMsg;
        }
        else {
            document.getElementById("password").style.backgroundColor = "pink";
            document.getElementById("errorDef").innerHTML = "Hmm, we couldn't find that account, or the password is wrong. Give it another try or <a href='https://leadjuju.com/support'>contact us</a>."
        }
    });
}
