if(document.readyState == 'loading') document.addEventListener('DOMContentLoaded', listenAuths);
else listenAuths();

function listenAuths(){
    if(document.getElementById('pipedrive-refresh'))
        document.getElementById('pipedrive-refresh').addEventListener('click', pipedriveRefresh);
    if(document.getElementById('salesforce-refresh'))
        document.getElementById('salesforce-refresh').addEventListener('click', salesforceRefresh);
}

function salesforceRefresh(){
    fetch(`/user/${username}/salesforce/refresh-permissions`, { method:'post' })
        .then(res => res.json().then(successRefresh))
        .catch((err) => console.log(err))
}

function pipedriveRefresh(){
    fetch(`/user/${username}/pipedrive/refresh-permissions`, { method:'post' })
        .then(res => res.json().then(successRefresh))
        .catch((err) => console.log(err))
}

function successRefresh(res){
    console.log(res);
    location.reload();
}