import config from './config.json';
import { Client, Collection } from 'discord.js';
import fs from 'fs';

const client = new Client();
client.commands = new Collection();

// Get our commands from the commands folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Set commands in our client
for(let i = 0, len = commandFiles.length; i < len; i++) {
    const command = require(`./commands/${commandFiles[i]}`);
	client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}! \nIf you haven't yet added the bot, press the link below`);
    console.log(`https://discordapp.com/oauth2/authorize?client_id=${client.user.toString().match(/\d/g).join("")}&scope=bot`);
});

client.on('message', msg => {
    if(msg.author.bot) return;
    if(msg.channel.type === "dm") return;

    if (msg.content === 'ping') {
        msg.reply('pong');
    }
    // just messing around
    if (msg.content === 'getReactions') {
        const filter = (reaction, user) => {
            console.log(user.id);
            console.log(msg.author.id);
            return reaction.emoji.name === '👌' && user.id === msg.author.id;
        };
        
        msg.awaitReactions(filter, { time: 15000 })
            .then(collected => console.log(`Collected ${collected.size} reactions`))
            .catch(console.error);
    }
});
  
client.login(config.bot_token);