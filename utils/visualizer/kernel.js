"use strict";

var kernel = (function() {

	var property = (function() {

		var properties = {};//{key: value}

		var defaultProps = {};
        

		/**
		 * {module: {key: [form, type, discribe, values]}}
		 * values:
		 *	0 -- bool -- [default]
		 *	1 -- sel  -- [default, [val1, val2, ...], [str1, str2, ...]]
		 *	2 -- intI -- [default, min, max]
		 *	3 -- color-- [default]
		 */
		var proSets = {};

		/**
		 * {module: [leftDiv, rightDiv]}
		 */

		function getProp(key, set) {
			if (set != undefined && defaultProps[key] == undefined) {
				defaultProps[key] = set;
			}
			if (properties[key] === defaultProps[key]) {
				delete properties[key];
			}
			return (key in properties) ? properties[key] : defaultProps[key];
		}
		function regProp(module, key, type, discribe, values, sessionRelated) {
			if (proSets[module] == undefined) {
				proSets[module] = {};
			}
			proSets[module][key] = [undefined, type, discribe, values, sessionRelated];
			defaultProps[key] = values[0];
			defaultProps['sr_' + key] = (sessionRelated & 2) == 2;
		}

		function getSProps() {
			var ret = {};
			for (var key in properties) {
				if (key.indexOf('sr_') == 0 || !getProp('sr_' + key, false)) {
					continue;
				}
				ret[key] = getProp(key);
			}
			return ret;
		}

		function setSProps(val) {
			for (var key in defaultProps) {
				if (key.indexOf('sr_') == 0 || !getProp('sr_' + key, false)) {
					continue;
				}
				if (key in val) {
					setProp(key, val[key], 'session');
				} else {
					setProp(key, defaultProps[key], 'session');
				}
			}
		}
        regProp('color', 'col-font', 3, 'col-font', ['#000000']);
        regProp('color', 'col-back', 3, 'col-back', ['#eeffcc']);
        regProp('color', 'col-board', 3, 'col-board', ['#ffdddd']);
        regProp('color', 'col-button', 3, 'col-button', ['#ffbbbb']);
        regProp('color', 'col-link', 3, 'col-link', ['#0000ff']);
        regProp('color', 'col-logo', 3, 'col-logo', ['#ffff00']);
        regProp('color', 'col-logoback', 3, 'col-logoback', ['#000000']);
        regProp('color', 'colcube', 4, 'Cube', ['#ff0#fa0#00f#fff#f00#0d0']);
        regProp('color', 'colpyr', 4, 'Pyraminx', ['#0f0#f00#00f#ff0']);
        regProp('color', 'colskb', 4, 'Skewb', ['#fff#00f#f00#ff0#0f0#f80']);
        regProp('color', 'colmgm', 4, 'Megaminx', ['#fff#d00#060#81f#fc0#00b#ffb#8df#f83#7e0#f9f#999']);
        regProp('color', 'colsq1', 4, 'SQ1', ['#ff0#f80#0f0#fff#f00#00f']);
        regProp('color', 'col15p', 4, '15 Puzzle', ['#f99#9f9#99f#fff']);

		return {
			get : getProp,
			set : setProp,
			reg: regProp,
			getSProps: getSProps,
			setSProps: setSProps,
		};
	})();

	var getProp = property.get;
	var setProp = property.set;
	var regProp = property.reg;

	var TwoLvMenu = (function() {
		/**
		 *  data = [[text1, value1], [text2, value2], ...]
		 *  value = 'value' or [[texta, valuea], [textb, valueb]]
		 */
		function TwoLvMenu(data, callback, select1, select2, val) {
			this.data = data;
			this.callback = callback;
			this.select1 = select1;
			this.select2 = select2;
			this.reset(val);
		}
    })

	var scrambleReg = /^([\d]+)?([FRUBLDfrubldzxySME])(?:([w])|&sup([\d]);)?([2'])?$/;
	function parseScramble(scramble, moveMap) {
		var moveseq = [];
		var moves = (getProp('preScr') + ' ' + scramble).split(' ');
		var m, w, f, p;
		for (var s=0; s<moves.length; s++) {
			m = scrambleReg.exec(moves[s]);
			if (m == null) {
				continue;
			}
			f = "FRUBLDfrubldzxySME".indexOf(m[2]);
			if (f > 14) {
				p = "2'".indexOf(m[5] || 'X') + 2;
				f = [0, 4, 5][f % 3];
				moveseq.push([moveMap.indexOf("FRUBLD".charAt(f)), 2, p]);
				moveseq.push([moveMap.indexOf("FRUBLD".charAt(f)), 1, 4-p]);
				continue;
			}
			w = f < 12 ? (~~m[1] || ~~m[4] || ((m[3] == "w" || f > 5) && 2) || 1) : -1;
			p = (f < 12 ? 1 : -1) * ("2'".indexOf(m[5] || 'X') + 2);
			moveseq.push([moveMap.indexOf("FRUBLD".charAt(f % 6)), w, p]);
		}
		return moveseq;
	}
    
    return {
        getProp: getProp,
        parseScramble: parseScramble
    }
})();

module.exports = kernel;