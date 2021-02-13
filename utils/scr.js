const scrambler133 = require("./scrambling/1x3x3");
const scrambler222 = require("./scrambling/2x2x2");
const scrambler223 = require("./scrambling/2x2x3");
const cross = require("./scrambling/cross");
const megaScrambler = require("./scrambling/megascramble");
const pyra_scrambler = require("./scrambling/pyraminx");
const scramble_333 = require("./scrambling/scramble_333_edit");
const scramble_444 = require("./scrambling/scramble_444");
const sql_scrambler = require("./scrambling/scramble_sq1");
const scramble = require("./scrambling/scramble");
const skewb_scrambler = require("./scrambling/skewb");
const util_scramble = require("./scrambling/utilscramble");
const scramble_222 = require("./scrambling/2x2x2");
const { get3BLDScramble } = require("./scrambling/scramble_333_edit");
//add fto?

function _222() {
    return scramble_222.getRandomScramble();
}

function _333() {
    return scramble_333.getRandomScramble();
}

function _3bld() {
    return scramble_333.get3BLDScramble();
}

function _444() {
    return scramble_444.getRandomScramble();
}

function _555() {
    return megaScrambler.get555WCAScramble(60);
}

function _666() {
    return megaScrambler.get666WCAScramble(80);
}

function _777() {
    return megaScrambler.get777WCAScramble(100);
}

function _megaminx() {
    return util_scramble.getMegaminxWCAScramble(70);
}

function _pyraminx() {
    return pyra_scrambler.getPyraWCAScramble();
}

function _skewb() {
    return skewb_scrambler.getSkewbWCAScramble();
}

function _clock() {
    return util_scramble.getClockWCAScramble();
}

function _squareOne() {
    return sql_scrambler.getRandomScramble();
}

module.exports = {
    333: _333,
    222: _222,
    444: _444,
    555: _555,
    666: _666,
    777: _777,
    bld: _3bld,
    skewb: _skewb,
    clock: _clock,
    sq1: _squareOne,
    pyram: _pyraminx,
    minx: _megaminx
}