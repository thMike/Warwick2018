var config = {
    authDomain: "rubberduck-69fdc.firebaseapp.com",
    databaseURL: "https://rubberduck-69fdc.firebaseio.com",
    projectId: "rubberduck-69fdc",
};

var database;
var refs = { solved: null, notSolved: null };


var $newQuote = new Rx.Subject();
$(document).ready(function() {
    firebase.initializeApp(config);
    database = firebase.database();
    refs.solved = database.ref('numberOfProblemsSolved');
    refs.notSolved = database.ref('numberOfProblemsNotSolved');
    refs.solved.on('value', data => updateSolved(data.val()));
    database.ref('quotes').on('value', data => updateQuotes(data.val()));

    $newQuote.asObservable()
      .debounce(1000)
      .subscribe(quote => {
          $(".duck-speak").text(quote);
      })
});

$('textarea').on('keyup', function() {
    database.ref('readingQuotes').once('value', data => updateQuotes(data.val()));
});

$('textarea').on('click', function() {
    database.ref('startQuotes').once('value', data => updateQuotes(data.val()));
});

$('textarea').on('change', function() {
    database.ref('stopQuotes').once('value', data => updateQuotes(data.val()));
});

$('img').on('click', function() {
    database.ref('naggingQuotes').once('value', data => updateQuotes(data.val()));
});

var quotes = [];
function updateQuotes(newQuotes) {
    quotes = newQuotes;
    newQuote();
}

function newQuote() {

    var randomIndex = Math.floor(Math.random()*quotes.length);

    var quote = quotes[randomIndex];

    $newQuote.onNext(quote);

}
function updateSolved(numberOfSolved) {
    $("#numberOfSolved").text(numberOfSolved);
}

function incrementRef(dbRef) {
    dbRef.once('value', data => {
        var oldNumber = data.val();
        dbRef.set(oldNumber+1);
    })
}

function yes() {
    incrementRef(refs.solved);
}

function no() {
    incrementRef(refs.notSolved);
}
