const moves = ['U','R','D'];
const active = {
    'U': false,
    'D': false
}
const n = moves.length;

const randomNum = (limit) => Math.floor(Math.random() * limit);

const generateSequence = function(length) {
    const scramble = [];
    let count = 0;
    while (count < length) {
        const randMove = moves[randomNum(n)];
        // check for reset attempts (e.g => U D++ U') & similar adjacent moves
        if ((scramble[count-1] && scramble[count-1].startsWith(randMove)) || active[randMove]) {
            // re-generate random move since current move is invalid
            continue;
        }
        // set move to true if it's in active 
        if (randMove in active) active[randMove] = true;
        if (randMove === 'R') {
            active['U'] = false;
            active['D'] = false;
        }
        // add move to scramble sequence with customized ending
        scramble.push(randMove + (randMove === 'U' ? (Math.random() < 0.5 ? '\'' : '') : (Math.random() < 0.5 ? '++' : '--')));
        count++;
    }
    return scramble;
}

console.log(generateSequence(70).join(' '));