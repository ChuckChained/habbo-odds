// Options
// Number of Rolls to Simulate
// Games
// Game rules (tie = dealer, 13o)
const p1 = document.querySelector("#p1");
const p2 = document.querySelector("#p2");
const p3 = document.querySelector("#p3");
const p4 = document.querySelector("#p4");
const p5 = document.querySelector("#p5");

const d1 = document.querySelector("#d1");
const d2 = document.querySelector("#d2");
const d3 = document.querySelector("#d3");
const d4 = document.querySelector("#d4");
const d5 = document.querySelector("#d5");

const gHistory = document.getElementById("history");


const goBtn = document.querySelector("#goBtn");
const resetBtn = document.querySelector("#resetBtn");
var playersHand = [];
var dealersHand = [];
var gameHistory = [];
var selectedGame = "";
var gameNumber = 1;
var playerWins = 0;
var playerPercent = playerWins / gameNumber;
var ties = 0;
//var tiePercent = ties / gameNumber * 100;
var tiePercent = (ties / gameNumber);
var dealerWins = 0;
var dealerPercent = dealerWins / gameNumber;
var game;
var totalGames = 0;
/////// BUTTON EVENT LISTENERS //////
goBtn.addEventListener("click", function (e) {
    console.log(this);
    run();
//    console.log(e.currentTarget === this);
});

resetBtn.addEventListener("click", function (e) {
    console.log(this);
    reset();
});

function gameUpdate() {
    var mylist = document.getElementById("gameList");
    selectedGame = mylist.options[mylist.selectedIndex].text;
    game = selectedGame;  
    console.log(selectedGame);
    //var ruleList = document.getElementById("ruleList");
    if(selectedGame === '6' || selectedGame === '13' || selectedGame === '13o' || selectedGame === '21') {
        console.log("6,13,21");
        document.getElementById("rules").innerHTML = '<b> What rules? </b><select id = "ruleList" onchange = ruleUpdate();><option> ---Choose Rules--- </option><option> Tie = Redo </option><option> Tie = Dealer </option><option> Tie = Redo + Ignore Tie Stats </option></select>';
    } else if(selectedGame === 'Poker' || selectedGame === 'Tri High' || selectedGame === 'Tri Low' ) {
        document.getElementById("rules").innerHTML = "<b>Rules: </b><p> Tie = Dealer </p>"
}
}

function ruleUpdate() {
    console.log("success")
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
    }

function rollDice2() {
    console.log(getRandomInt(6)+1);
    for(let i = 0; i < 5; i++) {
        playersHand.push(getRandomInt(6)+1)
    }
    console.log("Players Hand: " + playersHand)
    p1.innerText = playersHand[0];
    p2.innerText = playersHand[1];
    p3.innerText = playersHand[2];
    p4.innerText = playersHand[3];
    p5.innerText = playersHand[4];
    for(let i = 0; i < 5; i++) {
        dealersHand.push(getRandomInt(6)+1)
    }
    console.log("Dealers Hand: " + dealersHand)
    d1.innerText = dealersHand[0];
    d2.innerText = dealersHand[1];
    d3.innerText = dealersHand[2];
    d4.innerText = dealersHand[3];
    d5.innerText = dealersHand[4];

    toHistory(playersHand.join(" "), dealersHand.join(" "))
}

function rollDice() {
    return getRandomInt(6)+1
}

function thirteen(rules) {
    playersHand.push(rollDice());
    playersHand.push(rollDice());
    while(playersHand.reduce((partialSum, a) => partialSum + a, 0) < 11) {
        playersHand.push(rollDice());
    }

    const playersSum = playersHand.reduce((partialSum, a) => partialSum + a, 0);
//    console.log(playersHand);
    console.log(playersHand);
    console.log("Players Total: " + playersSum);
    if(playersSum > 13) {
        console.log("Player Bust")
        console.log("Result: Dealer Wins")
        winner = "Dealer"
        updateGameHistory(gameNumber, playersHand, playersSum, dealersHand, dealersHand.reduce((partialSum, a) => partialSum + a, 0), winner);
        updateStats(playerWins, ties, dealerWins);
        gameNumber++;
        dealerWins++;
        //updateStats(playerWins, playerPercent, ties, tiePercent, dealerWins, dealerPercent);
        return;
    }
    dealersHand.push(rollDice());
    while(dealersHand.reduce((partialSum, a) => partialSum + a, 0) < playersSum) {
        dealersHand.push(rollDice());

        if(dealersHand.reduce((partialSum, a) => partialSum + a, 0) == playersSum) {
            if(rules == "Tie = Redo") {
                console.log("Tie. Redo.");
                winner = "Tie";
                ties++;
            } else if (rules == "Tie = Dealer") {
                console.log("Tie. Dealer Wins.");
                winner = "Dealer";
                dealerWins++;
            } else if (rules == "Tie = Redo + Ignore Tie Stats") {
                console.log("Ignoring Tie");
                gameNumber--;
                winner = "Tie"
            }
        } else if (dealersHand.reduce((partialSum, a) => partialSum + a, 0) > 13) {
            console.log("Dealer Bust");
            console.log("Result: Player Wins");
            winner = "Player";
            playerWins++;
        } else if (dealersHand.reduce((partialSum, a) => partialSum + a, 0) > playersSum) {
            console.log("Player: " + playersSum + " Dealer: " + dealersHand.reduce((partialSum, a) => partialSum + a, 0))
            console.log("Result: Dealer Wins");
            winner = "Dealer";
            dealerWins++;
        }
    } 
    console.log(dealersHand)
    console.log("Dealers Total: " + dealersHand.reduce((partialSum, a) => partialSum + a, 0));
    updateGameHistory(gameNumber, playersHand, playersSum, dealersHand, dealersHand.reduce((partialSum, a) => partialSum + a, 0), winner);
    gameNumber++;
    updateStats(playerWins, ties, dealerWins);
    updatePercent();
    console.log("tie percent = " + tiePercent);
}

function reset() {

}

function run() {
    var gameList = document.getElementById("gameList");
    var rules = document.getElementById("ruleList");
    var numberGamesInput = document.getElementById("numberGamesInput").value;
    console.log("It ran!");

    while(gameNumber - 1 < totalGames + numberGamesInput) {
        playersHand = [];
        dealersHand = [];
        if(gameList.options[gameList.selectedIndex].text == "13") {
            if(rules.options[rules.selectedIndex].text == "---Choose Rules---") {
                alert("Please select rules.");
                return;
            }
        thirteen(rules.options[rules.selectedIndex].text);
    } else {
        alert("Please select Game 13");
        return;
    }
    
 //   thirteen();
    }
    updateRecentGame();
//    totalGames = totalGames + numberGamesInput;
}

function updateRecentGame() {
    const tableBody = document.getElementById('gameHistory').getElementsByTagName('tbody')[0];
    const mostRecentGame = document.getElementById('gameHistory').getElementsByTagName('tbody')[0];
//    const pHand = 
    p1.innerText = mostRecentGame.getElementsByTagName("tr")[0].getElementsByTagName("td")[1].innerText;
    d1.innerText = mostRecentGame.getElementsByTagName("tr")[0].getElementsByTagName("td")[3].innerText;

    p2.innerText = " = " + mostRecentGame.getElementsByTagName("tr")[0].getElementsByTagName("td")[2].innerText;
    d2.innerText = " = " + mostRecentGame.getElementsByTagName("tr")[0].getElementsByTagName("td")[4].innerText;

}

function updatePercent() {
    document.getElementById("pp").innerHTML = Math.round((playerWins / (gameNumber - 1) * 100) * 100) / 100;
    document.getElementById("tp").innerHTML = Math.round((ties / (gameNumber - 1) * 100) * 100) / 100;
    document.getElementById("dp").innerHTML = Math.round((dealerWins / (gameNumber - 1) * 100) * 100) / 100;
}

function updateStats(pWins, ties, dW) {
    document.getElementById("pw").innerHTML = pWins;
    document.getElementById("tw").innerHTML = ties;
    document.getElementById("dw").innerHTML = dW;
}

function updateGameHistory(gameno, pHand, pTotal, dHand, dTotal, result) {
    // Get the table body element where the game history will be displayed
    const tableBody = document.getElementById('gameHistory').getElementsByTagName('tbody')[0];

    // Create a new row element
    const newRow = document.createElement('tr');

    // Create and append cells to the new row
    const gameNoCell = document.createElement('td');
    gameNoCell.textContent = gameno;
    newRow.appendChild(gameNoCell);

    const playerHandCell = document.createElement('td');
    playerHandCell.textContent = pHand;
    newRow.appendChild(playerHandCell);

    const playerTotalCell = document.createElement('td');
    playerTotalCell.textContent = pTotal;
    newRow.appendChild(playerTotalCell);

    const dealerHandCell = document.createElement('td');
    dealerHandCell.textContent = dHand;
    newRow.appendChild(dealerHandCell);

    const dealerTotalCell = document.createElement('td');
    dealerTotalCell.textContent = dTotal;
    newRow.appendChild(dealerTotalCell);

    const winnerCell = document.createElement('td');
    winnerCell.textContent = result;
    newRow.appendChild(winnerCell);

    // Insert the new row at the top of the table body
    tableBody.insertBefore(newRow, tableBody.firstChild);
};

function myFunction() {
    var x = document.getElementById("frm1");
    var text = "";
    var i;
    for (i = 0; i < x.length ;i++) {
      text += x.elements[i].value + "<br>";
    }
    document.getElementById("demo").innerHTML = text;
  }
