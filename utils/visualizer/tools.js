function puzzleType(scrambleType) {
    if (/^222(so|[236o]|eg[012]?|nb)$/.exec(scrambleType)) {
        return "222";
    } else if (/^(333(oh?|ni|f[mt])?|(z[zb]|[coep]|cm|2g|ls)?ll|lse(mu)?|2genl?|3gen_[LF]|edges|corners|f2l|lsll2|zbls|roux|RrU|half|easyc|eoline)$/.exec(scrambleType)) {
        return "333";
    } else if (/^(444([mo]|wca|yj|bld)?|4edge|RrUu)$/.exec(scrambleType)) {
        return "444";
    } else if (/^(555(wca|bld)?|5edge)$/.exec(scrambleType)) {
        return "555";
    } else if (/^(666(si|[sp]|wca)?|6edge)$/.exec(scrambleType)) {
        return "666";
    } else if (/^(777(si|[sp]|wca)?|7edge)$/.exec(scrambleType)) {
        return "777";
    } else if (/^888$/.exec(scrambleType)) {
        return "888";
    } else if (/^999$/.exec(scrambleType)) {
        return "999";
    } else if (/^101010$/.exec(scrambleType)) {
        return "101010";
    } else if (/^111111$/.exec(scrambleType)) {
        return "111111";
    } else if (/^cubennn$/.exec(scrambleType)) {
        return "cubennn";
    } else if (/^pyr(s?[om]|l4e|nb|4c)$/.exec(scrambleType)) {
        return "pyr";
    } else if (/^skb(s?o|nb)?$/.exec(scrambleType)) {
        return "skb";
    } else if (/^sq(rs|1[ht]|rcsp)$/.exec(scrambleType)) {
        return "sq1";
    } else if (/^clk(wca|o)$/.exec(scrambleType)) {
        return "clk";
    } else if (/^mgmp$/.exec(scrambleType)) {
        return "mgm";
    } else if (/^15p(at|ra?p?)?$/.exec(scrambleType)) {
        return "15p";
    } else if (/^15p(rmp|m)$/.exec(scrambleType)) {
        return "15b";
    } else if (/^8p(at|ra?p?)?$/.exec(scrambleType)) {
        return "8p";
    } else if (/^8p(rmp|m)$/.exec(scrambleType)) {
        return "8b";
    }
}

module.exports = {
    puzzleType: puzzleType
}