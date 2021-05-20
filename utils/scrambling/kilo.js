//A simplification of ....
/* kilosolver.js - A kilominx solver
version 0.7 (2021-04-03)
Copyright (c) 2016, 2020, 2021

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

This is a port of the kilominx solver originally written in Python with a few minor optimisations.

How to run this:
(0) Save this file somewhere.
(1) Install any JavaScript shell and run it with this file.
(2) Type stuff into the shell.

(or just use the HTML interface! it exists now!)

There is currently not much of a public interface. Useful stuff:
cache_all_tables()
    to generate all the lookup tables
print_move_sequence(generate_random_state_scramble())
    to get a random-state scramble
print_move_sequence(generate_hybrid_scramble())
    to get a hybrid random-move scramble

For the full solver (used in the random-state scrambler), a few hundred megabytes of RAM may be used
for the lookup tables, which will also take roughly a minute to generate. Once generated, each solve
takes roughly 0.08 second.

The hybrid scrambler uses much smaller lookup tables that take less memory and are generated faster,
but produces somewhat longer scramble sequences and isn't fully random-state. It should nevertheless
be good enough for non-competition purposes.

On the to-do list:
- optimise the heck out of the lookup table generation
- a GUI for the solver
- optimise the solver with colour neutrality and NISS(tm) techniques
- throw all the global variables into a namespace

Compatibility notes:
This code makes fairly heavy use of ES6 syntactic sugar because writing code in JavaScript's already
an exercise in masochism and I'm not going to make my life harder by restricting myself to ES5. Some
of the features used are:
- let, const
- destructuring assignment
- for-of
- arrow functions
- 'use strict'

Any web browser from 2016 or later should support all of these; the code has been tested only on the
latest versions of Firefox and Chrome, as well as a somewhat outdated SpiderMonkey shell, but should
also work with recent versions of Edge, Safari, etc.
*/

'use strict';

//let PHASE4_THRESHOLD = 7;
// change this to 8 to make the individual solves faster, at the cost of slower initialisation

function counter(A)
{
	let counts = [];
	for (let a of A) counts[a] = (counts[a] || 0) + 1;
	return counts;
}

/* Combinatoric functions */

function factorial(n)
{
	if (n < 2) return n;
	let f = 1;
	for (let i = 2; i <= n; i++) f *= i;
	return f;
}

function C(n, k)
{
	if (k < 0 || k > n) return 0;
	if (k === 0 || k === n) return 1;
	let c = 1;
	for (let i = 0; i < k; i++)
	{
		c = (c * (n-i) / (i+1)) | 0;
	}
	return c;
}

function permutation_to_index(perm)
{
	perm = perm.slice();
	let n = perm.length;
	let f = factorial(n-1);
	let ind = 0;
	while (n > 1)
	{
		n--;
		// invariant: f == factorial(n)
		// also, perm stores meaningful values up to perm[n]
		let e = perm[0];
		ind += e * f;
		for (let i = 0; i < n; i++)
		{
			let x = perm[i+1];
			perm[i] = x - (x > e);
		}
		f /= n;
	}
	return ind;
}

function index_to_permutation(ind, n)
{
	let perm = [];
	let f = factorial(n-1);
	for (let i = 0; i < n; i++)
	{
		perm[i] = (ind / f) | 0;
		ind %= f;
		f /= n-1-i;
	}
	for (let i = n-2; i >= 0; i--)
	{
		for (let j = i+1; j < n; j++)
		{
			perm[j] += +(perm[j] >= perm[i]);
		}
	}
	return perm;
}

function permutation_parity(A)
{
	let n = A.length;
	let parity = 0;
	for (let i = 0; i < n-1; i++)
	{
		for (let j = i; j < n; j++)
		{
			if (A[i] > A[j]) parity ^= 1;
		}
	}
	return parity;	
}

function index_to_evenpermutation(ind, n)
{
	let perm = [];
	let f = factorial(n-1) / 2;
	let parity = 0;
	for (let i = 0; i < n-1; i++)
	{
		perm[i] = (ind / f) | 0;
		ind %= f;
		f /= n-1-i;
	}
	perm[n-1] = 0;
	for (let i = n-2; i >= 0; i--)
	{
		for (let j = i+1; j < n; j++)
		{
			if (perm[j] >= perm[i]) perm[j]++;
			else parity ^= 1;
		}
	}
	if (parity === 1) [perm[n-2], perm[n-1]] = [perm[n-1], perm[n-2]];
	return perm;
}

function evenpermutation_to_index(perm)
{
	return permutation_to_index(perm) >> 1;
}

let [evenpermutation10_to_index, index_to_evenpermutation10] = (() => {

let index_in_set_bits = new Int8Array(1024 * 10);
let look_up_set_bits = new Int8Array(1024 * 10);
for (let i = 0; i < 1024; i++)
{
	for (let j = 0, counter = 0; j < 10; j++)
	{
		if (((i >>> j) & 1) === 0) {continue;}
		index_in_set_bits[(j << 10) | i] = counter;
		look_up_set_bits[(counter << 10) | i] = j;
		counter++;
	}
}

function evenpermutation10_to_index(perm)
{
	let unused = 0x3ff; // track which values in 0..9 haven't been used so far
	let f = 181440; // = 9!/2
	let ind = 0;
	for (let i = 0; i < 8; i++)
	{
		let v = perm[i];
		ind += index_in_set_bits[unused | (v << 10)] * f;
		unused &= ~(1 << v);
		f /= 9-i;
	}
	return ind;
}

// note: this is *not* a drop-in replacement for index_to_evenpermutation!
function index_to_evenpermutation10(ind, perm)
{
	let unused = 0x3ff;
	let f = 181440; // = 9!/2
	let parity = 0;
	for (let i = 0; i < 8; i++)
	{
		let a = (ind / f) | 0;
		ind -= a * f;
		parity ^= (a & 1);
		let v = look_up_set_bits[unused | (a << 10)];
		perm[i] = v;
		unused &= ~(1 << v);
		f /= 9-i;
	}
	// the last two elements are uniquely determined by the other ten
	perm[8] = look_up_set_bits[unused | (parity << 10)];
	perm[9] = look_up_set_bits[unused | ((parity^1) << 10)];
	return perm;
}

return [evenpermutation10_to_index, index_to_evenpermutation10];

})();

function comb_to_index(l)
{
	let bits = l.length;
	let ones = 0;
	for (let i = 0; i < bits; i++) ones += +(l[i] === 1);
	let zeros = bits - ones;
	if (zeros === 0 || ones === 0 || bits === 1) return 0;
	let b = C(bits-1, ones);
	let ind = 0;
	for (let i = 0; zeros > 0 && ones > 0 && bits > 1; i++)
	{
		bits--;
		if (l[i] === 0)
		{
			b = b * --zeros / bits;
		}
		else // l[i] === 1
		{
			ind += b;
			b = b * ones-- / bits;
		}
	}
	return ind;
}

function index_to_comb(ind, ones, bits)
{
	let zeros = bits - ones;
	let b = C(bits-1 , ones);
	let l = [];
	let n = bits-1;
	for (let i = 0; i < n; i++)
	{
		bits--;
		if (ind < b)
		{
			l.push(0);
			b = b * --zeros / bits;
		}
		else
		{
			l.push(1);
			ind -= b;
			b = b * ones-- / bits;
		}
	}
	l.push(ones);
	return l;
}

function compose(A, B)
{
	let C = [];
	for (let i = 0; i < B.length; i++) C[i] = A[B[i]];
	return C;
}

function compose_o(A, B)
{
	// note: we hardcode the modulus to 3 here, because ~optimisations~
	// (unnecessary abstraction is bad, actually)
	let p = compose(A[0], B[0]);
	let o = [];
	let n = B[0].length;
	for (let i = 0; i < n; i++)
	{
		o[i] = (A[1][B[0][i]] + B[1][i]) % 3;
	}
	return [p, o];
}

function permutation_from_cycle(cycle, n)
{
	let perm = [];
	for (let i = 0; i < n; i++) perm[i] = i;
	for (let i = 0; i < cycle.length; i++)
	{
		perm[cycle[i]] = cycle[(i + 1) % cycle.length];
	}
	return perm;
}

function unsparsify_list(d, n)
{
	let l = Array(n).fill(0);
	for (let k in d) l[k] = d[k];
	return l;
}

/* The basic moves */

let move_U = [permutation_from_cycle([0, 1, 2, 3, 4], 20), unsparsify_list({}, 20)];
let move_R = [permutation_from_cycle([4, 3, 11, 12, 13], 20), unsparsify_list({4: 2, 3: 1, 11: 1, 12: 1, 13: 1}, 20)];
let move_F = [permutation_from_cycle([3, 2, 9, 10, 11], 20), unsparsify_list({3: 2, 2: 1, 9: 1, 10: 1, 11: 1}, 20)];
let move_L = [permutation_from_cycle([2, 1, 7, 8, 9], 20), unsparsify_list({2: 2, 1: 1, 7: 1, 8: 1, 9: 1}, 20)];
let move_BL = [permutation_from_cycle([1, 0, 5, 6, 7], 20), unsparsify_list({1: 2, 0: 1, 5: 1, 6: 1, 7: 1}, 20)];
let move_BR = [permutation_from_cycle([0, 4, 13, 14, 5], 20), unsparsify_list({0: 2, 4: 1, 13: 1, 14: 1, 5: 1}, 20)];
let move_x2 = [[15, 16, 17, 18, 19, 10, 9, 8, 7, 6, 5, 14, 13, 12, 11, 0, 1, 2, 3, 4], unsparsify_list({}, 20)];
let move_y = [[1, 2, 3, 4, 0, 7, 8, 9, 10, 11, 12, 13, 14, 5, 6, 19, 15, 16, 17, 18], unsparsify_list({}, 20)];
let move_rot = [[9, 10, 11, 3, 2, 8, 16, 15, 19, 12, 13, 4, 0, 1, 7, 14, 18, 17, 6, 5], [2, 0, 1, 2, 1, 2, 2, 0, 1, 1, 1, 1, 0, 2, 2, 1, 2, 1, 2, 0]];

let moves = [move_U, move_R, move_F, move_L, move_BL, move_BR, move_x2];
let move_names = ['U', 'R', 'F', 'L', 'BL', 'BR', 'flip'];

let id = compose_o(move_x2, move_x2);

let moves_full = [];
for (let i = 0; i < moves.length; i++)
{
	moves_full[i] = [id];
	for (let j = 1; j < 5; j++) moves_full[i][j] = compose_o(moves_full[i][j-1], moves[i]);
}

function random_state()
{
	let p = [0];
	for (let i = 1; i < 20; i++)
	{
		let r = Math.floor(Math.random() * (i+1));
		p[i] = p[r];
		p[r] = i;
	}
	if (permutation_parity(p) === 1) [p[0], p[1]] = [p[1], p[0]];
	let o = Array(20).fill(0);
	for (let i = 0; i < 19; i++)
	{
		o[i] = Math.floor(Math.random() * 3);
		o[19] += 3-o[i];
	}
	o[19] %= 3;
	return [p, o];
}

/* Human interface stuff */

function stringify_move_sequence(move_sequence)
{
	let suffixes = ["0", "", "2", "2'", "'"];
	let s = move_sequence.map(([m, r]) => (move_names[m] + suffixes[r]));
	return s.join(' ');
}

function apply_move_sequence(state, move_sequence)
{
	for (let [m, r] of move_sequence)
	{
		for (let i = 0; i < r; i++) state = compose_o(state, moves[m]);
	}
	return state;
}

function generate_random_move_scramble(M, N)
{
	M = M || 6;
	N = N || 6;
	// total number of moves = (M+1)(N+1)-1
	let move_sequence = [];
	for (let i = 0; i <= M; i++)
	{
		let last = -1, lastlast = -1;
		for (let j = 0; j < N; j++)
		{
			let m;
			while (true)
			{
				m = Math.floor(Math.random()*6);
				// don't output stuff like U2 U
				if (m === last) continue;
				// U move never commutes with the others
				else if (m === 0) break;
				// don't output stuff like L R L because L and R commute
				else if (m === lastlast && (m-last)*(m-last)%5 === 4) continue;
				else break;
			}
			// make 144-deg moves twice as likely as 72-deg moves
			move_sequence.push([m, 1+Math.round(Math.random()*3)]);
			[last, lastlast] = [m, last];
		}
		// flip after every set of moves on the hemisphere except the last because that would be
		// kind of pointless
		if (i < M) move_sequence.push([6, 1]);
	}
	return move_sequence;
}

let tables = {};

function bfs(mtable, goal_states)
{
	let N = mtable.length;
	let nmoves = mtable[0].length;
	let ptable = Array(N).fill(-1);
	for (let state of goal_states) {ptable[state] = 0;}
	let depth = 0;
	let done = false;
	while (!done)
	{
		done = true;
		for (let state = 0; state < N; state++)
		{
			if (ptable[state] !== depth) {continue;}
			for (let move_index = 0; move_index < nmoves; move_index++)
			{
				let new_state = mtable[state][move_index];
				while (new_state !== state)
				{
					if (ptable[new_state] === -1)
					{
						done = false;
						ptable[new_state] = depth + 1;
					}
					new_state = mtable[new_state][move_index];
				}
			}
		}
		depth++;
	}
	return ptable;
}

function ida_solve(indices, mtables, ptables)
{
	let ncoords = indices.length;
	let bound = 0;
	for (let i = 0; i < ncoords; i++) bound = Math.max(bound, ptables[i][indices[i]]);
	while (true)
	{
		let path = ida_search(indices, mtables, ptables, bound, -1);
		if (path !== undefined) return path;
		bound++;
	}
}

function ida_search(indices, mtables, ptables, bound, last)
{
	let ncoords = indices.length;
	let nmoves = mtables[0][0].length;
	let heuristic = 0;
	for (let i = 0; i < ncoords; i++) heuristic = Math.max(heuristic, ptables[i][indices[i]]);
	if (heuristic > bound) return;
	if (bound === 0 || heuristic === 0) return [];
	for (let m = 0; m < nmoves; m++)
	{
		if (m === last) continue;
		let new_indices = indices.slice();
		for (let c = 0; c < ncoords; c++) new_indices[c] = mtables[c][indices[c]][m];
		let r = 1;
		while (indices.some((_, i) => indices[i] != new_indices[i]))
		{
			let subpath = ida_search(new_indices, mtables, ptables, bound-1, m);
			if (subpath !== undefined) return [[m, r]].concat(subpath);
			for (let c = 0; c < ncoords; c++)
			{
				new_indices[c] = mtables[c][new_indices[c]][m];
			}
			r++;
		}
	}
	return;
}
/* Additional solving logic for the hybrid scrambler

Rather than being a purely random-move or random-state scramble (the former isn't random enough, but
the latter is too slow), we fully randomise the locations of the white pieces and of the grey pieces
then apply a bunch of random moves afterwards.

This is in the sense that the C(20,10,5,5) = 46558512 possible combinations of where the white, grey
and E-slice pieces are (without distinguishing between the white pieces, etc.) are equally likely.

Corner orientation is effectively randomised by doing at least 8 random moves on each hemisphere, so
for all intents and purposes, this should be as good as a random-state scramble.
*/

function generate_hs_mtable()
{
	if (tables.hsm) return tables.hsm;
	const C20_5 = C(20, 5); // = 15504
	let mtable = Array(C20_5);
	for (let i = 0; i < C20_5; i++)
	{
		mtable[i] = Array(7);
		let comb = index_to_comb(i, 5, 20);
		for (let m = 0; m < 7; m++)
		{
			let new_comb = compose(comb, moves[m][0]);
			mtable[i][m] = comb_to_index(new_comb);
		}
	}
	return tables.hsm = mtable;
}

function generate_hs_u_ptable()
{
	if (tables.hsup) return tables.hsup;
	let mtable = generate_hs_mtable();
	return tables.hsup = bfs(mtable, [15503]);
}

function generate_hs_d_ptable()
{
	if (tables.hsdp) return tables.hsdp;
	let mtable = generate_hs_mtable();
	return tables.hsdp = bfs(mtable, [0]);
}

function index_hs(state)
{
	let p = state[0];
	return [comb_to_index(p.map(x => +(x < 5))), comb_to_index(p.map(x => +(x >= 15)))];
}

// this gives sequences ~2 moves longer on average, but is way faster
function solve_hs_twophase(state)
{
	let mtable = generate_hs_mtable();
	let u_ptable = generate_hs_u_ptable();
	let d_ptable = generate_hs_d_ptable();
	let indices = index_hs(state);
	let sol1;
	/*
	if (u_ptable[indices[0]] < d_ptable[indices[1]]) sol1 = ida_solve([indices[0]], [mtable], [u_ptable]);
	else sol1 = ida_solve([indices[1]], [mtable], [d_ptable]);
	// don't do this because it'd give solutions starting with flip pretty often.
	*/
	sol1 = ida_solve([indices[1]], [mtable], [d_ptable]);
	let s1 = apply_move_sequence(state, sol1);
	let sol2 = ida_solve(index_hs(s1), [mtable, mtable], [u_ptable, d_ptable]);
	return sol1.concat(sol2);
}

function generate_hybrid_scramble()
{
	let move_sequence = [];
	let sort_seq = solve_hs_twophase(random_state());
	for (let [m, r] of sort_seq)
	{
		let period = m === 6 ? 2 : 5;
		move_sequence.unshift([m, (period - r) % period]);
	}

	// TODO: remove possible move cancellations between the random-state and random-move phases
	return move_sequence.concat(generate_random_move_scramble(2, 9));
}

module.exports = function generateKilo(){return stringify_move_sequence(generate_hybrid_scramble())}