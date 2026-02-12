let board;
let game = new Chess();
let worker = new Worker("engine-worker.js");

let evalActual = 0;

worker.postMessage("uci");

worker.onmessage = function(e) {

    let line = e.data;

    if (line.includes("score cp")) {
        let cp = parseInt(line.split("score cp ")[1]);
        evalActual = cp / 100;
    }

    if (line.startsWith("bestmove")) {
        let move = line.split(" ")[1];
        game.move(move);
        board.position(game.fen());
        analyzePosition();
    }
};

function analyzePosition() {

    removeHighlights();

    let moves = game.moves({ verbose: true });

    moves.forEach(m => {

        if (isSacrifice(m)) {
            highlightSquare(m.from);
            highlightSquare(m.to);
        }
    });
}

function highlightSquare(square) {
    let squareEl = document.querySelector('.square-' + square);
    if (squareEl) {
        squareEl.classList.add('highlight-sacrifice');
    }
}

function removeHighlights() {
    document.querySelectorAll('.highlight-sacrifice')
        .forEach(el => el.classList.remove('highlight-sacrifice'));
}

function onDrop(source, target) {

    let move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    if (!move) return 'snapback';

    worker.postMessage("position fen " + game.fen());
    worker.postMessage("go depth 17");

    setTimeout(analyzePosition, 300);
}

function newGame() {
    game.reset();
    board.position('start');
    analyzePosition();
}

board = Chessboard('board', {
    draggable: true,
    position: 'start',
    onDrop: onDrop
});

analyzePosition();
