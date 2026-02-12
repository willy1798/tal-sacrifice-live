function pieceValue(p) {
    return {p:1,n:3,b:3,r:5,q:9}[p] || 0;
}

function isSacrifice(move) {
    let loss = pieceValue(move.piece);
    let gain = move.captured ? pieceValue(move.captured) : 0;
    return loss > gain;
}
