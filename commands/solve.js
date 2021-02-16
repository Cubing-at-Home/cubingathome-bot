const error = require("../utils/components/error");
const min2phase = require("../utils/min2phase");
const Embed = require("../utils/components/cahEmbed");

function execute(message, args) {
    //modified from cs0x7f
    //without initialization:
    var properScramble = typeof args == Array ? args.join(" "):args;

    var cube = min2phase.fromScramble(properScramble); // or some other valid state

    min2phase.solve(cube); // the first solve will spend about 200ms
    min2phase.solve(cube); // the next 25 solves will spend about 10ms to 50ms on average
    min2phase.solve(cube); // after 26 solves, initialization is finished. Each solve will spend about 5ms on average

    //initialization and solve
    min2phase.initFull(); // initialization will spend about 350ms, and about 150ms if partially initialized by the first solve.
    const solution = min2phase.solve(cube); // about 2.3ms on average, all solutions are no more than 21 moves.

    const solutionLink = `https://alg.cubing.net/?type=reconstruction&setup=${properScramble.replace(/\s+/g, '_')}&alg=${solution.replace(/\s+/g, '_')}`;
    console.log(solution.replace(/\s+/g, '_').match(/_/g).length);
    let embed = Embed(`Solution to **${properScramble}**`, 
        [
            {name:"Solution", value: `[${solution}](${solutionLink})`}, 
            {name:"Moves", value: `${solution.replace(/\s+/g, '_').match(/_/g).length} HTM`}
        ]
    )
    message.channel.send(embed);
    
}


module.exports = {
    name: "solve",
    description: "Solve Rubik's cubes near optimally",
    cooldown: 5,
    execute
}