const moves = ['U','L','R','B','u','l','r','b'];
const endings = ['','\'','2'];
const movedTips = new Set();
const n = moves.length;
const m = endings.length;

const randomNum = (limit) => Math.floor(Math.random() * limit);

const generateSequence = function(length) {
    const scramble = [];
    let count = 0;
    while (count < length) {
        const randMove = moves[randomNum(n)];
        // check for similar adjacent moves & attempts to touch a moved tip
        if ((scramble[count-1] && scramble[count-1].startsWith(randMove)) || movedTips.has(randMove)) {
            // re-generate random move since current move is invalid
            continue;
        }
        // adds move to movedTips if the current move is a tip move
        if (/^[ulrb]$/.test(randMove)) movedTips.add(randMove);
        // add move to scramble sequence
        scramble.push(randMove + endings[randomNum(m)]);
        count++;
    }
    return scramble;
}