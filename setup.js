import readline from 'readline';
import fs from 'fs';
import { exec } from 'child_process';

// Initialize readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const editConfig = async () => {
    const replace = `{ 
        "bot_token": "${questionReponses[0]}", 
        "twitch_client_id": "${questionReponses[1]}"
    }`;
    fs.writeFile("config.json", replace, (err) => {
        if (err) 
            return console.log(err);
        console.log("Config saved successfully! Starting bot.....");
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

const questions = [
    'What is your discord bot token?',
    'What is your twitch client id?'
];

const questionIterator = questions[Symbol.iterator]();
let questionReponses = [];

// Init first question
console.log(questionIterator.next().value);

rl.on('line', (input) => {
    const nextQuestion = questionIterator.next();
    questionReponses.push(input);
    if(nextQuestion.done === false)
        console.log(nextQuestion.value);
    else {
        rl.close();
        editConfig().then(() => startBot())
    }
});