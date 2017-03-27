console.log("Catte Card game is running");

// JQuery
$(function() {


  var $btnStart = $('#btn-start');
  var $btnEnd = $('#btn-end');
  var $btnRestart = $('#btn-restart');
  var $btnFold = $('#btn-fold');
  var $btnPlay = $('#btn-play');
  var $btnFoldCard = $('#foldCard');


  // set up buttons functions
  var allButtons = {
    startGame: function() {
      games.cleanPlayersCards(); // Clean the bucket first
      games.getCardsForPlayers(); // Get new cards for players
      games.displayCards('comp'); // display cards on the screen
      games.displayCards('human'); // display cards on the screen
      games.setClickCards();
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
    },

    pickCard: function() {
      console.log($(this).val());
    },

    setBtnCards : function() {
      var tempVar ;
      for (var i = 0; i < 6; i++) {
        var $tempCard = "$btnClickCard"+i;
        $tempCard = $('#human-card-'+i);
        $tempCard.on('click', allButtons.pickCard);

      }

      console.log("here....");
    }

  };

  $btnStart.on('click', allButtons.startGame);
  $btnEnd.on('click', allButtons.endGame);
  $btnRestart.on('click', allButtons.restart);
  $btnFold.on('click', allButtons.fold);
  $btnPlay.on('click', allButtons.play);
  $btnFoldCard.on('click', allButtons.fold);

  //-------------

  var suits ;
  var cardRanks;
  var desk ;

  // Set initial from the beginning.
  var init = function() {
    suits = cards.suits;
    cardRanks = cards.cardsRanks;
    deckOfCard = cards.deckOfCard;
    //allFunctions.setUpDesk();
    games.setUpDeck();
    games.createPlayer("Computer");
    games.createPlayer("Human");
  }

  var cards = {
    suits: ['spades', 'clubs', 'diamonds', 'hearts'],
    cardsRanks: ['2', '3','4', '5','6','7', '8', '9', '10', 'jack', 'queen','king', 'ace'],
    deckOfCard: []
  };

  // -------------------
  // objects Classes ---
  // -------------------

  var Player = function(name, money) {
    this.name = name;
    this.money= money;
    this.win = 0;
    this.card =[];
  }

  var games = {

    players: [],
    // Create a new peon
    createPlayer: function(name) {
      var newPlayer = new Player(name, 200);
      this.players.push(newPlayer);
    },
    setUpDeck : function() {
      console.log("desk " + deckOfCard.length);
      for (var i = 0; i < suits.length; i++) {
        for (var j = 0; j < cardRanks.length; j++) {
          // card = cardRanks[j] + suits[i];
          var point = j + 1;
          cardPix = cardRanks[j]+"_of_" + suits[i]+".png";
          deckOfCard.push({"rank": cardRanks[j],  "suite" : suits[i], "image" : cardPix, "backImage":"red_back.png", "points": point });
        }
      }
    }, // end setUpDeck

    pickRandomCards: function() {
      // pick 6 cards for each players
      // return 6 cards
      var arrayCards = [];
      var indexcard;
      var card
      for (var i= 0; i < 6; i++) {
        indexcard = Math.floor(Math.random() * deckOfCard.length);
        card = deckOfCard[indexcard];
        deckOfCard.splice(indexcard, 1);
        arrayCards.push(card);
      }
      console.log("how many " + deckOfCard.length);
      // console.log(arrayCards);
      return arrayCards;
    }, // end pickRandomCards
    getCardsForPlayers: function() {
      console.log("Get Cards for players");
      for (var i = 0; i < this.players.length; i++) {
        var cards = this.pickRandomCards(); // get the 6 cards
        this.players[i].card = cards;       // Assign it to a player
        // sort it by suite
        this.players[i].card.sort(function(a,b) {
          return a.suite > b.suite;
        })
      }

    }, // end getCardsForPlayers
    cleanPlayersCards: function () {
      console.log("moveCardsBackToDeck");
      var card ;
      for (var i = 0; i < this.players.length; i++) {

        for (var j = 0; j < this.players[i].card.length; j++) {
          card =this.players[i].card[j];
          deckOfCard.push(card);
        }
        this.players[i].card = []; // empty the bucket

      }
    }, // end cleanPlayersCards

    displayCards: function(str) {
      var $sectionMiddle;
      var className ;
      var arrayCard ;

      if (str === 'comp') {
        $sectionMiddle = $('#sec-middle-comp');
        className = 'cmp-player';
        arrayCard = this.players[0].card;
        $sectionMiddle.children('div').remove();  // remove children

      } else {
        $sectionMiddle = $('#sec-middle-human');
        className = 'human-player';
        arrayCard= this.players[1].card;
        $sectionMiddle.children('div').remove();  // remove children
      }

      for (var i = 0; i < 6; i++) {
        var $div = $('<div>').addClass(className);
        var $img = $('<img>').addClass("cardImage");
        if (str === 'comp') {
          $img.attr({
            id: 'comp-card-' + i,
            src: 'vendor/images/PNG-cards-1.3/'+arrayCard[i].backImage,
            title: "card",
            alt: arrayCard[i].image
          });

        } else {
          $img.attr({
            id: 'human-card-' + i,
            src: 'vendor/images/PNG-cards-1.3/'+arrayCard[i].image,
            title: "card",
            alt: arrayCard[i].image
          });

        }
        $div.text(arrayCard[i].rank+arrayCard[i].suite);

        $div.append($img);
        $sectionMiddle.append($div);
      }
    } ,          // end display cards


    setClickCards: function() {
      allButtons.setBtnCards();
    }

  } // end Games ...

  // --------------- end classes ------

  init();


}); // end JQuery
