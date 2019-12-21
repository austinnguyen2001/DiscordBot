import config from './config.json';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as twitchStrategy } from 'passport-twitch.js';
import CryptoJS from 'crypto-js';
import { CommandoClient } from 'discord.js-commando';
import path from 'path';
import eventModule from './modules/eventModule';
import db from './rethinkDB.js';

/*
const xd = async () => {
    const user = await db.table('users').getAll("dfsdfsf", { index: "discordId" }).run();
    console.log(user);
    const updatedUser = await db.table('users').get(user[0].id).update({subscribed: 1}).run();
    db.table("users").get(user[0].id).delete().run()
}

xd();*/

const client = new CommandoClient({
	commandPrefix: '!',
	owner: '492176792426250252'
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['general', 'General Commands'],
        ['twitch', 'Twitch Commands'],
    ])
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! \nIf you haven't yet added the bot, press the link below`);
    console.log(`https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot`);
    client.user.setActivity("watching over name's server");
    new eventModule(client);
});

client.on('error', console.error);

client.login(config.bot_token);

// Start the oauth server
const app = express();
const PORT = 80;

app.use(session({
    key: process.env.SESSION_KEY,
    secret: config.secretKey,
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: true
    }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new twitchStrategy({
    clientID: "a4kj451whnqdg8fwj3zyo5ioxx0ofk",
    clientSecret: "mmavejold04x1oksfae2cc4rci0yya",
    callbackURL: "http://localhost/callback",
    scope: ["user_read", "channel:read:subscriptions"],
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    const reqStorage = Object.values(req.sessionStore.sessions)[0];
    const insertUser = {
        discordId: reqStorage.substring(reqStorage.search(/discordId/i) + 12, reqStorage.lastIndexOf('"')),
        twitchId: profile.id
    };
    const user = await db.table('users').insert(insertUser, { conflict: 'update', returnChanges: "always" }).run();
    return done(null, user.changes[0].new_val);
  }
));

app.get('/auth/:discordId*', (req, res, next) => {
  req.session.discordId = CryptoJS.Rabbit.decrypt(req.path.substring(6), config.secretKey).toString(CryptoJS.enc.Utf8);
  next();
}, passport.authenticate('twitch.js'));


app.get('/callback', passport.authenticate('twitch.js', { failureRedirect: '/' }), function(req, res) {
    res.redirect("/");
});

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});