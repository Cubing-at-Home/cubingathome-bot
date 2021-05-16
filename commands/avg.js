const error = require("../utils/components/error");

const secondsReg = new RegExp(/^([0-5])?([0-9])?\.[0-9]([0-9])?[0-9]?$/);
const minutesReg = new RegExp(/^[0-9][0-9]?\:([0-5])?([0-9])?\.[0-9][0-9]?[0-9]?$/);

function parseTime(time) {
    let parsed;
    if (secondsReg.test(time)) {
        parsed = parseFloat(time) * 100
    } else {
        const colonIndex = time.indexOf(":");
        const periodIndex = time.indexOf(".");
        const minutes = time.slice(0, colonIndex);
        const seconds = time.slice(colonIndex+1, periodIndex);
        const milli = time.slice(periodIndex+1);
        parsed = (60 * 100 * parseInt(minutes)) + (100* parseInt(seconds)) + (milli.length <=2 ? parseInt(milli) : parseInt(milli)/10 );
        //console.log(parsed)
    }
    return parsed;
}

function prettyTime(time) {
    //time is centi
    const minutes = Math.floor(time/(60 * 100));
    const seconds = Math.floor((time-(60*100*minutes))/100);
    let cent = Math.floor((time-((60*100*minutes)+(100*seconds))));
    if (cent < 10) cent = `0${cent}`;
    //console.log(`${minutes}:${seconds}.${cent}`);
    if (minutes>0) {
        return `${minutes}:${seconds}.${cent}`;
    } else {
        return `${seconds}.${cent}`;
    }
    
}
function ao5(arr) {
    let res = [];
    arr.forEach(t=>{res.push(parseTime(t))})
    const sorted = res.sort((a,b)=>a-b);
    return "**ao5: ** " + prettyTime(Math.floor(((sorted[1]+sorted[2]+sorted[3])/3)))
}

function mo3(arr) {
    let sum = 0;
    arr.forEach(time => {
        sum+=parseTime(time);
    })
    return "**mo3: ** "+prettyTime(Math.round(sum/3));
}
function execute(message, args) {
    //(y)y.x(x)(x)
    const timeArray = args.length === 1 
    ? args[0].split(",").map(t => t = t.trim()).filter(t=> secondsReg.test(t) || minutesReg.test(t))
    : (args.length == 3 || args.length == 5) ? args.filter(t => secondsReg.test(t) || minutesReg.test(t)) : null;
    if (timeArray.length!==3 && timeArray.length!==5) {
        error(message, "**avg** currently only supports ao5 and mo3 with valid time inputs of *(mm:(s))s.mm(m)*");
        return;
    }
    if (timeArray.length == 5) {
        message.channel.send(ao5(timeArray))
    } else if (timeArray.length == 3) {
        message.channel.send(mo3(timeArray))
    } else {
        error(message, "Make sure you are using valid times of *mm:ss.mm(m)* or *ss.mm*");
    }
}

module.exports = {
    name: "avg",
    description: "Calculate a05's and mo3's with ease!",
    cooldown: 5,
    execute
}