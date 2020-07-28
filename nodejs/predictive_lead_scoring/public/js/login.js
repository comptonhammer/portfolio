$('#iForm').submit(function(e){
    e.preventDefault();
    const formData = $('#iForm').serialize();
    $.post('/login', formData)
        .done((res) => {
            if (res != false) window.location.replace(res.url)
            else {
                document.getElementById("password").style.backgroundColor = "pink";
                document.getElementById("errorDef").innerHTML = "Hmm, we couldn't find that account, or the password is wrong. Give it another try or <a href='https://leadjuju.com/support'>contact us</a>."
            }
        })
        .fail((xhr) => {
            if(xhr.status == 429){
                document.getElementById("password").style.backgroundColor = "pink";
                document.getElementById("errorDef").innerHTML = "You've had too many login attempts. Wait and try again."
            }
        })
});