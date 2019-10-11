
$(document).ready(() => {

  const getDate = function(time) {
    //Calculates how long ago a tweet was in an appropriate unit.
    let ms = (new Date() - new Date(time));
    let s = ms / 1000;
    let min = s / 60;
    let h = min / 60;
    let days = h / 24;
    let months = days / 30;// Not exact, but a good enough approximation for our purposes (users will only need a general idea of when the tweet was made)
    let years = months / 12;

    if (ms < 1000) {
      return "1 second";
    } else if (s < 60) {
      return Math.floor(s) + " seconds";
    } else if (min < 60) {
      return Math.floor(min) + " minutes";
    } else if (h < 24) {
      return Math.floor(h) + " hours";
    } else if (days < 30) {
      return Math.floor(days) + " days";
    } else if (months < 12) {
      return Math.floor(months) + " months";
    } else {
      return Math.floor(years) + " years";
    }
  };

  const createTweetElement = function(t) {
    //Given a tweet as an object, returns the HTML used to render the tweet.
    return (`
 <article>
   <header class="flex-container">
     <img class="small-profile-image" src="${t.user.avatars}">
     <h1>
       ${escape(t.user.name)}
     </h1>
     <div class="handle">
       ${escape(t.user.handle)}
     </div>
   </header>
   <div class="tweet-body">
     ${escape(t.content.text)}
   </div>
   <footer class="flex-container">
     <div class="date">
      Posted about ${getDate(t.created_at)} ago
     </div>

     <div class="icons flex-container">
       <div name="report"><img src="/images/flag.png"></div>
       <div name="retweet"><img src="/images/retweet.png"></div>
       <div name="like"><img src="/images/like.png"></div>
     </div>

   </footer>
 </article>`);
  };

  const escape = function(str) {
    //Used to prevent bad actors from injecting code to the site
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  const renderTweets = function(tweets, isInitialLoad = true) {
    let html = [];

    for (let tweet of tweets) {
      html.push(createTweetElement(tweet));
    }
    if (!isInitialLoad) {
      html[html.length - 1] = html[html.length - 1].replace(`<article>`, `<article class="invis">`);
    }

    let container = $(".tweet-container");
    container.empty();
    container.append(html.reverse().join('')); //Append is slow, so good to make the append after building the string.

    //Do an animation:
    if (!isInitialLoad) {
      let lastTweet = $("article.invis");
      lastTweet.addClass("bounce");
      lastTweet.slideDown(250, () => {
        lastTweet.removeClass("invis");
      });

    }
  };


  async function loadTweets() {
    try {
      let val = await $.ajax("/tweets", {
        method: 'GET'
      });

      return val;
    } catch (e) {
      console.error(e);
    }
  }

  $(document).on("scroll", (e) => {
    //Shows/hide the buttons that compose a new tweet and jump the user back to the top of the page
    let that = e.currentTarget;
    let scrollHeight = $(that).scrollTop();
    if (scrollHeight > 500) {
      $("#nav-buttons").fadeTo(0, 0);
      $("#back-to-top").fadeTo(0, 100);
    } else {
      $("#nav-buttons").fadeTo(0, 100);
      $("#back-to-top").fadeTo(0, 0);
    }
  });

  $("#back-to-top").on("click", e => {
    //Jumps the user back to the top of the screen and allows the user to compose a new tweet
    window.scrollTo(0, 0);
    const tweetBox = $(".new-tweet");
    $(tweetBox).slideDown( //Only shows as this button will only be presesed if the user want to compose a tweet, never to hide the composition box.
      () => {
        //Focus only if we are showing it
        $(tweetBox).find("textarea:visible").focus();
      }
    );
  });


  $("#downArrow").on("click", () => {
    const tweetBox = $(".new-tweet");
    tweetBox.slideToggle( //Want the button to show/hide the compose icon
      () => {
        //Focus only if we are showing it
        $(tweetBox).find("textarea:visible").focus();
      }
    );

  });

  loadTweets().then((v) => renderTweets(v));

  $("#tweetPost").on("submit", (e) => {
    //Posts tweet to the DB
    e.preventDefault();
    const obj = e.currentTarget;

    const textArea = $(obj).find("textarea");
    const userText = textArea.val().trim();

    //Resets invalid styling in case its there:
    $(obj).find("textArea").removeClass("invalid");
    $(obj).find("#tweetError").text('').fadeTo(0, 0);

    if (!userText) {
      //Invalid text (empty)
      $(obj).find("textArea").addClass("invalid");
      $(obj).find("#tweetError").text("You must enter valid text!").fadeTo(0, 100);
      return;
    }

    if (userText.length > 140) {
      //Over the limit
      $(obj).find("textArea").addClass("invalid");
      $(obj).find("#tweetError").text('Your text is too long!!').fadeTo(0, 100);
      /* Uncomment this code if you want to hear the sound effect. I removed it as it could get fairly loud!
            let aud = $(obj).find("#audio");
            aud[0].play();
            */
      return;
    }

    $(obj).blur(); //Unfocuses the input

    $(textArea).height("1.5em"); //Resets the height to default

    $.post("http://localhost:8080/tweets",
      $(obj).serialize(), () => {
        //Wait for the DB to be updated before updating the screen
        $(obj).find(".counter").text("140");
        textArea.val('');
        //Now fetch the new posts:
        loadTweets().then((v) => renderTweets(v, false));
      }
    );
  });
});
