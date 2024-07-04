// This is from cubing.js
// https://github.com/cubing/cubing.js/blob/7be67f9dba665b456f24e0e4107d4918d9967870/src/cubing/search/inside/solve/puzzles/clock.ts
const pins = ["UR", "DR", "DL", "UL"];
const backMoves = ["U", "R", "D", "L", "ALL"];
const frontMoves = pins.concat(backMoves);

const randomNum = (limit) => Math.floor(Math.random() * limit);

const randomClockScrambleString = function() {
  let filteringMoveCount = 0;

  function randomSuffix() {
    const amount = randomNum(12);
    if (amount !== 0) {
      filteringMoveCount++;
    }
    if (amount <= 6) {
      return `${amount}+`;
    } else {
      return `${12 - amount}-`;
    }
  }

  const moves = [];
  const side = function(families) {
    for (const family of families) {
      moves.push(`${family}${randomSuffix()}`);
    }
  }

  side(frontMoves);
  moves.push("y2");
  side(backMoves);

  if (filteringMoveCount < 2) {
    return randomClockScrambleString();
  }

  for (const pin of pins) {
    if (randomNum(2) === 0) {
      moves.push(pin);
    }
  }
  return moves;
}