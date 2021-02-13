const cahEmbed = require("../utils/components/cahEmbed")

module.exports = {
	name: 'server', 
	description: 'Server stats',
        cooldown:5,
	execute(message, args) {
        //add roles
        const Embed = cahEmbed("Server Stats", [
                {name:"Member Count",value:message.guild.memberCount,inline:true}
        ]);

        //console.log(message.guild.members);
        message.channel.send(Embed)
	},
};