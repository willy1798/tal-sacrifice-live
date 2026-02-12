importScripts("https://cdn.jsdelivr.net/npm/stockfish@16.1.0/src/stockfish.js");

const engine = STOCKFISH();
engine.postMessage("uci");

engine.onmessage = function(event) {
    postMessage(event);
};

onmessage = function(e) {
    engine.postMessage(e.data);
};
