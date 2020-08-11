if(document.readyState == 'loading') document.addEventListener('DOMContentLoaded', listen);
else listen();

function listen(){
    let ratingSelect = document.getElementById('rating-select');
    ratingSelect.addEventListener("change", () => {
        let rating = document.getElementById('rating');
        rating.value = ratingSelect.options[ratingSelect.selectedIndex].value;
    })

    document.getElementById('add-lead-form').addEventListener('submit', (e) => {
        e.preventDefault();
        $.post('/user/' + username + '/leads/add')
            .done((res) => {
                console.log(res);
            })
            .fail((xhr) => { 
            })
    })

    listenAddLeadToAccount();
}

function listenAddLeadToAccount(){
    document.getElementById('add-lead-to-account').addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('submit');
        let id = $('#id').val();
        let username = $('#username').val();
        const formData = $('#add-lead-to-account').serialize();
        $.post('/user/'+username+'/leads/add/'+id, formData)
            .done((res) => {
                console.log(res);
            })
            .fail((xhr) => { 
            })
    })
}