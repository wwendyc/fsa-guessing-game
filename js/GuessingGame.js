function Game() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

function generateWinningNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

function newGame() {
  return new Game();
}

function shuffle(arr) {
  var unShuffled = arr.length;

  // while there are still unshuffled items
  while(unShuffled) {
    // pick i from 0 to t.length in arr
    var randomIndex = Math.floor(Math.random() * unShuffled--);

    // swap i with the last unshuffled item
    var temp = arr[unShuffled];
    arr[unShuffled] = arr[randomIndex];
    arr[randomIndex] = temp;
  }
  return arr;
}

function endGame() {
  $('h2').text("Click the 'Reset' button to play again.")
  $('#player-input, #submit, #hint').prop('disabled', true);
}

Game.prototype.difference = function () {
  return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function () {
  return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function (guess) {
  if (typeof guess !== 'number' || guess < 1 || guess > 100) {
    throw 'That is an invalid guess.';
  }
  this.playersGuess = guess;

  return this.checkGuess();
}

Game.prototype.checkGuess = function () {
  if (this.playersGuess === this.winningNumber) {
    $('h3').text("You Win!");
    endGame();
  } else {
    if (this.pastGuesses.includes(this.playersGuess)) {
      $('h3').text("You have already guessed that number. Try again.");
    }
    else {
      this.pastGuesses.push(this.playersGuess);
      $('#guesses li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
      if (this.pastGuesses.length === 5) {
        $('h3').text("You Lose.");
        endGame();
      }
      else {
        if (this.difference() < 10) $('h3').text("You\'re burning up!");
        else if (this.difference() < 25) $('h3').text("You\'re lukewarm.");
        else if (this.difference() < 50) $('h3').text("You\'re a bit chilly.");
        else $('h3').text("You\'re ice cold!");

        if (this.isLower()) {
          $('h2').text('Guess higher');
        }
        else $('h2').text('Guess lower');
      }
    }
  }
}

Game.prototype.provideHint = function () {
  var hintsArr = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];

  return shuffle(hintsArr);
}

function makeGuess(game) {
  // get player input
  var playerInput = +$('#player-input').val();
  // clear input
  $('#player-input').val('');
  // passing input into the function below
  var output = game.playersGuessSubmission(playerInput);
};

// JQuery functions
$(document).ready(function () {
  var game = new Game();

  $('#submit').on('click', function () {
    makeGuess(game);
  });

  $('#player-input').on('keypress', function (event) {
    if (event.keyCode == 13) {
      makeGuess(game);
    }
  });

  $('#hint').on('click', function () {
    $('h3').text(game.provideHint());
  })

  $('#reset').on('click', function () {
    game = newGame();
    $('h3').text('Guess a number from 0-100!');
    $('h2').text('...');
    $('.guess').text('-');
    $('#submit, #hint').prop('disabled', false);
  })
});
