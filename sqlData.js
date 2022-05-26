// import sqlite3 from 'sqlite3';
// import uuid from 'uuid-random';
// import {open} from "sqlite";
// import {words} from './Backend.mjs';

// async function init(){
//     const dbPromise = await open({filename:'./words.db', driver: sqlite3.Database});
//     const db = await dbPromise;
//     await db.migrate({ migrationsPath: './migrations-sqlite'});
//     return db;
// }

// const dbConn = init();
    
// async function addWord(newWrd){
//     const db = await dbConn;
//     console.log(db);
//     const id = uuid();
//     console.log(id);
//     await db.run(
//       "INSERT INTO Words (id, word) VALUES (?, ?);",
//       id,
//       newWrd
//     );
// }

// addWord("hello");

// function databaseFill(){
//     console.log(words[1]);
//     for (let i = 0; i < words.length; i++){
//         addWord(words[i]);
//     }
// }

// databaseFill();
