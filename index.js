const fs = require("fs");
const Discord = require("discord.js");
const AntiSpam = require('discord-anti-spam');

const error = require("./utils/components/error");

require("dotenv").config()
const TOKEN = process.env.TOKEN;
const PREFIX = require("./config.json").prefix;

const client = new Discord.Client();
client.commands = new Discord.Collection();

const antiSpam = new AntiSpam(
    {
        warnThreshold: 5,
        muteThreshold: 10,
        exemptPermissions: ["ADMINISTRATOR","MODERATOR"],
        warnMessage: '{@user}, Please stop spamming, my circuits are sensitive.',
        muteMessage: '{@user}, I told you to stop spamming, now you\'re in timeout',
        ignoreBots: true,
        removeMessages: true,
        maxInterval: 500,
        muteRoleName: "muted"
    }
);

//load in commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on("ready", () => {
    console.log("Logged in as " + client.user.tag)
    client.user.setActivity(
        PREFIX, {
            type:"LISTENING",
            url: "https://github.com/louismeunier"
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
    try {
        console.log(`${command.name} called by <@${msg.author.id}>`);
        command.execute(msg, args);
    } catch (err) {
        console.error(err);
        error(msg, "An unknown error occurred, if this persists contact <@493205788098035712>");
    }
});

//antiSpam.on("muteAdd", (member) => console.log(`${member.user.tag} has been muted.`));
//antiSpam.on("spamThresholdWarn", (member) => console.log(`${member.user.tag} has reached the warn threshold.`));

client.login(TOKEN);