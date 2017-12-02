$('.btnShorten').on('click', () => {
  $.ajax({
    url: '/make/shorter',
    type: 'POST',
    dataType: 'JSON',
    data: {url: $('#urlField').val()},
    success: (data) => {
      if(data.shortURL == 'URL_FAILURE!') {
        // 유효하지 않은 URL이 입력된 경우
        var result = '<a class="result" href="' + 'Invalid URL !' + '">'
            + 'Invalid URL !' + '</a>';
        $('#link').html(result);
        $('#link').hide().fadeIn('slow');
      }
      else {
        // 유효한 URL이 입력된 경우
        var result = '<a class="result" href="' + data.shortURL + '">'
            + data.shortURL + '</a>';
        $('#link').html(result);
        $('#link').hide().fadeIn('slow');
      }
    }
  });
});
