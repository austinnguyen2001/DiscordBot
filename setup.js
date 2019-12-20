import readline from 'readline';
import fs from 'fs';
import { exec } from 'child_process';
import db from './rethinkDB';

db.tableCreate('users', {primaryKey: 'discordId'}).run();
db.tableCreate('events', {primaryKey: 'messageId'}).run();

// Initialize readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const editConfig = async () => {
    const replace = `{ 
        "bot_token": "${questionReponses[0]}", 
        "twitch_client_id": "${questionReponses[1]}".
        "secretKey": ""${questionReponses[2]}"
    }`;

    fs.writeFile("config.json", replace, (err) => {
        if (err) 
            return console.log(err);
    });
}

const startBot = () => {
    const bot = exec('babel-node ./bot.js', (err) => {  
        if (err) 
          return console.error(err);   
    });  

    bot.stdout.on('data', function(data) {
        console.log(data.toString()); 
    });
}

let questionReponses = [];
const questionIterator = [
    'What is your discord bot token?',
    'What is your twitch client id?',
    "What do you want your secret key to be?"
][Symbol.iterator]();

// Init first question
console.log(questionIterator.next().value);

rl.on('line', (input) => {
    const nextQuestion = questionIterator.next();
    questionReponses.push(input);
    if(nextQuestion.done === false)
        console.log(nextQuestion.value);
    else {
        rl.close();
        editConfig().then(() => startBot());
    }
});