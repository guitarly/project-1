console.log("Catte Card game is running");

// JQuery
$(function() {
  init();

  var $btnStart = $('#btn-start');
  var $btnEnd = $('#btn-end');
  var $btnRestart = $('#btn-restart');
  var $btnFold = $('#btn-fold');
  var $btnPlay = $('#btn-play');
  var $btnFoldCard = $('#foldCard');

  // set up buttons functions
  var $allButtons = {
    startGame: function() {
      console.log("i want to start a game...")
    },
    endGame: function() {
      console.log("End of Game");
    },
    restart: function() {
      console.log("restart game");
    },
    fold: function() {
      console.log("Fold - face down");
    },
    play: function() {
      console.log("Play baby");
    }

  };

  $btnStart.on('click', $allButtons.startGame);
  $btnEnd.on('click', $allButtons.endGame);
  $btnRestart.on('click', $allButtons.restart);
  $btnFold.on('click', $allButtons.fold);
  $btnPlay.on('click', $allButtons.play);
  $btnFoldCard.on('click', $allButtons.fold);


}); // end JQuery

var suits ;
var cardRanks;
var desk ;

var Player = function(name) {
  this.name = name;
  this.money= 0;
}


// Set initial from the beginning.
var init = function() {
  suits = cards.suits;
  cardRanks = cards.cardsRanks;
  deckOfCard = cards.deckOfCard;
  allFunctions.setUpDesk();
}

var cards = {
  suits: ['spades', 'clubs', 'diamons', 'hearts'],
  cardsRanks: ['2', '3','4', '5','6','7', '8', '9', '10', 'J', 'Q','K', 'A'],
  deckOfCard: []
};

// ----------------------
// Functions ....
// ----------------------
var allFunctions = {
  // insert all suits and ranks into the deck of card
  setUpDesk : function() {
    console.log("desk " + deckOfCard.length);
    for (var i = 0; i < suits.length; i++) {
      for (var j = 0; j < cardRanks.length; j++) {
        // card = cardRanks[j] + suits[i];
        var point = j + 1;
        cardPix = cardRanks[j]+"_of_" + suits[i]+".png";
        deckOfCard.push({"rank": cardRanks[j],  "suite" : suits[i], "image" : cardPix, "points": point });
      }
    }
    for (var i = 0; i < cards.deckOfCard.length; i++) {
      console.log(cards.deckOfCard[i]);
    }
    // keep this... for display image
    // var $imageOfCard = $('<img>');
    // $imageOfCard.attr({
    //   src: 'vendor/images/PNG-cards-1.3/'+deckOfCard[3].image,
    //   title: "card",
    //   alt: "pic"
    // })
    //
    // $('body').append($imageOfCard);

  } // end of setUpDesk function


} // end of allFunctions
// ---------- end of functions --------
