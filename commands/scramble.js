const { MessageAttachment, MessageEmbed } = require("discord.js");
const cahEmbed = require("../utils/components/cahEmbed");

const error = require("../utils/components/error");

const scr = require("../utils/scr");
const viz = require("../utils/viz");
const icons = require("../utils/icons");

function algCubingURL(event, scramble) {
    const BASE_URL = "https://alg.cubing.net/?type=reconstruction";
    return `${BASE_URL}&puzzle=${event}&setup=${scramble.replace(/\s+/g, '')}`;
}

const scrTypes = [
    {imageCode:"333fm", vizCode:"333", scrCode: "fmc",aliases:["333fmc","fm","fmc","3fmc"],algCubingCode:"3x3x3",displayCode:"FMC"},
    {imageCode:"333",  vizCode:"333", scrCode: "333", aliases:["333","3x3","3x3x3","3","33"], algCubingCode:"3x3x3",displayCode:"3x3"},
    {imageCode:"333oh", vizCode:"333",  scrCode: "333", aliases:["333oh","oh","3oh"], algCubingCode:"3x3x3",displayCode:"OH"},
    {imageCode:"222",vizCode:"222so",scrCode:"222",aliases:["2","22","2x2","2x2x2","222"], algCubingCode:"2x2x2",displayCode:"2x2"},
    {imageCode:"444",vizCode:"444",scrCode:"444",aliases:["4","44","444","4x4","4x4x4"], algCubingCode:"4x4x4",displayCode:"4x4"},
    {imageCode:"555",vizCode:"555",scrCode:"555",aliases:["5","55","555","5x5","5x5x5"], algCubingCode:"5x5x5",displayCode:"5x5"},
    {imageCode:"666",vizCode:"666",scrCode:"666",aliases:["6","66","666","6x6","6x6x6"], algCubingCode:"6x6x6",displayCode:"6x6"},
    {imageCode:"777",vizCode:"777",scrCode:"777",aliases:["7","77","777","7x7","7x7x7"], algCubingCode:"7x7x7",displayCode:"7x7"},
    {imageCode:"333bf",vizCode:"333",scrCode:"bld", aliases:['3bld',"3bf","333bf","333bld","33bld","33bf","bld"], algCubingCode:"3x3x3",displayCode:"3x3 BLD"},
    {imageCode:"444bf",vizCode:"444",scrCode:"444", aliases:['"4bld',"4bf","444bf","444bld","44bld","44bf"], algCubingCode:"4x4x4", displayCode:"4x4 BLD"},
    {imageCode:"555bf",vizCode:"555",scrCode:"555", aliases:['"5bld',"5bf","555bf","555bld","55bld","55bf"], algCubingCode:"5x5x5", displayCode: "5x5 BLD"},
    {imageCode: "sq1",vizCode:"sqrs",scrCode:"sq1",aliases:["squan","squareone","square1","sq1","sq"],displayCode:"squareOne"},
    {imageCode:"minx",vizCode:"mgmp",scrCode:"minx",aliases:["minx","mega","megaminx"],displayCode:"Megaminx"},
    {imageCode:"pyram", vizCode:"pyrso", scrCode:"pyram",aliases:["pyraminx","pyram","pyra","p"],displayCode:'Pyraminx'},
    {imageCode: "clock", vizCode:"clkwca",scrCode:"clock",aliases:["clock","c"],displayCode:"Clock"},
    {imageCode:"skewb",vizCode: "skbo",scrCode:"skewb",aliases:["skewb"],displayCode:"Skewb"},
    {imageCode: "fto", scrCode:"fto", aliases:["fto"], displayCode:"FTO"},
    {imageCode: "kilo", scrCode: "kilo", aliases:["kilo","kibi","kilominx","kibiminx"], displayCode:"Kilominx"},
    {imageCode: "333",  vizCode:"333", scrCode: "lsll", aliases:["lsll"],displayCode:"LSLL", algCubingCode:"3x3x3"},
    {imageCode: "333",  vizCode:"333", scrCode: "zbll", aliases:["zbll"],displayCode:"ZBLL", algCubingCode:"3x3x3"},
    {imageCode: "333",  vizCode:"333", scrCode: "cll", aliases:["cll","coll"],displayCode:"COLL", algCubingCode:"3x3x3"},
    {imageCode: "333",  vizCode:"333", scrCode: "edge", aliases:["edge"],displayCode:"Edges", algCubingCode:"3x3x3"},
    {imageCode: "333",  vizCode:"333", scrCode: "corner", aliases:["corner"],displayCode:"Corners", algCubingCode:"3x3x3"},
    {imageCode: "333", vizCode:"333",  scrCode: "eoline", aliases:["eoline"],displayCode:"EOLine", algCubingCode:"3x3x3"},
    {imageCode: "333",  vizCode:"333", scrCode: "f2l", aliases:["f2l","cross"],displayCode:"Cross (hold desired face bottom)", algCubingCode:"3x3x3"},
    {imageCode: "333",  vizCode:"333", scrCode: "ll", aliases:["ll"],displayCode:"LL", algCubingCode:"3x3x3"},
    {imageCode: "333",  vizCode:"333", scrCode: "lse", aliases:["lse"],displayCode:"LSE", algCubingCode:"3x3x3"},
    {imageCode: "333", vizCode:"333",  scrCode: "zbls", aliases:["zbls"],displayCode:"ZBLS", algCubingCode:"3x3x3"},
    {imageCode: "333",  vizCode:"333", scrCode: "zzll", aliases:["zzll"],displayCode:"ZZLL", algCubingCode:"3x3x3"},
    {imageCode: "333",  vizCode:"333", scrCode: "ell", aliases:["ell"],displayCode:"ELL", algCubingCode:"3x3x3"},
    {imageCode: "333",  vizCode:"333", scrCode: "cmll", aliases:["cmll"],displayCode:"CMLL", algCubingCode:"3x3x3"},
    {imageCode: "333",  vizCode:"333", scrCode: "pll", aliases:["pll"],displayCode:"PLL",algCubingCode:"3x3x3"},
    {imageCode: "333mbf",  vizCode:"333", scrCode: "bld", aliases:["mbld","333mbld","3x3mbld","33mbld"], displayCode: "MBLD", algCubingCode:"3x3x3"},
    {imageCode: "mpyram",  vizCode:"pyrso", scrCode: "masterPyra", aliases:["mpyr", "masterPyra", "masterPyraminx"], displayCode: "Master Pyraminx"},
]

function getScrambles(args) {
    //validate args
    
    //check alternate command calling
    if (args.length === 0) {
        throw new Error("Number of scrambles not specified")
    }

    
    const scrQuery = args[0].toLowerCase();
    const scrType = scrTypes.filter(scrType => scrType.aliases.indexOf(scrQuery)!==-1)[0];

    if (!scrType) {
        throw new Error("Invalid scramble type!");
    };

    let scrNum = scrType.imageCode==="333mbf" ? args[1] || 3 : args[1] || 1;

    if (isNaN(scrNum)) {
        throw new Error("Number of scrambles must be an integer!");
    }

    if (scrNum > 5 && scrType.imageCode!="333mbf") scrNum = 5;


    if (!scrType) {
        //handle invalid scramble query
        throw new Error(`Invalid scramble type, **${scrQuery}**`);
    } 

    const scrambleFunc = scr[scrType.scrCode];

    const scrambles = [];
    const rawScrambles = [];
    for (var i=0;i<scrNum;i++) {
        let val = scrambleFunc();
        scrambles.push({name: i+1, value: val});
        rawScrambles.push(val);
    }
    //this is terrible code but you know it works
    if (scrType.algCubingCode) {
        scrambles.forEach(scr => scr.value=`[${scr.value}](${algCubingURL(scrType.algCubingCode, scr.value)})`);
    }

    let response = cahEmbed(`${scrType.displayCode} scrambles`, scrambles);
    const icon = new MessageAttachment(`utils/icons/${icons[scrType.imageCode]}`,`${icons[scrType.imageCode]}`)
    response.attachFiles(icon)
    response.setThumbnail(`attachment://${icons[scrType.imageCode]}`)
    return response;
}

function execute(message, args) {
    try {
        
    const response = getScrambles(args);
    message.channel.send(response)
    //Temporarily remove previews for the sake of universal slash commands
    /* 
    message.channel.send(response)
        .then(sentMsg => {
            if (!scrType.vizCode) return;
            //num per scramble
            //doesn't work for mbld, so let's just ignore it for now
            if (scrType.displayCode=="333mbld") return;

            //only want to allow the emojis that could be chosen
            var numEmojis = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣"].slice(0, rawScrambles.length);
            numEmojis.forEach(emoji => sentMsg.react(emoji));

            //utility function to create scramble image embed
            const ScrambleEmbed = (number, attachment) => {
                var res = new MessageEmbed()
                res.setFooter(`Scramble ${number}`)
                res.attachFiles([{name:"scramble.png", attachment: attachment}])
                res.setImage(`attachment://scramble.png`)
                //res.setColor()
                return res;
            }

            const filter = (r, u) => {return numEmojis.includes(r.emoji.name) && u.id === message.author.id};
            
            const collector = sentMsg.createReactionCollector(filter, { time: 30000 });

            var previousMessage;
            var previousEmoji;
            collector.on("collect", (reaction, user) => {
                //instantly remove react so you can add more after
                reaction.users.remove(user.id);

                //if the new emoji was the same as the previous, don't bother re-rendering scramble
                if (previousEmoji===reaction.emoji.name) return;
                previousEmoji = reaction.emoji.name;
                //get scramble image buffer
                let scrambleImageNumber = numEmojis.indexOf(reaction.emoji.name);
                let scrBuffer = new viz().drawScramble(scrType.vizCode, rawScrambles[scrambleImageNumber]);

                //By saving the previous message, we can delete it and then replace it with a new one since you can't edit the message image attachments
                //this code has so many brackets I'm scared
                if (previousMessage) {
                    previousMessage.delete()
                        .then(_ => {
                            //wait a bit after deleting to send new scramble to avoid flickering on screen
                            setTimeout(() => {
                                message.channel.send(ScrambleEmbed(scrambleImageNumber+1, scrBuffer))
                                .then(msg => {
                                    previousMessage = msg
                                })
                            }, 250)
                        })
                } else  {
                    //no previousMessage to delete so we can continue
                    message.channel.send(ScrambleEmbed(scrambleImageNumber+1, scrBuffer))
                        .then(msg => previousMessage = msg)
                }
            })

            //after the collecting period ends, we delete the last saved scramble image if it exists, as well as the reactions so that the user doesn't think they can still ask 
            collector.on("end", collected => {
                if (previousMessage) previousMessage.delete();
                previousMessage = undefined;
                previousEmoji = undefined;
                sentMsg.reactions.removeAll();
            })
        })
        */
    } catch (err) {
        error(message,err);
    }  
}

const slash = {
    commandData: {
        name: "scramble",
        description: "Generate random scrambles for a variety of WCA and non-WCA events",
        options: [
            {
                name: "event",
                description: "Type of scramble",
                type: 3,
                required: true,
                choices: scrTypes.slice(0,18).map(scr => {return {
                    name: scr.displayCode,
                    value: scr.scrCode
                }})
            },
            {
                name: "amount",
                type: 4,
                description: "Number of scrambles to get, max 5 min 1",
                required: false
            }
        ]
    },
    async slashFunc(interaction) {
        try {
            //console.log(interaction)
            const response = getScrambles(interaction.data.options.map(e => { return e.value }));
            return { embeds: [response] }
        } catch (err) {
            return { content: err.message }
        }
    }
}
//currently, scramble previews won't work for slashes, and refactoring that may be a pain in the yeah
module.exports = {
    name:"scramble",
    aliases: ["scr"],
    scrTypes: scrTypes,
    cooldown: 2.5,
    description: "Generates Rubik's Cube scrambles",
    slash,
    execute
}