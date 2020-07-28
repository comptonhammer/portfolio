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

    $("#includeScoresChk").click(function (e) {
      if($('#includeScores').attr('value') == "true") 
        $('#includeScores').attr('value', "false");
      else if($('#includeScores').attr('value') == "false") 
        $('#includeScores').attr('value', "true");
      console.log($('#includeScores').attr('value'));
    });

    $("#demo-only-chk").click(function (e) {
      if($('#demoOnly').attr('value') == "true") 
        $('#demoOnly').attr('value', "false");
      else if($('#demoOnly').attr('value') == "false") 
        $('#demoOnly').attr('value', "true");
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
