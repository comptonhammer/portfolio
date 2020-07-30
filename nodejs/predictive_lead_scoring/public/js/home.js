$(function () {
    $('.custom-file-input').on('change', function() {
        let fileName = $(this).val().split('\\').pop();
        $(this).siblings('.custom-file-label').addClass("selected").html(fileName);
    });

    $("#logout").click(function (e) {
        e.preventDefault();
        $.post('/logout', () => {
          window.location.replace('/login');
        })
    });

    $("#include-scores-chk").click(function (e) {
      if($('#include-scores').attr('value') == "true") 
        $('#include-scores').attr('value', "false");
      else if($('#include-scores').attr('value') == "false") 
        $('#include-scores').attr('value', "true");
      console.log($('#include-scores').attr('value'));
    });

    $("#demo-only-chk").click(function (e) {
      if($('#demo-only').attr('value') == "true") 
        $('#demo-only').attr('value', "false");
      else if($('#demo-only').attr('value') == "false") 
        $('#demo-only').attr('value', "true");
    });

    $("#settings").click(function (e) {
      e.preventDefault();
      window.location.href = '/settings';
    });

    $("#history").click(function (e) {
      e.preventDefault();
      window.location.href = '/history';
    });
    
    $("#help").click(function (e) {
      e.preventDefault();
      window.location.href = "/help";
    });
  });

  $(document).ready(function() {
      
  });
