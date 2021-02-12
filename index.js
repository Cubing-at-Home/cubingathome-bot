const fs = require("fs");
const Discord = require("discord.js");
const error = require("./utils/components/error");
require("dotenv").config()

const PREFIX = require("./config.json").prefix;

const client = new Discord.Client();
client.commands = new Discord.Collection();

const TOKEN = process.env.TOKEN;

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
        command.execute(msg, args);
    } catch (err) {
        console.error(err);
        error(msg, "An unknown error occurred, if this persists contact <@493205788098035712>");
    }
});

client.login(TOKEN);