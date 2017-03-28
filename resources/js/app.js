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
      games.cleanPlayersCards('computer'); // Clean the bucket first
      games.cleanPlayersCards('human'); // Clean the bucket first
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
      games.foldCards("human");
      games.removeCards('human');
    },
    play: function() {

      // Remove the current play card first.
      // var $getDiv = $('#card-in-play').remove();
      if ($.isEmptyObject(games.playerCardOnPlay) && games.playerTurn) {
        alert("Please pick a card.")

      } else {
        if (games.playerTurn) {

          // --- testing.. get the current player card index
          // set it animate later

          games.removeCards('human');
          // var currentIndex = games.playerCardCurrentIndex;
          // console.log("Current card " +  currentIndex);
          // var $getId = $('#human-card-'+currentIndex);
          // // $getId.animate({left: "-=300"}, 500);
          // $getId.hide( 1000, function() {
          //   $getId.remove();
          // });
          // ----------


          var $playSection = $('#play-section');
          var $div = $('<div>').attr('id', 'card-in-play');
          var $img = $('<img>').addClass("cardImage");
          $img.attr({
            // id: 'play-card',
            src: 'vendor/images/PNG-cards-1.3/'+games.playerCardOnPlay.image,
            title: "card",
            alt: games.playerCardOnPlay.image
          });
          $div.append($img);
          $playSection.append($div);
          // pass the card which play put on the play section.
          games.playerCardOnHold = games.playerCardOnPlay;
          games.playerCardOnPlay = {};
          games.playerTurn = false;
        }
        // computer turn ...
        games.computerTurn();

      };


    },

    pickCard: function() {
      var index = $(this).parent().text();
      var playerCard = games.players[1].card[index];
      games.playerCardOnPlay = playerCard;   // set player card - on play
      games.playerCardCurrentIndex = index;  // set play card index on hand
      var $currentCard = $('#human-card-'+index).css({
        'margin-top': '-50px'
      });
      console.log(playerCard);
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

  $btnStart.on('click', allButtons.startGame);  // click start a new round
  $btnEnd.on('click', allButtons.endGame);    // end the whole game
  $btnRestart.on('click', allButtons.restart);  // restart the games
  $btnFold.on('click', allButtons.fold);       // click fold button
  $btnPlay.on('click', allButtons.play);      // click play button
  $btnFoldCard.on('click', allButtons.fold);   // ??? will check this later

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
    cardsRanks: ['2', '3', '4', '5','6','7', '8', '9', '10', 'jack', 'queen','king', 'ace'],
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
    compCardOnPlay: {},
    compCardOnHold: {},
    playerCardOnPlay: {},
    playerCardOnHold: {},
    playerCardCurrentIndex: null,
    playerTurn: true,
    aroundOver: false,

    players: [],
    // Create a new peon
    createPlayer: function(name) {
      var newPlayer = new Player(name, 200);
      this.players.push(newPlayer);
    },
    setUpDeck : function() {
      console.log("desk " + deckOfCard.length);

      for (var i = 0; i < suits.length; i++) {  // loop suits
        for (var j = 0; j < cardRanks.length; j++) {  // loop ranks
          // card = cardRanks[j] + suits[i];
          var point = 1 + j;
          point++;
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
    cleanPlayersCards: function (player) {

      if (player === 'computer') {
        $('#comp-section').children().remove();
      } else {
        // remove player section
        $('#play-section').children().remove();
      }

      var card ;
      for (var i = 0; i < this.players.length; i++) {

        for (var j = 0; j < this.players[i].card.length; j++) {
          card =this.players[i].card[j];
          deckOfCard.push(card);
        }
        this.players[i].card = []; // empty the bucket

      }


    }, // end cleanPlayersCards

    displayCards: function(player) {
      var $sectionMiddle;
      var className ;
      var divId;
      var arrayCard ;

      if (player === 'comp') {
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
        if (player === 'comp') {
          divId = 'cmp-div-';
        } else {
          divId = 'hmn-div-';
        }

        var $div = $('<div>').addClass(className);
        var $img = $('<img>').addClass("cardImage");
        divId = divId + i;
        $div.attr('id', divId);
        if (player === 'comp') {
          $img.attr({
            id: 'comp-card-' + i,
            src: 'vendor/images/PNG-cards-1.3/'+arrayCard[i].backImage,
            // src: 'vendor/images/PNG-cards-1.3/'+arrayCard[i].image,
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
        // $div.text(arrayCard[i].rank+arrayCard[i].suite);
        $div.text(i);

        $div.append($img);
        $sectionMiddle.append($div);
      }
    } ,          // end display cards


    setClickCards: function() {
      allButtons.setBtnCards();
    },
    foldCards: function(player) {
      var $playSection;
      var $backImage ;
      var $div;
      if (player === 'Computer') {
        // Computer
        $playSection = $('#comp-section');
        $backImage = games.compCardOnPlay.backImage;


      } else {
        // Player
        $playSection = $('#play-section');
        $backImage = games.playerCardOnPlay.backImage;

      }

      $div = $('<div>').attr('id', 'card-in-play');
      $img = $('<img>').addClass("cardImage");
      $img.attr({
        src: 'vendor/images/PNG-cards-1.3/'+$backImage ,
        title: "card",
        alt: $backImage
      });
      $div.append($img);
      $playSection.append($div);

    }, // end Fold card

    removeCards: function(player) {
      var currentIndex ;
      var $getId ;

      if (player === "Computer") {
        console.log("remove card for computer");
        // computer never show face up.. can remove any of if.
        var $secmiddlecomp = $('#sec-middle-comp');
        var $number = $secmiddlecomp.children('div').length;
        if($number >= 0) {
          console.log($number);
          var $getCompCard = $('#cmp-div-'+($number - 1));
          $getCompCard.remove();

        }

      } else {

        currentIndex = games.playerCardCurrentIndex;
        console.log("Current card " +  currentIndex);
        $getId = $('#human-card-'+currentIndex);
        // $getId.animate({left: "-=300"}, 500);
        $getId.hide( 1000, function() {
          $getId.remove();
        });

      }


    }, // End removeCards
    showComputerCard: function() {

      var $playSection = $('#comp-section');
      var $image = games.compCardOnPlay.image;
      $div = $('<div>').attr('id', 'card-in-play');
      $img = $('<img>').addClass("cardImage");
      $img.attr({
        src: 'vendor/images/PNG-cards-1.3/'+$image ,
        title: "card",
        alt: $image
      });
      $div.append($img);
      $playSection.append($div);

      games.removeCards("Computer");

    }, // end show computer card

    computerTurn: function() {  // computer calcuate cards
      console.log('computer turn ');

      // Get Human card on hold
      var humanCardOnHold = games.playerCardOnHold;
      var humPoints = humanCardOnHold.points;
      var humSuite = humanCardOnHold.suite;
      //------------------

      // Setup and check computer card
      var computerCards = games.players[0].card;  // Get Computer Cards
      var filteredValue = computerCards.filter(function (item) { // find a same suite and point is bigger than human card
        return item.suite === humSuite && item.points > humPoints;
      });

      if(filteredValue.length === 0) {  // Computer has no card bigger than player .. need to fold one lowest card.

        computerCards.sort(function(a,b) {  // Sort lowest cards.
          return a.points > b.points;
        });

        games.compCardOnPlay = computerCards[0];  // assign smallest card
        deckOfCard.push(computerCards[0]);
        computerCards.shift();  // remove it from array.
        games.foldCards('Computer');
        games.removeCards("Computer");
        games.compCardOnPlay = {};

      } else {  // find card(s) bigger than player's card

      filteredValue.sort(function(a,b) {  // Sort lowest cards.
        return a.points > b.points;
      });
      games.compCardOnPlay = filteredValue[0];

      // for (var i = 0; i < filteredValue.length; i++) {
      //   console.log(filteredValue[i].rank + " point "+ filteredValue[i].points);
      // }
      // console.log(filteredValue.length);
      games.showComputerCard();
      // filteredValue.shift();


      //   find index .. to remove it from the computer hands
      function findIndex() {
        var index = -1;
        for (var i = 0; i < computerCards.length; i++) {
          if (computerCards[i].suite === games.compCardOnPlay.suite &&
              computerCards[i].points === games.compCardOnPlay.points) {
                alert("Suite is the same" + i);
              index = i;
              return index;
          }
        }
        return index;
      }

      // var found_names = $.grep(games.players[0].card, function(v) {
      //   return v.rank === games.compCardOnPlay.rank && v.points === games.compCardOnPlay.points;
      // });
      var index = findIndex() ;
      if (index >= 0) {
        console.log('i am in the index if statement ' + index);
        deckOfCard.push(games.compCardOnPlay);
        games.players[0].card.splice(index, 1);
      }

    }

    games.playerTurn =true;
  }

} // end Games ...

// --------------- end classes ------

init();


}); // end JQuery
