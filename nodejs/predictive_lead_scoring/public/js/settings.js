window.onload = function() {
    var model = $('#model').attr('value');
    if(model != 'Custom'){
        $('[name=model]').attr('value', model);
        $('select[name="model"]').find(`option:contains("${model}")`).attr('selected',true);
    }
};

$("#save").click(function(e) {
    e.preventDefault();
    if($("#save").html() == 'Save') 
        $("#save").html('Are You Sure?')
    else if($("#save").html() == 'Are You Sure?') 
        $("#save").html('Seriously?')
    else {
        $("#save").html('Saving...');
        $("#save").css("background-color","red");
        const formData = $('#fullBody').serialize();
        $.post('/settings/update', formData, status => {
            if(status.errMsg) 
                $("#save").html(status.errMsg);
            else if(status.succMsg){
                $("#save").html(status.succMsg);
                $("#save").css("background-color", "lightgreen"); 
            }
        });
    }
});

$("#backBtn").click(function(e) {
    e.preventDefault();
    window.location.replace('/home');
    return false;
});