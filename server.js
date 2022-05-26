// use the Express.js framework https://expressjs.com/
import express from 'express';


import uuid from 'uuid-random';
import *  as sqlite from 'sqlite3';
import * as wordBase from './sqlData.js';


// const sqlite = require('sqlite');
// import uuid from 'uuid';

// import * as wordBase from './wordle.js';

const app = express();

app.use(express.static('public' , { extensions: ['html']}));

// async function getWords(req,res){
//     res.json(await wordBase.listWords());
// }

// async function getWord(req,res){
//     const result = await wordBase.findWord(req.params.word);
//     if(!result){
//         res.status(404).send('No match for this Word');
//         return;
//     }
//     res.json(result);
// }

function responder(req, res) {
    if (req.url === '/dyn1'){
        const message = "pretty lil thing";
        const date = new Date().toString();

        res.write(message + '\n' + date);}
    else{
        res.statusCode = 404;
        res.write('Not Found!');
    }
    res.end();
}


function asyncWrap(f){
    return (req,res, next) => {
        Promise.resolve(f(req,res, next))
            .catch((e) => next(e || new Error()));
    };
}

app.listen(8080);



