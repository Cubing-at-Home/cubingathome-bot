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
        {imageCode:"333fm", scrCode: "333",aliases:["333fmc","fm","fmc","3fmc"],algCubingCode:"3x3",displayCode:"FMC"},
        {imageCode:"333", scrCode: "333", aliases:["333","3x3","3x3x3","3","33"], algCubingCode:"3x3",displayCode:"3x3"},
        {imageCode:"333oh", scrCode: "333", aliases:["333oh","oh","3oh"], algCubingCode:"3x3",displayCode:"OH"},
        {imageCode:"222",scrCode:"222",aliases:["2","22","2x2","2x2x2","222"], algCubingCode:"2x2",displayCode:"2x2"},
        {imageCode:"444",scrCode:"444",aliases:["4","44","444","4x4","4x4x4"], algCubingCode:"4x4",displayCode:"4x4"},
        {imageCode:"555",scrCode:"555",aliases:["5","55","555","5x5","5x5x5"], algCubingCode:"5x5",displayCode:"5x5"},
        {imageCode:"666",scrCode:"666",aliases:["6","66","666","6x6","6x6x6"], algCubingCode:"6x6",displayCode:"6x6"},
        {imageCode:"777",scrCode:"777",aliases:["7","77","777","7x7","7x7x7"], algCubingCode:"7x7",displayCode:"7x7"},
        {imageCode:"333bf",scrCode:"333", aliases:['"3bld',"3bf","333bf","333bld","33bld","33bf"], algCubingCode:"3x3",displayCode:"3x3 BLD"},
        {imageCode:"444bf",scrCode:"444", aliases:['"4bld',"4bf","444bf","444bld","44bld","44bf"], algCubingCode:"4x4", displayCode:"4x4 BLD"},
        {imageCode:"555bf",scrCode:"555", aliases:['"5bld',"5bf","555bf","555bld","55bld","55bf"], algCubingCode:"5x5", displayCode: "5x5 BLD"},
        {imageCode: "sq1",scrCode:"sq1",aliases:["squan","squareone","square1","sq1"],displayCode:"squareOne"},
        {imageCode:"minx",scrCode:"minx",aliases:["minx","mega","megaminx"],displayCode:"Megaminx"},
        {imageCode:"pyram",scrCode:"pyram",aliases:["pyraminx","pyram","pyra"],displayCode:'Pyraminx'},
        {imageCode: "clock",scrCode:"clock",aliases:["clock"],displayCode:"Clock"},
        {imageCode:"skewb",scrCode:"skewb",aliases:["skewb"],displayCode:"Skewb"}
    ]
    //check alternate command calling
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

    const scrType = scrTypes.filter(scrType => scrType.aliases.indexOf(scrQuery)!==-1)[0];

    if (!scrType) {
        //handle invalid scramble query
        error(message, `Invalid scramble type, **${scrQuery}**`);
        return;
    } 

    const scrambleFunc = scr[scrType.scrCode];

    const scrambles = [];
    for (var i=0;i<scrNum;i++) {
        scrambles.push({name: i+1, value: scrambleFunc()});
    }
    //this is terrible code but you know it works
    if (scrType.algCubingCode) {
        scrambles.forEach(scr => scr.value=`[${scr.value}](${algCubingURL(scrType.algCubingCode, scr.value)})`);
    }

    let response = cahEmbed(`${scrType.displayCode} scrambles`, scrambles);
    const icon = new MessageAttachment(`utils/icons/${icons[scrType.imageCode]}`,`${icons[scrType.imageCode]}`)
    response.attachFiles(icon)
    response.setThumbnail(`attachment://${icons[scrType.imageCode]}`)
    message.channel.send(response);
}


module.exports = {
    name:"scramble",
    aliases: ["scr"],
    cooldown: 2.5,
    description: "Generates Rubik's Cube scrambles",
    execute
}