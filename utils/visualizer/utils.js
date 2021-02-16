//from lib/utillib.js
const ctxTransform = function(arr) {
    var ret;
    for (var i = 1; i < arguments.length; i++) {
        var trans = arguments[i];
        if (trans.length == 3) {
            trans = [trans[0], 0, trans[1] * trans[0], 0, trans[0], trans[2] * trans[0]];
        }
        ret = [[], []];
        for (var i = 0; i < arr[0].length; i++) {
            ret[0][i] = arr[0][i] * trans[0] + arr[1][i] * trans[1] + trans[2];
            ret[1][i] = arr[0][i] * trans[3] + arr[1][i] * trans[4] + trans[5];
        }
    }
    return ret;
}

const ctxDrawPolygon = function(ctx, color, arr, trans) {
    if (!ctx) {
        return;
    }
    trans = trans || [1, 0, 0, 0, 1, 0];
    arr = ctxTransform(arr, trans);//
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(arr[0][0], arr[1][0]);
    for (var i = 1; i < arr[0].length; i++) {
        ctx.lineTo(arr[0][i], arr[1][i]);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

const ctxRotate = function(arr, theta) {
    //!not sure what transform is referring to... using ctxTrans for now
     return ctxTransform(arr, [Math.cos(theta), -Math.sin(theta), 0, Math.sin(theta), Math.cos(theta), 0]);
 }

module.exports = {
    ctxDrawPolygon: ctxDrawPolygon,
    ctxTransform: ctxTransform,
    ctxRotate: ctxRotate
}
