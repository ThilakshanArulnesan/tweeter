$(document).ready(function() {
  const MAX_CHARS = 140;
  console.log("Document is ready");
  $(".new-tweet textarea").on('input', function() {
    console.log(this);
    console.log($(this).val());
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
});
