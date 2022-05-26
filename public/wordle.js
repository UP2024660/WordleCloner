import {randomWordofTheDay} from './Backend.mjs';

import {words} from './Backend.mjs';


let wordOfTheDay = randomWordofTheDay();
const boardHeight = 6; //number of guesses
const boardWidth = 5; //length of the word
let row = 0; //current guess (attempt #)
let currentLetter= 0; //current letter for that attempt
let isOver = false;

window.onload = function(){
    intialize();
};


// schedule.scheduleJob(' 0 0 * * *', function(){
//     word = WordOfTheDay();
//     sessionId = uuidv4();
// });

function intialize() {

    // Create the game board
    for (let rows= 0;rows< boardHeight; rows++) {
        for (let columns= 0; columns< boardWidth; columns++) {
            // <span id="0-0" class="tile">P</span>
            let tile = document.createElement("span");
            tile.id = rows.toString() + "-" + columns.toString();
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);
        }
    }

    // Create the key board
    let keyboard = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L", " "],
        ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫" ]
    ];

    for (let i = 0; i < keyboard.length; i++) {
        let currRow = keyboard[i];
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard-row");

        for (let j = 0; j < currRow.length; j++) {
            let keyTile = document.createElement("div");

            let key = currRow[j];
            keyTile.innerText = key;
            if (key == "Enter") {
                keyTile.id = "Enter";
            }
            else if (key == "⌫") {
                keyTile.id = "Backspace";
            }
            else if ("A" <= key && key <= "Z") {
                keyTile.id = "Key" + key; // "Key" + "A";
            } 

            keyTile.addEventListener("click", processKey);

            if (key == "Enter") {
                keyTile.classList.add("enter-key-tile");
            } else {
                keyTile.classList.add("key-tile");
            }
            keyboardRow.appendChild(keyTile);
        }
        document.body.appendChild(keyboardRow);
    }
    

    // Listen for Key Press
    document.addEventListener("keyup", (e) => {
        processInput(e);
    });
}

function processKey() {
    e = { "code" : this.id };
    console.log(e);
    processInput(e);
}

function processInput(e) {
    if (isOver) return; 

    // alert(e.code);
    if ("KeyA" <= e.code && e.code <= "KeyZ") {
        if (currentLetter< boardWidth) {
            let currTile = document.getElementById(row.toString() + '-' +currentLetter.toString());
            if (currTile.innerText == "") {
                currTile.innerText = e.code[3];
                currentLetter+= 1;
            }
        }
    }
    else if (e.code == "Backspace") {
        if (0 < currentLetter&& currentLetter<= boardWidth) {
            currentLetter-=1;
        }
        let currTile = document.getElementById(row.toString() + '-' +currentLetter.toString());
        currTile.innerText = "";
    }

    else if (e.code == "Enter") {
        update();
    }

    if (!isOver && row == boardHeight) {
        isOver = true;
        document.getElementById("answer").innerText = wordOfTheDay;
    }
}


let valid = true;

async function validateWord (guess){
    guess = guess;
    const response = await fetch("https://dictionary-dot-sse-2020.nw.r.appspot.com/"+guess);
    if (response.status === 200){
        valid = true;
        return valid;
    } else {
        valid = false;
        return valid;
    }
}

function delay(time){
    return new Promise(resolve => setTimeout(resolve, time));

}

function update() {
    let guess = "";
    let valid = true;
    document.getElementById("answer").innerText = "";

    //string up the guesses into the word
    for (let c= 0; c< boardWidth; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;
        guess += letter;
    }

    guess = guess.toLowerCase(); //case sensitive

    validateWord(guess).then(valid => {
        if (valid){
            return;
        } else {
            document.getElementById("answer").innerText = "Not a real word!!!!";
        }
    });

    if (!words.includes(guess) && valid) {
        delay(3000);
        document.getElementById("answer").innerText = "Not in word list";
        return;
    }

    if (!words.includes(guess) && (!valid)) {
        document.getElementById("answer").innerText = "Not a real word!!";
        return;
    }
    
    //start processing guess
    let correct = 0;

    let letterCount = {}; //keep track of letter frequency, ex) KENNY -> {K:1, E:1, N:2, Y: 1}
    for (let i = 0; i < wordOfTheDay.length; i++) {
        let letter = wordOfTheDay[i];

        if (letterCount[letter]) {
           letterCount[letter] += 1;
        } 
        else {
           letterCount[letter] = 1;
        }
    }


    //first iteration, check all the correct ones first
    for (let columns= 0; columns< boardWidth; columns++) {
        let currTile = document.getElementById(row.toString() + '-' + columns.toString());
        let letter = currTile.innerText;

        //Is it in the correct position?
        if (wordOfTheDay[columns] == letter) {
            currTile.classList.add("correct");

            let keyTile = document.getElementById("Key" + letter);
            keyTile.classList.remove("present");
            keyTile.classList.add("correct");

            correct += 1;
            letterCount[letter] -= 1; //deduct the letter count
        }

        if (correct == boardWidth) {
            isOver = true;
        }
    }

    //go again and mark which ones are present but in wrong position
    for (let columns= 0; columns< boardWidth; columns++) {
        let currTile = document.getElementById(row.toString() + '-' + columns.toString());
        let letter = currTile.innerText;

        // skip the letter if it has been marked correct
        if (!currTile.classList.contains("correct")) {
            //Is it in the word?         //make sure we don't double count
            if (wordOfTheDay.includes(letter) && letterCount[letter] > 0) {
                currTile.classList.add("present");
                
                let keyTile = document.getElementById("Key" + letter);
                if (!keyTile.classList.contains("correct")) {
                    keyTile.classList.add("present");
                }
                letterCount[letter] -= 1;
            } // Not in the word or (was in word but letters all used up to avoid overcount)
            else {
                currTile.classList.add("absent");
                let keyTile = document.getElementById("Key" + letter);
                keyTile.classList.add("absent");
            }
        }
    }

    row += 1; //start new row
    currentLetter= 0; //start at 0 for new row
}