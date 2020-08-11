if(document.readyState == 'loading') document.addEventListener('DOMContentLoaded', listen);
else listen(); 

function listen(){
    let emailCheckbox = document.getElementById('autosend-email');
    emailCheckbox.addEventListener('change', (e) => {
        if(emailCheckbox.checked){
            document.getElementById('email').value = "true";
        }
        else document.getElementById('email').value = "false";
        console.log(document.getElementById('email').value);
    })

    let smsCheckbox = document.getElementById('autosend-sms');
    smsCheckbox.addEventListener('change', (e) => {
        if(smsCheckbox.checked){
            document.getElementById('sms').value = "true";
        }
        else document.getElementById('sms').value = "false";
        console.log(document.getElementById('sms').value);
    })

    let notificationsCheckbox = document.getElementById('autosend-notifications');
    notificationsCheckbox.addEventListener('change', (e) => {
        if(notificationsCheckbox.checked)
            document.getElementById('notifications').value = "true";
        else document.getElementById('notifications').value = "false";
        console.log(document.getElementById('notifications').value);
    })
}