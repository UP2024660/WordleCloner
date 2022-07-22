// use the Express.js framework https://expressjs.com/
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import schedule from 'node-schedule';
import * as dbData from './sqlDataManager';

const app = express();
let wOtD, sID;
dbData.chooseWord().then((word) => {
  wordOtD = word;
  sID = uuidv4();
  app.listen(8080);
});

app.use(express.static('public'));

app.post('/checkword', express.json(), async (req, res) => {
    let todWord = [];
    if (!(await dbData.checkWord(req.body.guess))){ res.setHeader('Content-Type', 'application/json'); res.send(JSON.stringify(todWord));return;}
    
    todWord = wordChecker(req.body.guess, wordOtD.toUpperCase());
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(todWord));
  });
  // Chooses Todays Word, Randomly, out of the SQL table * or the local list version.
  app.get('/chooseTodWord', (req, res) => { res.setHeader('Content-Type', 'application/json'); res.send(JSON.stringify(wordOtD)); console.log(wordOtD);
  });

  //Keeps the Same word, even if you refresh the page
  app.get('/sessionStatus', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(wordlSessionId));
  });

  // Changes the Word every 24 hours (or every restart of npm)
  schedule.scheduleJob('0 0 0 * * *', async function () {
    wordOtD = await dbData.chooseWord();
    sIDD = uuidv4();
  });
  
  // Regular functions that check the word, and check if letter is in word.

  function wordChecker(userGuess, correctWord) {
    const letValArr = ['0', '0', '0', '0', '0'];
    userGuess = userGuess.toUpperCase();
    const guessArr = userGuess.split('');
    const wordOtDArr = correctWord.split('');
    checkCharInWordPos(guessArr, wordOtDArr, letValArr);
    checkCharInWordExists(guessArr, wordOtDArr, letValArr);
    return letValArr;
  }
  
  // Check if character is in correct position
  function checkCharInWordPos(guessWordArr, wordOtDArr, letValArr) {
    for (let i = 0; i < wordOtDArr.length; i++) {
      if (wordOtDArr[i] === guessWordArr[i]) {
        letValArr[i] = '2';
        wordOtDArr[i] = '';
        guessWordArr[i] = '';
      }
    }
  }
  
  // Check if character is in word
  function checkCharInWordExists(guessWordArr, wordOtArr, letValArr) {
    for (let i = 0; i < wordOtDArr.length; i++) {
      if (guessWordArr[i] !== '' && wordOtDArr.includes(guessWordArr[i])) {
        letValArr[i] = '1';
        const char = guessWordArr[i];
        const index = wordOtDArr.indexOf(char);
        wordOtDArr[index] = '';
        guessWordArr[i] = '';
      }
    }
  }
