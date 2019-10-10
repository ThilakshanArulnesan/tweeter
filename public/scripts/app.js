/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 * {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png",
        "handle": "@SirIsaac"
      },
    "content": {
        "text": "If I have seen further it is by standing on the shoulders of giants"
      },
    "created_at": 1461116232227
 }
 initial-tweets.json
 */

// Test / driver code (temporary). Eventually will get this from the server.
$(document).ready(() => {
  /*const data = [
    {
      "user": {
        "name": "Newton",
        "avatars": "https://i.imgur.com/73hZDYK.png"
        ,
        "handle": "@SirIsaac"
      },
      "content": {
        "text": "If I have seen further it is by standing on the shoulders of giants"
      },
      "created_at": 1461116232227
    },
    {
      "user": {
        "name": "Descartes",
        "avatars": "https://i.imgur.com/nlhLi3I.png",
        "handle": "@rd"
      },
      "content": {
        "text": "Je pense , donc je suis"
      },
      "created_at": 1461113959088
    }
  ];*/
  const getDays = function(time) {
    //Converts the timestamp to number of days ago.
    return time;
  }
  const createTweetElement = function(t) {
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
       ${getDays(t.created_at)} days ago.
     </div>

     <div class="icons flex-container">
       <div name="report"> 🚩</div>
       <div name="retweet">🔄</div>
       <div name="like">♥️</div>
     </div>

   </footer>
 </article>`);

  }
  const escape = function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }


  const renderTweets = function(tweets) {
    let html = [];

    for (let tweet of tweets) {
      html.push(createTweetElement(tweet));
    }
    let container = $(".tweet-container");
    container.empty();
    container.append(html.reverse().join('')); //Append is slow, so good to make the append after building the string.
  };


  //Handles button
  const loadTweets = async () => {
    //Fetches tweets from http://localhost:8080/tweets
    try {
      let val = await $.ajax("http://localhost:8080/tweets", {
        method: 'GET'
      });

      return val;
    } catch (e) {
      console.error(e);
    }
  }

  $(document).on("scroll", (e) => {
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
    window.scrollTo(0, 0);
    const tweetBox = $(".new-tweet");

    $(tweetBox).slideDown(
      () => {
        //Focus only if we are showing it
        $(tweetBox).find("textarea:visible").focus();
      }
    );
  });


  $("#downArrow").on("click", () => {
    const tweetBox = $(".new-tweet");
    tweetBox.slideToggle(
      () => {
        //Focus only if we are showing it
        $(tweetBox).find("textarea:visible").focus();
      }
    );

  });

  loadTweets().then((v) => renderTweets(v));

  $("#tweetPost").on("submit", (e) => {
    e.preventDefault();
    const obj = e.currentTarget;


    const textArea = $(obj).find("textarea");
    const userText = textArea.val().trim();


    $(obj).find("textArea").removeClass("invalid");
    $(obj).find("#tweetError").text('').fadeTo(0, 0);

    if (!userText) {
      $(obj).find("textArea").addClass("invalid");
      $(obj).find("#tweetError").text("You must enter valid text!").fadeTo(0, 100);

      // alert('You must enter valid text!');
      return;
    }

    if (userText.length > 140) {
      $(obj).find("textArea").addClass("invalid");
      $(obj).find("#tweetError").text('Your text is too long!!').fadeTo(0, 100);

      let aud = $(obj).find("#audio");
      aud[0].play();
      return;
    }




    $.post("http://localhost:8080/tweets",
      $(obj).serialize()
    );


    $(obj).find(".counter").text("140");

    textArea.val('');

    //Now fetch the new posts:
    loadTweets().then((v) => renderTweets(v));
  });
});
