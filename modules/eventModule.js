
import { RichEmbed } from 'discord.js';
import db from '../rethinkDB';

const timeConversions = {
  d: '86400000',
  h: '3600000',
  m: '60000',
	s: '1000'
}

export default class EventModule {
  constructor(client) {
    this.client = client;
    this.channels = Array.from(client.channels.values());
    this.events = [];
    this.fetchContest();
    setInterval(() => this.tick(), 3000);
    db.table('events').changes().run((err, cursor) => {
      cursor.each((err, row) => {
        this.events.push(row.new_val);
        console.log(row.new_val)
      })
    });
  }

  async tick() {
    const currTime = Date.now();
    for(let k = 0, length = this.events.length; k < length; k++) {
      const selectedChannel = this.channels.filter(channel => channel.id === this.events[k].channelId);
      const selectedMessage = await selectedChannel[0].fetchMessage(this.events[k].messageId);

      const newEmbed = new RichEmbed(selectedMessage.embeds[0])
        .setDescription(`React with 👌 to enter! \n Time remaining: ${this.getTimeLeft(this.events[k].endTime - currTime)}`);
      selectedMessage.edit(newEmbed);
    }
  }

  getTimeLeft(timeLeft) {
    let returnString = '';
    for(const [k, v] of Object.entries(timeConversions)) {
      let counter = 0;
      while(timeLeft > v) {
        timeLeft -= v;
        counter++;
      }
      if(counter > 0) returnString += `${counter+k} `;
    }
    return returnString;
  }

  async fetchContest() {
    const events = await db.table('events').between(Date.now(), db.maxval, { index: 'endTime' }).run();
    this.events = events;
  }
}
