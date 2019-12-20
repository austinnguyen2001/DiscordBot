import { Command } from 'discord.js-commando';
import db from '../rethinkDB';

/**
 * Nani discord.js commando making me use module.exports out here
 * but then again its not like I'm making my own wrapper
 */

module.exports = class DatabaseCommand extends Command {
	constructor(client, info) {
        super(client, info);
	}

    async createEvent(event) {
        db.table('events').insert(event).run();
    }
};

