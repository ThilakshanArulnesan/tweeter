$(document).ready(function() {
  const MAX_CHARS = 140;

  $(".new-tweet textarea").on('input', function(e) {

    let len = $(this).val().length;
    let charsLeft = MAX_CHARS - len;
    let theCounter = $(this).nextAll(".counter");
    theCounter.text(charsLeft);
    if (charsLeft < 0) {
      theCounter.toggleClass("overlimit", true);
    } else {
      theCounter.toggleClass("overlimit", false);
    }
  });

  $(".new-tweet textarea").on('keyup', e => {
    if (e.which == 13 && !e.shiftKey) {

      $("#tweetPost").trigger("submit");
      //clear the form
    }
  });
});
