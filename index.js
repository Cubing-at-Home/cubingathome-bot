const fs = require("fs");
const Discord = require("discord.js");
//const AntiSpam = require('discord-anti-spam');
const _444 = require("./utils/scr")[444]

const error = require("./utils/components/error");

require("dotenv").config()
const TOKEN = process.env.NODE_ENV === 'production' ? process.env.TOKEN : process.env.DEV_TOKEN;
const PREFIX = process.env.NODE_ENV === 'production' ? require("./config.json").prefix : require("./config.json").devPrefix;

const client = new Discord.Client();
client.commands = new Discord.Collection();

const cooldowns = new Discord.Collection();

// const antiSpam = new AntiSpam(
//     {
//         warnThreshold: 5,
//         exemptPermissions: ["ADMINISTRATOR","MODERATOR"],
//         warnMessage: '{@user}, Please stop spamming, my circuits are sensitive.',
//         ignoreBots: true,
//         removeMessages: true,
//         maxInterval: 500,
//     }
// );

//load in commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

//on
client.on("ready", () => {
    console.log("Logged in as " + client.user.tag);
    //call initial 444 solve because it speeds it up later
    console.log(_444());
    client.user.setActivity(
        PREFIX, {
            type:"LISTENING"
        }
    )
});

client.on("message" , msg => {
    //antiSpam.message(msg);
    //handle invalid senders
    if (!msg.content.startsWith(PREFIX) || msg.author.bot) return;
    
    //get args+command
    const args = msg.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
    if (msg.channel instanceof Discord.DMChannel) return;

    //cooldowns
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection())
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmt = (command.cooldown || 2) * 1000;

    if (timestamps.has(msg.author.id)) {
        const expirationTime = timestamps.get(msg.author.id) + cooldownAmt;
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now)/1000;
            error(msg,`Please wait ${timeLeft.toFixed(1)} more seconds to use ${PREFIX}${command.name}!`)
            return;
        }
    }
    timestamps.set(msg.author.id, now);
    setTimeout(() => timestamps.delete(msg.author.id), cooldownAmt);

    try {
        console.log(`${command.name} called by <@${msg.author.id}>`);
        command.execute(msg, args);
    } catch (err) {
        console.error(err);
        error(msg, "An unknown error occurred, if this persists contact <@493205788098035712>");
    }
});

//antiSpam.on("spamThresholdWarn", (member) => console.log(`${member.user.tag} has reached the warn threshold.`));

client.login(TOKEN);