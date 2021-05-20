/*
Meta commands for the bot, including resetting and deleting commands, etc..
For owner only
*/

const { default: axios } = require("axios");

function execute(message, args) {
    message.client.fetchApplication()
        .then(app => {
            if (app.owner.id !== message.author.id) {
                message.channel.send("You are not authorized to run this command!")
                return;
            }
            const commandName = args[0];
            message.client.api.applications(message.client.user.id).guilds(message.guild.id).commands.get()
                .then(commands => {
                    const commandIndex = commands.map(cmd => cmd.name).indexOf(commandName)
                    if (commandIndex != -1) {
                        const commandID = commands[commandIndex].id;
                        const slashURL = `https://discord.com/api/applications/${message.client.user.id}/guilds/${message.guild.id}/commands/${commandID}`
                        axios.delete(slashURL, {
                            headers: {
                                Authorization: `Bot ${message.client.token}`
                            }
                        })
                            .then(res => message.channel.send(`Delete /${commandName}`))
                            .catch(err => message.channel.send("Failed to delete the command!"))
                    } else {
                        message.channel.send("Command not found!")
                    }
                })
                .catch(err => message.channel.send("Failed to get commands!"));
        })
        .catch(err => {
            console.log("Could not fetch application data!")
            message.channel.send("Could not send application data!")
        })
}

module.exports = {
    name: "delete",
    cooldown: 10,
    execute
}