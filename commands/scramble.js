const { MessageAttachment } = require("discord.js");
const cahEmbed = require("../utils/components/cahEmbed");
const error = require("../utils/components/error");

const scr = require("../utils/scr");

const icons = require("../utils/icons");

function algCubingURL(event, scramble) {
    const BASE_URL = "https://alg.cubing.net/?type=reconstruction";
    return `${BASE_URL}&puzzle=${event}&setup=${scramble.replace(/\s+/g, '')}`;
}

function execute(message, args) {
    //validate args
    const scrTypes = [
        ["333","3x3","3x3x3","3","33","oh",'333oh',"3oh","fm","fmc"],
        ["222","2x2","2x2x2","2","22"],
        ["444","4x4", "4x4x4","4","44","4bld","4bf","444bld","444bf","44bld","44bf"],
        ["777","7x7","7x7x7","7","77"],
        ["666","6x6","6x6x6","6","66"],
        ["555","5x5","5x5x5","5","55","5bld","5bf","555bld","55bf","55bld"],
        ["sq1","squan", "squareone","square1"],
        ["minx","mega","megaminx"],
        ["pyram", "pyra","pyraminx"],
        ["clock","clk","clok"],
        ["skewb","sk","skb","trashevent"],
        ["bld","3bld","3bf","bf"]
    ]

    if (args.length === 0) {
        error(message, "Missing arguments!")
        return;
    }

    const scrQuery = args[0].toLowerCase();
    let scrNum = args[1] || 1;

    if (isNaN(scrNum)) {
        error(message, "Number of scrambles must be an integer!");
        return;
    }

    if (scrNum>5) scrNum = 5;

    const scrType = scrTypes.filter(scrType => scrType.indexOf(scrQuery)!==-1);

    if (scrType.length === 0) {
        //handle invalid scramble query
        error(message, `Invalid scramble type, **${scrQuery}**`);
        return;
    } 

    const scrambleFunc = scr[scrType[0][0]];

    const scrambles = [];
    for (var i=0;i<scrNum;i++) {
        scrambles.push({name: i+1, value: scrambleFunc()});
    }
    //this is terrible code but you know it works
    if (["333","222","444","3bld",'555',"666","777"].indexOf(scrType[0][0])!==-1) {
        scrambles.forEach(scr => scr.value=`[${scr.value}](${algCubingURL(scrType[0][2],scr.value)})`);
    }
    let response = cahEmbed(`${scrQuery} Scrambles`, scrambles);
    //const icon = new MessageAttachment(`utils/icons/${icons[scrType[0][0]]}`,`${icons[scrType[0][0]] }`)
    //response.setAuthor("yes",icon.attachment)
    message.channel.send(response);
}


module.exports = {
    name:"scramble",
    aliases: ["scr"],
    description: "Generates Rubik's Cube scrambles",
    execute
}