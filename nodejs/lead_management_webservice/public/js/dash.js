if(document.readyState == 'loading') document.addEventListener('DOMContentLoaded', listen);
else listen();

function listen(){
    listenSalesforce();
    listenPipedrive();
    listenCommunicationLogs();
    listenLeadCheckboxesChange();

    let saveLeads = document.getElementsByClassName('save-lead');
    for(let i = 0; i < saveLeads.length; i++) 
        saveLeads[i].addEventListener('click', (e) => {
            e.preventDefault();
            let url = `/user/${username}/leads/save-changes/${saveLeads[i].value}`;
            saveLeadStats(saveLeads[i].value, url);
        })
        
    let saveEdit = document.getElementsByClassName('save-edit-contact');
    for(let i = 0; i < saveEdit.length; i++){
        saveEdit[i].addEventListener('click', (e) => {
            e.preventDefault();
            let url = `/user/${username}/leads/save-contact-changes/${saveEdit[i].value}`;
            saveEditContact(saveEdit[i].value, url);
        })
    }

    let tx = document.getElementsByTagName('textarea');
    for (let i = 0; i < tx.length; i++) {
        tx[i].setAttribute('style', 'width:100%;height:' + (tx[i].scrollHeight) + 'px;overflow-y:hidden;');
        tx[i].addEventListener("input", onInput, false);
    }
}

function onInput(){
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
}

function listenLeadCheckboxesChange(){

    let firstCall = document.getElementsByClassName('first-call-chk');
    for(let i = 0; i < firstCall.length; i++) 
    firstCall[i].addEventListener('change', () => {
            let id = JSON.parse(firstCall[i].value).id;
            if(firstCall[i].checked)
                document.getElementById(`first-call-${id}`).value = "true";
            else
                document.getElementById(`first-call-${id}`).value = "false";
        })

    let consultScheduled = document.getElementsByClassName('consult-scheduled-chk');
    for(let i = 0; i < consultScheduled.length; i++) 
    consultScheduled[i].addEventListener('change', () => {
            let id = JSON.parse(consultScheduled[i].value).id;
            if(consultScheduled[i].checked){
                document.getElementById(`consult-scheduled-tag-${id}`).style.display = "inline";
                document.getElementById(`consult-scheduled-${id}`).value = "true";
            }
            else{
                document.getElementById(`consult-scheduled-${id}`).value = "false";
                document.getElementById(`consult-scheduled-tag-${id}`).style.display = "none";
            }
        })

    let presentation = document.getElementsByClassName('presentation-chk');
    for(let i = 0; i < presentation.length; i++) 
    presentation[i].addEventListener('change', () => {
            let id = JSON.parse(presentation[i].value).id;
            if(presentation[i].checked)
                document.getElementById(`presentation-${id}`).value = "true";
            else
                document.getElementById(`presentation-${id}`).value = "false";
        })


    let dDay = document.getElementsByClassName('d-day-chk');
    for(let i = 0; i < dDay.length; i++) 
    dDay[i].addEventListener('change', () => {
            let id = JSON.parse(dDay[i].value).id;
            if(dDay[i].checked)
                document.getElementById(`d-day-${id}`).value = "true";
            else
                document.getElementById(`d-day-${id}`).value = "false";
        })

    let purchase = document.getElementsByClassName('purchase-chk');
    for(let i = 0; i < purchase.length; i++) 
    purchase[i].addEventListener('change', () => {
            let id = JSON.parse(purchase[i].value).id;
            if(purchase[i].checked)
                document.getElementById(`purchase-${id}`).value = "true";
            else
                document.getElementById(`purchase-${id}`).value = "false";
        })

    let deads = document.getElementsByClassName('dead-chk');
    for(let i = 0; i < deads.length; i++) 
        deads[i].addEventListener('change', () => {
            let id = JSON.parse(deads[i].value).id;
            if(deads[i].checked){
                document.getElementById(`dead-${id}`).value = "true";
                document.getElementById(`dead-tag-${id}`).style.display = "inline";
            }
            else{
                document.getElementById(`dead-${id}`).value = "false";
                document.getElementById(`dead-tag-${id}`).style.display = "none";
            }
        })
}

function listenCommunicationLogs(){
    let newLogs = document.getElementsByClassName('add-log');
    for(let i = 0; i < newLogs.length; i++) 
        newLogs[i].addEventListener('click', (e)=>{
            e.preventDefault();
            let url = `/user/${username}/leads/${newLogs[i].value}/log/add`;
            addCommLog(newLogs[i].value, url);
        })
    
    let deleteLogs = document.getElementsByClassName('delete-log');
    for(let i = 0; i < deleteLogs.length; i++) 
        deleteLogs[i].addEventListener('click', (e)=>{
                e.preventDefault();
                let x = confirm('Are you sure you want to delete this entry?');
                if(x){
                    const vals = JSON.parse(deleteLogs[i].value)
                    let url = `/user/${username}/leads/${vals.id}/log/remove`;
                    const row = deleteLogs[i].parentNode.parentNode.rowIndex;
                    console.log(row);
                    removeCommLog(row, vals.id, vals.date, url);
                }
            })

    let expandAddLogs = document.getElementsByClassName('expand-add-log');
    for(let i = 0; i < expandAddLogs.length; i++) 
        expandAddLogs[i].addEventListener('click', (e) => e.preventDefault());
}

function listenSalesforce(){
    let salesforceEx = document.getElementsByClassName('salesforce-export');
    for(let i = 0; i < salesforceEx.length; i++) salesforceEx[i].addEventListener('click', (e) => {
            e.preventDefault(); 
            exportLeadSalesforce(salesforceEx[i].value)
        })
}

function listenPipedrive(){
    let pipedriveEx = document.getElementsByClassName('pipedrive-export');
    for(let i = 0; i < pipedriveEx.length; i++) pipedriveEx[i].addEventListener('click', (e) => {
            e.preventDefault(); 
            exportLeadPipedrive(pipedriveEx[i].value)
        })
}

function saveEditContact(id, url){
    const formData = $('#edit-contact-' + id +'-form').serialize();
    const opts = {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    }
    fetch(url, opts)
        .then( res => res.json().then(res => {
            if(res.success){
                location.reload();
            }
        }))
        .catch((err) => {
            console.log(err);
            $('#' + id + '-msg').html(errorMsg(err));  
        })
}

function saveLeadStats(id, url){
    $(`#comments-${id}`).val($(`#comments-in-${id}`).val());
    const formData = $('#' + id).serialize();
    const opts = {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    }
    fetch(url, opts)
        .then(res => res.json().then(res => {
            if(res.success){
                $('#' + id + '-msg').html(successMsg());
                $('#' + id + '-msg').fadeOut(5000);
            }
        }))
        .catch((err) => {
            $('#' + id + '-msg').html(errorMsg(err));  
        })
}

function addCommLog(id, url){
    const formData = $('#add-comm-' + id + '-form').serialize();
    const opts = {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formData
    }
    fetch(url, opts)
        .then((res) => {
            document.getElementById(id + '-msg').innerHTML = successMsg(' Logs updated.');
            let row = document.getElementById('communications-' + id).insertRow(1);
            let dateVal = document.getElementById('log-date-' + id).value;
            let date = new Date(dateVal);
            let timeVal = document.getElementById('log-time-' + id).value;
            row.insertCell(0).innerHTML = date.toDateString() + ' ' + timeVal;
            let commentVal = document.getElementById('log-comment-' + id).value;
            row.insertCell(1).innerHTML = commentVal;
            document.getElementById('log-comment-' + id).value = '';
            let deleteButton = row.insertCell(2);
            deleteButton.innerHTML = `
                <button value='{"date": "${dateVal}", "id": "${id}"}' type="button" class="delete-log close" aria-label="Delete">
                    <span aria-hidden="true"> &times; </span>
                </button>`;
            listenCommunicationLogs();
            document.getElementById('log-date-' + id).value = '';
            document.getElementById('log-time-' + id).value = '';
        })
        .catch((err) => {
            console.log(err);
        })
}

function removeCommLog(row, id, date, url){
    const body = { id, date }
    const opts = {
        method:'post', 
        headers: {
            'Content-Type':'application/json'
        }, 
        body: JSON.stringify(body)
    }
    fetch(url, opts)
        .then((res) => {
            $('#' + id + '-msg').html(successMsg(' Log deleted.'));
            document.getElementById('communications-' + id).deleteRow(row);
        })
        .catch(handleFailure);
}

function exportLeadSalesforce(id){
    const url = `/user/${username}/salesforce/export`;
    const opts = {
        method:'post', 
        headers: {
            'Content-Type':'application/json'
        }, 
        body: JSON.stringify({id})
    }
    fetch(url, opts)
        .then((res) => res.json().then(res => {
            console.log(res);
            $('#' + id + '-msg').html(successMsg(' Export complete.'));
        }))
        .catch((err) => {
            $('#' + id + '-msg').html(errorMsg());  
        })
}

function exportLeadPipedrive(id){
    const url = `/user/${username}/pipedrive/export`;
    const opts = {
        method:'post', 
        headers: {
            'Content-Type':'application/json'
        }, 
        body: JSON.stringify({id})
    }
    $.post(url, opts)
        .then((res) => res.json().then(res => {
            console.log(res);
            $('#' + id + '-msg').html(successMsg('Export complete.'));
        }))
        .catch((err) => {
            $('#' + id + '-msg').html(errorMsg());  
        })
}

function handleFailure(err){
    console.log(err);
}

function successMsg(adtnl){
    return '<text style="color:green;">Success!' + (adtnl || '') + '</text>';
}

function errorMsg(adtnl){
    return '<text style="color:red;">There was an error. Please try again.' + (adtnl || '') + '</text>';
}
