const fs = require("fs");
const Discord = require("discord.js");
const error = require("./utils/components/error");

const { getGuildSettings, createGuild, deleteGuild } = require("./db/guilds");
require("dotenv").config()
const TOKEN = process.env.NODE_ENV === 'production' ? process.env.TOKEN : process.env.DEV_TOKEN;
let PREFIX;

const client = new Discord.Client();
client.commands = new Discord.Collection();

const cooldowns = new Discord.Collection();

//load in commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

//on
client.on("ready", () => {
    console.log("Logged in as " + client.user.tag);
    client.user.setActivity(
        "'The Speed Cubers' on Netflix",
        {
            type: "WATCHING"
        }
    ).then(_ => {
        
        client.guilds.cache.forEach(guild => {
            createGuild(guild);
        })
        client.user.setStatus("dnd");
    })
    
})

client.on("guildCreate", guild => {
    console.log("Joined a new guild: " + guild.name);
    createGuild(guild);
})

//removed from a server
client.on("guildDelete", guild => {
    console.log("Left a guild: " + guild.name);
    deleteGuild(guild);
})

client.on("message" , msg => {
    //handle invalid senders
    if (msg.author.bot) return;
    if (msg.guild) {
        //check if prefix could even exist to avoid db querying
        const prefixReg = new RegExp(/([a-zA-z])?[!\$&^|\*\?]$/gm);
        if (!prefixReg.test(msg.content.slice(0,1)) && !prefixReg.test(msg.content.slice(0,2))) return;

        //check if command exists as well before db querying
        const commandNameTestOne = msg.content.slice(1).trim().split(/ +/).shift().toLowerCase();
        const commandNameTestTwo = msg.content.slice(2).trim().split(/ +/).shift().toLowerCase();
        const commandTestOne = client.commands.get(commandNameTestOne)
                    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandNameTestOne));
        const commandTestTwo = client.commands.get(commandNameTestTwo)
                    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandNameTestTwo));

        if (!commandTestOne && !commandTestTwo) return;

        getGuildSettings(msg.guild)
            .then(res => {
                PREFIX = res.prefix;
                console.log(PREFIX);
               if (!msg.content.toLowerCase().startsWith(PREFIX)) return;

                //get args+command
                const args = msg.content.slice(PREFIX.length).trim().split(/ +/);
                const commandName = args.shift().toLowerCase();
        
                const command = client.commands.get(commandName)
                    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        
                if (!command) return;
                //probably unnecessary now because of msg.guild;
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
                    console.log(`${command.name} called by <@${msg.author.id}> in ${msg.guild.name}`);
                    command.execute(msg, args);
                } catch (err) {
                    console.error(err);
                    error(msg, "An unknown error occurred, if this persists contact <@493205788098035712>");
                }
        
            })
            .catch(err=>PREFIX="s!")
        
    } else {
        return;
    }
    
});

//antiSpam.on("spamThresholdWarn", (member) => console.log(`${member.user.tag} has reached the warn threshold.`));

client.login(TOKEN);