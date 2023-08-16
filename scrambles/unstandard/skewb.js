const moves = ['U','L','R','B'];
const n = moves.length;

const randomNum = (limit) => Math.floor(Math.random() * limit);

const generateSequence = function(length) {
    const scramble = [];
    let count = 0;
    while (count < length) {
        const randMove = moves[randomNum(n)];
        // check for similar adjacent moves
        if (scramble[count-1] && scramble[count-1].startsWith(randMove)) {
            // re-generate random move since current move is invalid
            continue;
        }
        // add move to scramble sequence with or without counterclockwise ending
        scramble.push(randMove + (Math.random() < 0.5 ? '\'' : ''));
        count++;
    }
    return scramble;
}

console.log(generateSequence(25).join(' '));