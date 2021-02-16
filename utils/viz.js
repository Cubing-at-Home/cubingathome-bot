const ScrambleImage = require("./visualizer/image");
//scramble has to be space separated

//Have to make it a class for some reason, otherwise the scrambles end up overlapping in a beautiful mess
class ScrambleImageClass {
    drawScramble(type, scramble) {
        return ScrambleImage().draw(type,scramble)
    }
}
module.exports = ScrambleImageClass;
