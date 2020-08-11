if(document.readyState == 'loading') document.addEventListener('DOMContentLoaded', listen);
else listen();

function listen(){
    let timezoneSelect = document.getElementById('timezone-select');
    timezoneSelect.addEventListener('change', () => {
        let timezone = document.getElementById('timezone');
        timezone.value = timezoneSelect[timezoneSelect.selectedIndex].value;
    })
}

function saveChangesButtonBackToNormal(){
    document.getElementById('save-changes').innerHTML = 'Save Changes';
}
