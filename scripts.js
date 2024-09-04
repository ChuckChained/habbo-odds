const p1 = document.getElementById("p1");
const p2 = document.getElementById("p2");
const p3 = document.getElementById("p3");
const p4 = document.getElementById("p4");
const p5 = document.getElementById("p5");
const p6 = document.getElementById("p6");

const d1 = document.getElementById("d1");
const d2 = document.getElementById("d2");
const d3 = document.getElementById("d3");
const d4 = document.getElementById("d4");
const d5 = document.getElementById("d5");
const d6 = document.getElementById("d6");

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
    event.preventDefault();
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
        if(selectedGame === '6') {
            document.getElementById("stick").innerHTML = '<b> Stick on: </b><select id = "stickList";><option> ---Choose Number--- </option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option>';
        } else if (selectedGame === '13') {
            document.getElementById("stick").innerHTML = '<b> Stick on: </b><select id = "stickList";><option> ---Choose Number--- </option><option>9</option><option>10</option><option>11</option><option>12</option><option>13</option>';
        } else if (selectedGame === '21') {
            document.getElementById("stick").innerHTML = '<b> Stick on: </b><select id = "stickList";><option> ---Choose Number--- </option><option>17</option><option>18</option><option>19</option><option>20</option><option>21</option>';
        };
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

function poker() {
    playersHand.push(rollDice());
    playersHand.push(rollDice());
    playersHand.push(rollDice());
    playersHand.push(rollDice());
    playersHand.push(rollDice());

    dealersHand.push(rollDice());
    dealersHand.push(rollDice());
    dealersHand.push(rollDice());
    dealersHand.push(rollDice());
    dealersHand.push(rollDice());

    var pHandSorted = playersHand.sort(function(a, b){return b - a});
    var dHandSorted = dealersHand.sort(function(a, b){return b - a});
    console.log(pHandSorted, dHandSorted);
    //console.log(pokerHandCheck(playersHand));
    //pokerHandCheck(dealersHand);
    console.log(pokerHandCheck(pHandSorted));
    console.log(pokerHandCheck(dHandSorted));
    var winner = pokerHandCompare(pokerHandCheck(pHandSorted), pokerHandCheck(dHandSorted))
    updateGameHistory(gameNumber, pHandSorted, pokerHandCheck(pHandSorted)[1], dHandSorted, pokerHandCheck(dHandSorted)[1], winner);
    updateStats(playerWins, ties, dealerWins);
    updatePercent();
    gameNumber++;
    displayDice(pHandSorted,"P");
    displayDice(dHandSorted,"D");
}

function pokerHandCheck(hand) {
    if(hand[0] == hand[4]) {
        return [1, "Five of a kind", hand[0]];
    } else if(hand[0] == hand[3] || hand[1] == hand[4]) {
        return [2, "Four of a kind", hand[1]];
    } else if(hand[0] == hand[2] && hand[3] == hand[4]) {
        return [3, "Strong Full House", hand[0], hand[4]];
    } else if(hand[0] == hand[1] && hand[2] == hand[4]) {
        return [4, "Weak Full House", hand[2], hand[0]];
    } else if(hand[0] == 6 && hand[1] == 5 && hand[2] == 4 && hand[3] == 3 && hand[4] == 2) {
        return [5, "High Straight"]
    } else if(hand[0] == 5 && hand[1] == 4 && hand[2] == 3 && hand[3] == 2 && hand[4] == 1) {
        return [6, "Low Straight"]
    } else if(hand[0] == hand[2] || hand[1] == hand[3] || hand[2] == hand[4]) {
        return [7, "Three of a kind", hand[2]]
    } else {
        const set = new Set(hand);
        const duplicates = hand.filter(item => {
            if(set.has(item)) {
                set.delete(item);
                return false;
            } else {
                return true;
            }
        })
        if(duplicates.length > 1) {
            return [8, "Two Pair", duplicates[0], duplicates[1]];
        } else if(duplicates > 0) {
            return [9, "One Pair", duplicates[0]];
        } else {
            return [10, "Junk"];
        }
    }
}

function pokerHandCompare(hand1, hand2) {
    if(hand2[0] < hand1[0]) {
        dealerWins++;
        return "Dealer";
    } else if(hand2[0] == hand1[0] && hand2[0] == 1) {
        if(hand2[2] >= hand1[2]) {
            dealerWins++;
            return "Dealer";
        } else {
            playerWins++;
            return "Player";
        }
    } else if(hand2[0] == hand1[0] && hand2[0] == 2) {
        if(hand2[2] >= hand1[2]) {
            dealerWins++;
            return "Dealer";
        } else {
            playerWins++;
            return "Player";
        }
    } else if(hand2[0] == hand1[0] && hand2[0] == 3) {
        if(hand2[2] > hand1[2]) {
            dealerWins++;
            return "Dealer";
        } else if(hand1[2] > hand1[2]) {
            playerWins++;
            return "Player";
        } else if(hand2[2] == hand2[2]) {
            if(hand2[3] >= hand1[3]) {
                dealerWins++;
                return "Dealer";
            } else if(hand2[3] < hand1[3]) {
                playerWins++;
                return "Player";
            }
        }
    } else if(hand2[0] == hand1[0] && hand2[0] == 4) {
        if(hand2[2] > hand1[2]) {
            dealerWins++;
            return "Dealer";
        } else if(hand1[2] > hand1[2]) {
            playerWins++;
            return "Player";
        } else if(hand2[2] == hand2[2]) {
            if(hand2[3] >= hand1[3]) {
                dealerWins++;
                return "Dealer";
            } else if(hand2[3] < hand1[3]) {
                playerWins++;
                return "Player";
            }
        }
    } else if(hand2[0] == hand1[0] && hand2[0] == 5) {
        dealerWins++;
        return "Dealer";
    } else if(hand2[0] == hand1[0] && hand2[0] == 6) {
        dealerWins++;
        return "Dealer";
    } else if(hand2[0] == hand1[0] && hand2[0] == 7) {
        if(hand2[2] >= hand1[2]) {
            dealerWins++;
            return "Dealer";
        } else if(hand2[2] < hand1[2]) {
            playerWins++;
            return "Player";
        }
    } else if(hand2[0] == hand1[0] && hand2[0] == 8) {
        if(hand2[2] > hand1[2]) {
            dealerWins++;
            return "Dealer";
        } else if(hand1[2] > hand1[2]) {
            playerWins++;
            return "Player";
        } else if(hand2[2] == hand2[2]) {
            if(hand2[3] >= hand1[3]) {
                dealerWins++;
                return "Dealer";
            } else if(hand2[3] < hand1[3]) {
                playerWins++;
                return "Player";
            }
        }
    } else if(hand2[0] == hand1[0] && hand2[0] == 9) {
        if(hand2[2] >= hand1[2]) {
            dealerWins++;
            return "Dealer";
        } else {
            playerWins++;
            return "Player";
        }
    } else if(hand2[0] == hand1[0] && hand2[0] == 10) {
        dealerWins++;
        return "Dealer";
    } else if(hand1[0] < hand2[0]) {
        playerWins++;
        return "Player";
    }
}

function rollDice() {
    return getRandomInt(6)+1
}

function tri(rule) {
    playersHand.push(rollDice());
    playersHand.push(rollDice());
    playersHand.push(rollDice());

    dealersHand.push(rollDice());
    dealersHand.push(rollDice());
    dealersHand.push(rollDice());

    var playersSum = playersHand.reduce((partialSum, a) => partialSum + a, 0);
    var dealersSum = dealersHand.reduce((partialSum, a) => partialSum + a, 0);

    if(rule == 'low') {
        if(playersSum >= dealersSum) {
            console.log('Dealer Wins');
            winner = "Dealer";           
            dealerWins++;
        } else if (playersSum < dealersSum) {
            console.log('Player Wins');
            winner = "Player";
            playerWins++;
        }
    } else if (rule == 'high') {
        if(playersSum <= dealersSum) {
            console.log('Dealer Wins');
            winner = "Dealer";
            dealerWins++;
        } else if (playersSum > dealersSum) {
            console.log('Player Wins');
            winner = "Player";
            playerWins++;
        }
    }
    updateGameHistory(gameNumber, playersHand, playersSum, dealersHand, dealersSum, winner);
    updateStats(playerWins, ties, dealerWins);
    updatePercent();
    gameNumber++;
    displayDice(playersHand,"P");
    displayDice(dealersHand,"D");
};


function sixThirteenTwentyone(game, rules, stick) {
    playersHand.push(rollDice());
    playersHand.push(rollDice());
    while(playersHand.reduce((partialSum, a) => partialSum + a, 0) < stick) {
        playersHand.push(rollDice());
    }

    const playersSum = playersHand.reduce((partialSum, a) => partialSum + a, 0);
//    console.log(playersHand);
    console.log(playersHand);
    console.log("Players Total: " + playersSum);
    if(playersSum > game) {
        console.log("Player Bust")
        console.log("Result: Dealer Wins")
        winner = "Dealer"
        updateGameHistory(gameNumber, playersHand, playersSum, dealersHand, dealersHand.reduce((partialSum, a) => partialSum + a, 0), winner);
        dealerWins++;
        updateStats(playerWins, ties, dealerWins);
        updatePercent();
        gameNumber++;
        displayDice(playersHand,"P");
        displayDice(dealersHand,"D");
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
        } else if (dealersHand.reduce((partialSum, a) => partialSum + a, 0) > game) {
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
    updateStats(playerWins, ties, dealerWins);
    updatePercent();
    gameNumber++;
    console.log("tie percent = " + tiePercent);
    displayDice(playersHand,"P");
    displayDice(dealersHand,"D");
}

function reset() {
    const tableBody = document.getElementById('gameHistory').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = "<tbody></tbody>";

    p1.innerText = "";
    d1.innerText = "";

    p2.innerText = "";
    d2.innerText = "";

    document.getElementById("pp").innerHTML = 0;
    document.getElementById("tp").innerHTML = 0;
    document.getElementById("dp").innerHTML = 0;
    updateStats(0, 0, 0);

    gameNumber = 0;
    playerWins = 0;
    dealerWins = 0;
    ties = 0;

}

function run() {
    var gameList = document.getElementById("gameList");
    var rules = document.getElementById("ruleList");
    var stick = document.getElementById("stickList");
    var numberGamesInput = document.getElementById("numberGamesInput").value;
    totalGames = Number(totalGames) + Number(numberGamesInput);
    //var playUntil = totalGames + numberGamesInput;
    console.log("It ran!");

    while(gameNumber - 1 < totalGames) {
        p1.innerHTML = '';
        d1.innerHTML = '';
        playersHand = [];
        dealersHand = [];
        if(gameList.options[gameList.selectedIndex].text == "13" || gameList.options[gameList.selectedIndex].text == "6" || gameList.options[gameList.selectedIndex].text == "21") {
            if(rules.options[rules.selectedIndex].text == "---Choose Rules---") {
                alert("Please select rules.");
                return;
            } else if(stick.options[stick.selectedIndex].text == "---Choose Number---") {
                alert("Please select a minimum number to stick on");
                return;
            }
        
        sixThirteenTwentyone(gameList.options[gameList.selectedIndex].text, rules.options[rules.selectedIndex].text, stick.options[stick.selectedIndex].text);
        //thirteen(rules.options[rules.selectedIndex].text);
        
    } else if(gameList.options[gameList.selectedIndex].text == "Tri Low") {
        tri('low')
    } else if(gameList.options[gameList.selectedIndex].text == "Tri High") {
        tri('high')
    } else if(gameList.options[gameList.selectedIndex].text == "Poker") {
        poker();
    }
    else {
        alert("Please select a game");
        return;
    }
    
 //   thirteen();
    }
//    totalGames += numberGamesInput;
    updateRecentGame();
//    totalGames = totalGames + numberGamesInput;
}

function updateRecentGame() {
    const tableBody = document.getElementById('gameHistory').getElementsByTagName('tbody')[0];
    const mostRecentGame = document.getElementById('gameHistory').getElementsByTagName('tbody')[0];
//    p1.innerText = mostRecentGame.getElementsByTagName("tr")[0].getElementsByTagName("td")[1].innerText;
//    d1.innerText = mostRecentGame.getElementsByTagName("tr")[0].getElementsByTagName("td")[3].innerText;

    p6.innerText = " = " + mostRecentGame.getElementsByTagName("tr")[0].getElementsByTagName("td")[2].innerText;
    d6.innerText = " = " + mostRecentGame.getElementsByTagName("tr")[0].getElementsByTagName("td")[4].innerText;

}

function updatePercent() {
    document.getElementById("pp").innerHTML = Math.round((playerWins / gameNumber * 100) * 100) / 100;
    document.getElementById("tp").innerHTML = Math.round((ties / gameNumber * 100) * 100) / 100;
    document.getElementById("dp").innerHTML = Math.round((dealerWins / gameNumber * 100) * 100) / 100;
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

    if(result == "Dealer") {
        newRow.appendChild(playerTotalCell).style["color"] = "red";
    } else if (result == "Player") {
        newRow.appendChild(playerTotalCell).style["color"] = "lime";
    } else {
        newRow.appendChild(playerTotalCell).style["color"] = "orange";
    };

    const dealerHandCell = document.createElement('td');
    dealerHandCell.textContent = dHand;
    newRow.appendChild(dealerHandCell);

    const dealerTotalCell = document.createElement('td');
    dealerTotalCell.textContent = dTotal;

    if(result == "Dealer") {
        newRow.appendChild(dealerTotalCell).style["color"] = "lime";
    } else if (result == "Player") {
        newRow.appendChild(dealerTotalCell).style["color"] = "red";
    } else {
        newRow.appendChild(dealerTotalCell).style["color"] = "orange";
    };

    const winnerCell = document.createElement('td');
    winnerCell.textContent = result;
    newRow.appendChild(winnerCell);

    // Insert the new row at the top of the table body
    tableBody.insertBefore(newRow, tableBody.firstChild);
};

function displayDice(hand, pord) {
//    newImg = document.createElement('img');
//    p5.src="6.png";
    const ps = [p1,p2,p3,p4,p5];
    const ds = [d1,d2,d3,d4,d5];
    const all = [[ps], [ds]];
    const imgs = ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png"];
    let who = 2;

if(pord == "P") { 
    who == 0 
    } else {
        who == 1
    } 

    for(let i = 0; i < hand.length + 1; i++) {
//        for(let j = 0; j < 5; j++) {
            for(let k = 6; k > 0; k--) {
                if(pord == "P" && hand[i] == k) {
                    el = document.createElement('img');
                    el.src=k+".png";
                    el.setAttribute("id", "p"+i);
                    el.style="height:30px; width:30px";
                    document.getElementById("p1").appendChild(el);
                    //ps[i].src=imgs[k-1].style.visibility = "hidden";
                } else if (pord == "D" && hand[i] == k) {
                    el = document.createElement('img');
                    el.src=k+".png";
                    el.setAttribute("id", "d"+i);
                    el.style="height:30px; width:30px";
                    document.getElementById("d1").appendChild(el);
                    //ds[i].src=imgs[k-1].style.visibility = "hidden";
                }
//            }
        } 
    }
}
