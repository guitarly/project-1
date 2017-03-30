console.log("Catte Card game is running");

// JQuery
$(function() {

  // get all buttons
  var $btnStart = $('#btn-start'); // start button
  var $btnEnd = $('#btn-end');
  var $btnRestart = $('#btn-restart'); // restart the whole games
  var $btnFold = $('#btn-fold');    // fold button
  var $btnPlay = $('#btn-play');
  var $btnFoldCard = $('#foldCard');
  var $btnCompPick = $('#btn-comp-pick');
  var $btnBet5 = $('#btn-5');
  var $btnBet10 = $('#btn-10');
  var $btnBet20 = $('#btn-20');


  // set up buttons functions
  var allButtons = {
    startGame: function() {

      games.setUserFundBet(false, 0);
      if (games.bet <= 0) {
        alert("Please choose your bet.")
      } else {

        games.resetStartNewGame();
        games.cleanPlayersCards('computer'); // Clean the bucket first
        games.cleanPlayersCards('human'); // Clean the bucket first
        games.getCardsForPlayers(); // Get new cards for players
        games.displayCards('comp'); // display cards on the screen
        games.displayCards('human'); // display cards on the screen
        games.setClickCards();
        allButtons.setButtons();



      }

    },
    endGame: function() {
      console.log("End of Game");
      var answer = prompt("Do you want to close this window ?", "yes/no");
      if (answer.toUpperCase() === 'YES' ) {
        // display big message in the middle....
        games.setWinLossImage('OVER');
        games.hideElements("EndofGames");
      }
    },
    restart: function() { // reset the whole game
      console.log("restart game");
      init();
    },
    fold: function() {
      if ($.isEmptyObject(games.playerCardOnPlay) && games.playerTurn) {
        alert("Please pick a card.")

      } else {

        if (games.playerTurn) {
          if (games.playerDealer) {
            alert("You can't fold a card.")
          } else {
            games.foldCards("Human");
            games.removeCards('Human');
          }
        }
      }
    },
    play: function() {

      // Remove the current play card first.
      // var $getDiv = $('#card-in-play').remove();
      if ($.isEmptyObject(games.playerCardOnPlay) && games.playerTurn) {
        alert("Please pick a card.")

      } else {
        if (games.playerTurn) {



          games.removeCards('human');
          // --- testing.. get the current player card index
          // set it animate later
          // var currentIndex = games.playerCardCurrentIndex;
          // console.log("Current card " +  currentIndex);
          // var $getId = $('#human-card-'+currentIndex);
          // // $getId.animate({left: "-=300"}, 500);
          // $getId.hide( 1000, function() {
          //   $getId.remove();
          // });
          // ----------

          games.setPlayerCardSection();
          if (games.playerDealer && games.playerTurn) {
            // computer turn ...
            allButtons.checkComputer();
          } else {

            var check = games.checkComputerAndHumanCard() ;
            console.log("what is check here..." + check);
            if (check) {
              games.setBackCardImage('Computer');
            } else {
              games.setBackCardImage('Human');
            }

          }
        } else {
          alert("Computer turns")
        }

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
    },
    bet: function() {
      console.log($(this).text());
      console.log("is game over ? (inside bet) "+ games.gameOver);
      if (games.gameOver) {
        var getCurrentBet = games.bet ;
        if (getCurrentBet > 0) {
          games.setUserFundBet(true, getCurrentBet);
          games.bet = 0;
        }

        var creditGood = false;
        var bet = 0;
        // Check Credit
        var $getBet = $(this).text();
        if ($getBet=== '$5') {
          creditGood = games.checkCredit(5);
        } else if($getBet === '$10') {
          creditGood = games.checkCredit(10);
        } else if($getBet === '$20') {
          creditGood = games.checkCredit(20);
        }

        if (creditGood) {
          // set bet amount button
          if ($getBet=== '$5') {
            games.bet = 5;
            $('#btn-10').removeClass('btn-full');
            $('#btn-20').removeClass('btn-full');
            $('#btn-10').css('color','');
            $('#btn-20').css('color','');
          } else if($getBet === '$10') {
            games.bet = 10;
            $('#btn-5').removeClass('btn-full');
            $('#btn-20').removeClass('btn-full');
            $('#btn-5').css('color','');
            $('#btn-20').css('color','');
          } else if($getBet === '$20') {
            games.bet = 20;
            $('#btn-5').removeClass('btn-full');
            $('#btn-10').removeClass('btn-full');
            $('#btn-10').css('color','');
            $('#btn-5').css('color','');
          } else {
            games.bet = 0;
            $('#btn-5').removeClass('btn-full');
            $('#btn-10').removeClass('btn-full');
            $('#btn-20').removeClass('btn-full');

            $('#btn-10').css('color','');
            $('#btn-20').css('color','');
            $('#btn-5').css('color','');
          }

          $(this).css('color','white');
          $(this).addClass('btn-full');

        } else {
          games.bet = 0;  // not enough credit .. set it bet amount to 0
        } // end if credit good..
        games.setUserFundBet(false, games.bet );

      }


    }, // end Bet

    setBtnCards : function() { // add all six cards buttons for human players
      var tempVar ;
      for (var i = 0; i < 6; i++) {
        var $tempCard = "$btnClickCard"+i;
        $tempCard = $('#human-card-'+i);
        $tempCard.on('click', allButtons.pickCard);
      }
    }, // end setBtnCards
    computerPick: function() {
      // computer turn to hit a card.
      if (games.gameOver === false) {
        games.computerPickCard();
      }


    },
    checkComputer: function() {  // check computer to pick by itself

      games.checkComparedCard();


    }, // end computer turn
    setButtons: function() {  // set buttons once the game play or over.

      if (games.gameOver) {
        $('#btn-start').show();
        $('#btn-fold').hide();
        $('#btn-play').hide();
        $('#btn-5').removeClass('btn-full');
        $('#btn-10').removeClass('btn-full');
        $('#btn-20').removeClass('btn-full');

        $('#btn-10').css('color','');
        $('#btn-20').css('color','');
        $('#btn-5').css('color','');

      } else {
        $('#btn-start').hide();
        $('#btn-fold').show();
        $('#btn-play').show();
      }

    }

  };

  $btnCompPick.on('click', allButtons.computerPick);
  $btnStart.on('click', allButtons.startGame);  // click start a new round
  $btnEnd.on('click', allButtons.endGame);    // end the whole game
  $btnRestart.on('click', allButtons.restart);  // restart the games
  $btnFold.on('click', allButtons.fold);       // click fold button
  $btnPlay.on('click', allButtons.play);      // click play button
  $btnFoldCard.on('click', allButtons.fold);   // ??? will check this later
  $btnBet5.on('click', allButtons.bet);
  $btnBet10.on('click', allButtons.bet);
  $btnBet20.on('click', allButtons.bet);

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
    games.resetStartNewGame();

    games.resetTheWholeGame()
    games.setUpDeck();
    games.createPlayer("Computer");
    games.createPlayer("Human");
    games.setUserFundBet(true, 0);
    allButtons.setButtons();

  }

  // var card and deck.  will do a loop to generate all cards.
  var cards = {
    suits: ['spades', 'clubs', 'diamonds', 'hearts'],
    cardsRanks: ['2', '3', '4', '5','6','7', '8', '9', '10', 'jack', 'queen','king', 'ace'],
    deckOfCard: []
  };

  // -------------------
  // objects Classes ---
  // -------------------

  // player class
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
    playerPlayCard: 0,
    computerPlayCard: 0,
    playerDealer: true,
    gameOver: true,
    cmpWinByRound: 0,
    humWinByRound: 0,
    bet: 0,
    storeWinnerByRound:[],
    players: [],
    // Create a new peon
    createPlayer: function(name) {
      var newPlayer = new Player(name, 5);
      this.players.push(newPlayer);
    },
    setUpDeck : function() {  // setup a deck.  Loop thrus suites and ranks.
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
    checkWinner: function() {
      console.log(games.cmpWinByRound + "   human "+ games.humWinByRound);
      var countAllRound = games.cmpWinByRound + games.humWinByRound;
      var winMoney = 0;
      var humanWin = false;

      // if computer won 4 in the first four rounds. computer win
      if (games.cmpWinByRound === 4 && games.humWinByRound === 0) {
        games.gameOver = true;
        humanWin = false;
      }
      // if human won the first 4 rounds - human win.
      if (games.cmpWinByRound === 0 && games.humWinByRound === 4) {
        games.gameOver = true;
        humanWin = true;

      }
      console.log(games.storeWinnerByRound);

      // the comp and human pass first four around.  This is round #5 & 6.  who won a round 6 is the winner.
      if (games.storeWinnerByRound.length === 6) {
        var whoWin = games.storeWinnerByRound[5];
        console.log(whoWin);
        if (whoWin === "Computer") {
          humanWin = false;
        } else {
          humanWin = true;
        }
        games.gameOver = true;
      }

      if (games.gameOver) {
        if (humanWin) {
          //alert("You Win");
          games.setWinLossImage("Win");
          var winMoney = games.bet * 2;
          games.setUserFundBet(true,winMoney);


        } else {
          //alert("You Lost");
          games.setWinLossImage("lost");
        }
        games.bet = 0;
        allButtons.setButtons();

      }

    },
    cleanPlayersCards: function (player) {
      // clean all call.. this can be refresh the whole page.

      if (player === 'computer') {
        $('#comp-section').children().remove();  // remove all elements under it.
        $('#sec-middle-comp').children().remove(); // remove all elements under it.
      } else {
        // remove player section
        $('#play-section').children().remove(); // remove all elements under it.
        $('#sec-middle-human').children().remove(); // remove all elements under it.
      }
      $('.btn-text-box-winner').children().remove(); // remove image


      // Push all users cards back to the card deck.
      var card ;
      for (var i = 0; i < this.players.length; i++) {
        for (var j = 0; j < this.players[i].card.length; j++) {
          card =this.players[i].card[j];
          deckOfCard.push(card);
        }
        this.players[i].card = []; // empty the bucket

      }


    }, // end cleanPlayersCards
    setUserFundBet: function(isAdd, money) {


      var player = games.players[1];
      var fund =  player.money;
      console.log(fund);
      console.log(money);
      if (isAdd) {
        fund = fund + money;
      } else {
        fund =  fund - money;
      }
      games.players[1].money = fund;
      var $moneyBox = $('#btn-fund');
      $moneyBox.text("Credit:   $"+fund);



      if (fund <= 0 && games.bet === 0) {
        games.gameOver = true;
        games.setWinLossImage('OVER');
        games.hideElements('fund');

      }


    }, // End setUserFundBet

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
        games.playerDealer = false;
        games.playerTurn = false;
        // Player
        $playSection = $('#play-section');
        $backImage = games.playerCardOnPlay.backImage;

        games.cmpWinByRound++;
        games.storeWinnerByRound.push('Computer');

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
      games.checkWinner();

    }, // end Fold card

    removeCards: function(player) {
      var currentIndex ;
      var $getId ;

      if (player === "Computer") {
        // computer never show face up.. can remove any of if.
        var $secmiddlecomp = $('#sec-middle-comp');
        var $number = $secmiddlecomp.children('div').length;
        if($number >= 0) {
          var $getCompCard = $('#cmp-div-'+($number - 1));
          $getCompCard.remove();

        }

      } else {
        // remove the card on hand..
        currentIndex = games.playerCardCurrentIndex;
        $getId = $('#human-card-'+currentIndex);
        // $getId.animate({left: "-=300"}, 500);
        $getId.hide( 1000, function() {
          $getId.remove();
        });

      }


    }, // End removeCards
    computerPickCard: function() {

      if (games.playerTurn === false) {
        var computerCards = games.players[0].card;
        var pickRandomCard = Math.floor(Math.random() * computerCards.length);

        var card = computerCards[pickRandomCard];
        deckOfCard.push(card);
        games.players[0].card.splice(pickRandomCard, 1);
        games.compCardOnPlay = card;
        games.showComputerCard();
        games.playerTurn = true;
      }


    },
    showComputerCard: function() {
      var computerCards = games.players[0].card;
      if (computerCards.length > 0 || games.gameOver === false) {
        var countCard = games.computerPlayCard++;
        var $playSection = $('#comp-section');
        var $image = games.compCardOnPlay.image;
        $div = $('<div>').attr('id', 'card-in-play');
        $img = $('<img>').addClass("cardImage");
        $img.attr({
          id:  'cmp-card-'+countCard,
          src: 'vendor/images/PNG-cards-1.3/'+$image ,
          title: "card",
          alt: $image
        });
        $div.append($img);
        $playSection.append($div);

        games.removeCards("Computer");

      }


    }, // end show computer card

    setBackCardImage: function(player) {
      var cardOnHold;
      var $playerSection;
      var $idNum ;
      var tempVar ;
      if (player === "Computer") {
        cardOnHold = games.compCardOnPlay;
        $playerSection = $('#comp-section');
        $idNum = $playerSection.children().length;
        tempVar = '#cmp-card-'+ ($idNum - 1);
        games.playerDealer = true;
        games.playerTurn = true;
        games.humWinByRound++;
        games.storeWinnerByRound.push('Human');


      } else {

        cardOnHold = games.playerCardOnHold;
        $playerSection = $('#play-section');
        $idNum = $playerSection.children().length;
        tempVar = '#play-card-'+ ($idNum - 1);

        games.playerDealer = false;
        games.playerTurn = false;
        games.cmpWinByRound++;
        games.storeWinnerByRound.push('Computer');

      }

      var $playerCard = $(tempVar);
      $playerCard.attr({
        src: 'vendor/images/PNG-cards-1.3/'+cardOnHold.backImage
      });
      games.checkWinner();

    }, // end setBackCardImage
    setPlayerCardSection: function() {

      var playCard = games.playerPlayCard++;
      var $playSection = $('#play-section');
      var $div = $('<div>').attr('id', 'card-in-play');
      var $img = $('<img>').addClass("cardImage");
      $img.attr({
        id: 'play-card-'+playCard,
        src: 'vendor/images/PNG-cards-1.3/'+games.playerCardOnPlay.image,
        title: "card",
        alt: games.playerCardOnPlay.image
      });
      $div.append($img);
      $playSection.append($div);
      // pass the card which play put on the play section.
      games.playerCardOnHold = games.playerCardOnPlay;
      games.playerCardOnPlay = {};
      //games.playerTurn = false;

    }, // end setPlayerCardSection

    checkComparedCard: function() {  // computer calcuate cards

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
        games.playerTurn =true;  // Human win.. human go first
        games.playerDealer = true;
        games.humWinByRound++;
        games.storeWinnerByRound.push('Human');

      } else {  // find card(s) bigger than player's card

      filteredValue.sort(function(a,b) {  // Sort lowest cards.
        return a.points > b.points;
      });
      games.compCardOnPlay = filteredValue[0];
      games.showComputerCard();


      //   find index .. to remove it from the computer hands
      function findIndex() {
        var index = -1;
        for (var i = 0; i < computerCards.length; i++) {
          if (computerCards[i].suite === games.compCardOnPlay.suite &&
            computerCards[i].points === games.compCardOnPlay.points) {
              index = i;
              return index;
            }
          }
          return index;
        }

        var index = findIndex() ;
        if (index >= 0) {
          deckOfCard.push(games.compCardOnPlay);
          games.players[0].card.splice(index, 1);
        }
        games.setBackCardImage('Human');
        games.playerDealer = false;
        games.playerTurn = false;

      }

      games.checkWinner();
    },
    resetStartNewGame: function() {
      // Reset Winning rounds
      games.gameOver = false;
      games.cmpWinByRound = 0;
      games.humWinByRound = 0;
      games.playerPlayCard =  0;
      games.computerPlayCard = 0;
      games.storeWinnerByRound = [];
    }, // end resetStartNewGame
    checkCredit: function(bet) {
      // check credit - if less than bet amount .. return message

      var userCredit = games.players[1].money;

      if (parseInt(bet) > parseInt(userCredit)  ) {
        alert("You don't have enough credit to bet.")
        return false;
      }
      return true;
    },  // end checkCredit

    resetTheWholeGame: function() {
      // Reset the whole games...
      games.gameOver = true;
      games.compCardOnPlay = {};
      games.cmpWinByRound = 0;
      games.humWinByRound = 0;
      games.playerPlayCard =  0;
      games.computerPlayCard = 0;
      games.storeWinnerByRound = [];
      games.playerCardOnPlay = {};
      games.playerCardOnHold = {};
      games.playerCardCurrentIndex = null;
      games.playerTurn = true;
      games.playerPlayCard = 0;
      games.computerPlayCard = 0;
      games.playerDealer = true ;
      games.bet = 0;
      games.storeWinnerByRound = [];
      games.players = [];
      games.cleanPlayersCards('computer'); // Clean the bucket first
      games.cleanPlayersCards('human'); // Clean the bucket first

    }, // end resetTheWholeGame
    setWinLossImage: function(str) {

      var pictures ;
      str = str.toUpperCase();
      // set winning image
      if (str === 'WIN') {
        pictures = ['Big-Win.png','luckyWinner.png', 'win1.png'];
      } else if(str === "LOST"){
        pictures = ['youaretheloser.jpg', 'youjustlost.jpg'];
      } else if(str === "OVER") {
        pictures = ['gameOver.jpg', 'gameOver1.jpg'];
      }

      var index = Math.floor(Math.random() * pictures.length);
      var getPicture = pictures[index];

      var $btnTexBoxWinner = $('.btn-text-box-winner');
      $btnTexBoxWinner.children().remove();

      var $img = $('<img>').addClass("winner-image");
      if(str === 'OVER') {
        $img.attr({
          src: 'vendor/images/'+getPicture,
          title: "Winner",
          alt: getPicture
        });
        $img.css({'width':'90%'});
      } else {
        $img.attr({
          src: 'vendor/images/'+getPicture,
          title: "Winner",
          alt: getPicture
        });
      }

      $btnTexBoxWinner.append($img);

      // $btnTexBoxWinner.animate({left: '350px',
      // opacity: '0.9',
      // height: '150px',
      // width: '10%',
      // margin: '0 auto'});
      // $btnTexBoxWinner.animate({right: '350px',
      // opacity: '0.9',
      // height: '150px',
      // width: '190%',
      // margin: '0 auto'});
      //
      // $btnTexBoxWinner.animate({left: '350px',
      // opacity: '0.9',
      // height: '250px',
      // width: '70%',
      // bottom: '50%',
      // margin: '0 auto'});
      //
      //  $btnTexBoxWinner.stop();

    }, // end setWinLossImage
    hideElements: function(string) {
      if (string.toUpperCase() === 'FUND') {

      } else {
        $('.sec-head').children().hide();
      }

      $('.btn-text-box-cmp').children().hide();
      $('#sec-middle-comp').children().hide();
      $('#sec-middle-comp').hide();
      $('#comp-section').hide();
      $('#play-section').hide();
      $('#sec-middle-human').hide();
      $('.btn-text-box-money').children().hide();
      $('.btn-text-box-money').hide();
      $('.btn-text-box').hide();


    }, // end hideElements
    checkComputerAndHumanCard: function() {
      if (games.playerDealer === false) {
        var humanCard = games.playerCardOnHold;
        var computerCard = games.compCardOnPlay;

        // compare computer card and human card
        if (computerCard.suite === humanCard.suite) {
          if (computerCard.points > humanCard.points) {
            return false;
          } else {
            return true;  // player card is greater than computer card.
          }
        } else {
          return false; // fail.. no same suite .  can't beat the computer.
        }
      } else {
        return true;
      }
    }

  } // end Games ...

  // --------------- end classes ------

  init();


}); // end JQuery
