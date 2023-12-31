const moves = ['U','D','L','R','F','B'];
const endings = ['','\'','2','w','w\'','w2'];
const active = new Set();

const n = moves.length;
const m = endings.length;
const opposite = {
    'U': 'D',
    'D': 'U',
    'L': 'R',
    'R': 'L',
    'F': 'B',
    'B': 'F' 
}

const randomNum = (limit) => Math.floor(Math.random() * limit);
const removeIntersections = function(curr) {
    active.forEach(move => {
        // delete from active is the motion was "intersected" (impossible to simplify)
        if (move !== curr && move !== opposite[curr]) active.delete(move);
    });
}

const generateSequence = function(length) {
    const scramble = [];
    let count = 0;
    while (count < length) {
        const randMove = moves[randomNum(n)];
        // check for reset attempts (e.g => F B F/F'/F2) & similar adjacent moves
        if ((scramble[count-1] && scramble[count-1].startsWith(randMove)) || active.has(randMove)) {
            // re-generate random move since current move is invalid
            continue;
        }
        // add current "valid" move to active and scramble sequence 
        active.add(randMove);
        scramble.push(randMove + endings[randomNum(m)]);
        // remove all moves whose simplification is now impossible
        removeIntersections(randMove);
        count++;
    }
    return scramble;
}

console.log(generateSequence(60).join(' '));