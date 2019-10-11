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



    /*The code below is from from https://gomakethings.com/automatically-expand-a-textarea-as-the-user-types-using-vanilla-javascript/ */

    // Reset textbox height
    let textbox = e.target;
    textbox.style.height = '1.5em'; //Default height.

    // Get the computed styles for the element
    const computed = window.getComputedStyle(textbox);

    // Calculate the height
    const height =
      parseInt(computed.getPropertyValue('padding-top'), 10)
      + textbox.scrollHeight
      + parseInt(computed.getPropertyValue('padding-bottom'), 10);

    textbox.style.height = height + 'px';


  });

  $(".new-tweet textarea").on('keyup', e => {
    if (e.which === 13 && !e.shiftKey) {

      $("#tweetPost").trigger("submit");
      //clear the form
    }
  });
});
