// This code was re-written from here: https://github.com/tdecker91/srScrambler
const top = [2,1,2,1,2,1,2,1];
const bottom = [1,2,1,2,1,2,1,2];

const turnTop = function(turns) {
    while (turns !== 0) {
        if (turns < 0) {
            const curr = top.shift();
            turns += curr;
            top.push(curr);
        } else {
            const curr = top.pop();
            turns -= curr;
            top.unshift(curr);
        }
    } 
}

const turnBottom = function(turns) {
    while (turns !== 0) {
        if (turns < 0) {
            const curr = bottom.shift();
            turns += curr;
            bottom.push(curr);
        } else {
            const curr = bottom.pop();
            turns -= curr;
            bottom.unshift(curr);
        }
    }
}

const slice = function() {
    let topNum = 0;
    let bottomNum = 0;
    let curr = 0;
    let idx = top.length;
    while (idx > 0 && curr < 6) {
        curr += top[--idx];
        topNum++;
    }
    curr = 0;
    idx = 0;
    while (idx < bottom.length && curr < 6) {
        curr += bottom[idx++];
        bottomNum++;
    }
    const topLen = top.length;
    for (let i = topLen - topNum; i < topLen; i++) {
        top.push(top[i]);
    }
    for (let i = 0; i < bottomNum; i++) {
        bottom.push(bottom[i]);
    }
}

const isLayerAligned = function(layer) {
    let curr = 0;
    let idx = 0;
    while (idx < layer.length && curr < 6) { 
        curr += layer[idx++];
        if (curr > 6) {
            return false;
        }
    }
    return true;
}

const isMovePossible = function(layer, turns) {
    if (turns < 0) {
        // Move from the front to the back
        while (turns < 0) {
            const curr = layer.shift();
            if (curr > Math.abs(turns)) {
                return false;
            }
            turns += curr;
            layer.push(curr);
        }
        return isLayerAligned(layer);
    } else if (turns > 0) {
        // Move from the back to the front
        while (turns > 0) {
            const curr = layer.pop();
            if (turns < curr) {
                return false;
            }
            turns -= curr;
            layer.unshift(curr);
        }
        return isLayerAligned(layer);
    }
    // turns = 0 (always possible)
    return true;
}

const possibleMoves = function() {
    const possibleTop = [];
    const possibleBottom = [];
    for (let i = -6; i <= 6; i++) {
        if (isMovePossible([...top], i)) {
            possibleTop.push(i);
        }
        if (isMovePossible([...bottom], i)) {
            possibleBottom.push(i);
        }
    }
    return { possibleTop, possibleBottom };
}

const generateSequence = function(length) {
    const scramble = [];
    for (let i = 0; i < length; i++) {
        const moves = possibleMoves();
        let topMove = 0;
        let bottomMove = 0;
        do {
            topMove = moves.possibleTop[Math.floor(Math.random() * moves.possibleTop.length)];
            bottomMove = moves.possibleBottom[Math.floor(Math.random() * moves.possibleBottom.length)];
        } while (topMove === 0 && bottomMove === 0);
        scramble.push({
            top: topMove,
            bottom: bottomMove
        });
        turnTop(topMove);
        turnBottom(bottomMove);
        slice();
    }
    return scramble;
}

console.log(generateSequence(12).map(move => `(${move.top},${move.bottom})`).join(' / '));