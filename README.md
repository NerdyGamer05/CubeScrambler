# 🧩 Cube Scrambler
Unofficial scrambler for WCA puzzles cubes using Vanilla JS

[![npm version](https://badge.fury.io/js/cube-scramble.js.svg)](https://www.npmjs.com/package/cube-scramble.js)

# Examples
2x2 - `U' R B U B U B2 R' D R' F L` <br />
3x3 - `F2 R B' D2 R' L' F' B2 D2 L B2 F' R F' D R F2 D2 L' U' R B2 D2 R L'` <br />
4x4 - `Lw Rw2 Dw L2 R' D' L' B L D' R B' Lw Bw2 U R Lw B2 Uw B2 Lw F D Bw R2 Dw Lw D2 U' L Fw' Bw D' Fw' Uw B' Rw' F2 U2 R'` <br />
5x5 - `F2 Uw' Bw' Lw' Uw2 L2 R Dw F Dw' U F2 Uw B' U2 Rw2 L D2 B D' R Dw' U' Lw Fw2 D2 Lw' F Rw' Uw' Fw U2 Lw F2 U' F L' U' B D' R Bw2 D Lw2 Uw' F' Dw2 F2 D' Rw' Bw2 F2 Uw' R2 Fw L B2 Uw2 Rw2 F` <br />
6x6 - `3Lw2' B2 F' 3Uw' D2 3Bw2' Dw' Uw Fw' L2 3Dw2 3Bw U2 3Bw2 Dw' R' U' R 3Lw2 Dw B U2 3Lw Bw2' 3Rw F L2 U' F L' F2 3Uw2' 3Lw2' Dw Fw2' B L' Bw2 U2 Bw2' L Bw 3Lw2 B2 Uw' L B2 3Uw' 3Bw2' 3Rw 3Fw 3Rw2 3Lw Fw2 3Uw' 3Lw2' F2 B' 3Dw 3Rw B' F' U' 3Rw' F' 3Bw2' L2 3Dw2' Rw 3Lw2' D2 F' R' 3Lw 3Dw 3Fw2 Uw' Rw2 Uw2' F' U' R Dw' B2 3Uw2` <br />
7x7 - `L' F 3Rw2 3Fw' U F2 D' F' Rw2' 3Lw 3Fw' 3Lw2 3Uw2' 3Rw' L2 Fw 3Uw2' B' Lw 3Rw2 3Fw' Rw 3Bw2 3Rw2 Lw 3Fw2' Uw 3Fw2 D Bw2 L U' F D R2 Dw2 Fw2' 3Bw2 U' Rw2 3Uw2' Lw Uw 3Dw2 F2 Uw2 Dw2' F' 3Bw2' 3Rw' Uw' Bw2 L' 3Uw2' D' Lw2 F2 U2 R' Bw2' R' 3Lw2' Fw' L' 3Uw2' Bw' Lw2' Fw2 3Dw F U2 Dw' L D' 3Lw2 Uw B' Rw2 Bw2' 3Rw D2 Uw' 3Rw2' Dw 3Lw2 D Bw2' Lw R2 Bw2' 3Fw2' Rw' Dw2 Bw2 D2` <br />
Pyraminx - `r2 R2 l' B2 R u' B R' U' B' L R2 B L' B' b L2 B2 U R2 L' U' L' R2` <br />
Megaminx - `D-- R++ D++ R++ U D-- R-- D-- R-- U' R-- U D-- R++ U' D-- R++ D-- U' R-- D-- U' R++ D-- U R-- D++ R++ U' D-- R-- U D++ R-- U' D-- R-- U R++ D-- R-- U D++ R++ D++ U R-- U' R-- U D++ R-- U' D++ R++ D-- U' R++ U D++ R-- D++ R-- D++ R++ D-- U R-- D++ U` <br />
Skewb - `L' R' U B' L R' U' L' B R' B R L R B' R' U' R L U R' B L B' L'` <br />
Magic Clock - `UR1+ DR1+ DL2- UL4+ U5+ R2+ D5- L5- ALL1- y2 U5+ R0+ D3- L1- ALL1- DR DL` <br />

## 🎲 Algorithm
The reasoning behind the algorithm is pretty straightforward. For the sake of the explanation, let's say we have an NxN cube. A move is selected randomly from a list of possible moves (`U`,`D`,`L`,`R`,`F`,`B`). The random move is then added to the scramble unless **(1)** the random move is same as the last move in the sequence (e.g. `F` is the "same" as `F2`, `F'`, or any other variation that includes `F`) or **(2)** the random move has not been _simplified_ (see below). If the move is deemed valid, a valid ending may be concatenated by random selection (`'` or `2` for **2x2** & **3x3** and `'`, `2`,`w`,`w'`, or `w2` for **4x4**-**7x7**). Additionally, a prefix may concatenated for **6x6** and **7x7** cubes to express triple layer turns (only if the triple layer turn is randomly selected). Once the scramble length hits the predetermined length, the scrambler cuts off and the scramble sequence is returned.

## 🤓 Simplification
Let's start with an example. The sequence `L2 R L'` is the same as `L R`. This is because NxN cube movements all have opposites, which are essentially (_parallel_) movements that don't interfere with each other (`U`⇔`D`, `L`⇔`R`, & `F`⇔`B` for NxN cubes). However, simplification doesn't always apply. For example, the pyraminx **cannot** use simplification since each layer is affected by the movement of the other layers. Here's a quick "definition": **a move has been _simplified_ if the sequence is constructed in a way such that a move cannot be removed to reduce a sequence**. To make sense of that statement, let's discuss the design. A [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) is used to store these unsimplified moves. If the first condition is met & the `Set` doesn't contain the randomly generated move, then the random move is added to the sequence. After the random move is added, the `Set` is filtered so that every move except the most recently added movement and its opposite are removed. For example, if the most recent move was `F2`, then every movement in the `Set` except `F` and `B` (opposite) is removed. The opposite movement is ignored since it is not impacted by the random move (their layers are parallel). This process is performed **every time** a new movement is added to the scrambling sequence to prevent _simplification_, by building a scrambling sequence while prohibiting subsequences that can be reduced, which inevitably builds stronger scrambling sequences (hopefully some of that makes sense).

## Progress
- 2x2 ✅
- 3x3 ✅
- 4x4 ✅
- 5x5 ✅
- 6x6 ✅
- 7x7 ✅
- Megaminx ✅
- Pyraminx ✅
- Square-1 ❌
- Skewb ✅
- Clock ✅

## Usage
If you have any questions/issues/requests or if you discover any bugs, please raise an issue so that I can assist you.<br />
Also, feel free to use this code within your projects. Giving credit is optional, but it is much appreciated.