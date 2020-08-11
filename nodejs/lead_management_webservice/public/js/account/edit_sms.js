if(document.readyState == 'loading') document.addEventListener('DOMContentLoaded', listen);
else listen();

function listen(){
    let saveChanges = document.getElementById('save-changes');
    saveChanges.addEventListener('click', save);

    let bodyText = document.getElementById('body-input');
    bodyText.addEventListener('input', (e) => {
        let bodyHidden = document.getElementById('body');
        bodyHidden.value = bodyText.value;
    });

    let countField = document.getElementById('counter');
    let maxLimit = bodyText.getAttribute('maxlength');
    countField.innerHTML = maxLimit - bodyText.value.length;

    bodyText.addEventListener('keyup', (e) => {
        
        if (bodyText.value.length > maxLimit)
            return;
        else
            countField.innerHTML = maxLimit - bodyText.value.length;
    })
}

function save(e){
    e.preventDefault();
    const url = '/user/' + username + '/account/phone-template/save';
    let body = document.getElementById('body').value;
    const opts = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            body
        })
    }
    fetch(url, opts)
        .then(res  => {
            if(res.status === 200)
                document.getElementById('save-changes').innerHTML = 'Changes Saved!';
            else
                document.getElementById('save-cahgnes').innerHTML = 'ERROR! Try again.'
            setTimeout(saveChangesButtonBackToNormal, 5000);
        })
        .catch((err) => {
            console.log(err);
        })
}

function saveChangesButtonBackToNormal(){
    document.getElementById('save-changes').innerHTML = 'Save Changes';
}
