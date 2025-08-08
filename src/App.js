import { useState } from "react";

function Square({ highlight, value, onSquareClick }) {
  return (
    <button
      className={highlight ? "square highlight" : "square"}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xNext, squares, handlePlay }) {
  const result = calculateWinner(squares);
  let status = result
    ? "Winner: " + result.winner
    : squares.every(Boolean)
    ? "Draw!"
    : "Next player: " + (xNext ? "X" : "O");

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares.slice(); // creates copy of the array
    nextSquares[i] = xNext ? "X" : "O";
    handlePlay(nextSquares);
  }

  function createRow(start) {
    let rowSquares = [];
    for (let i = start; i < start + 3; i++) {
      rowSquares.push(
        <Square
          key={i}
          highlight={result && result.winningLine.includes(i)}
          value={squares[i]}
          onSquareClick={() => handleClick(i)}
        />
      );
    }
    return (
      <>
        <div className="board-row">{rowSquares}</div>
      </>
    );
  }

  function createBoard() {
    let boardRows = [];
    for (let i = 0; i < 3; i++) {
      boardRows.push(createRow(i * 3));
    }
    return boardRows;
  }

  return (
    <>
      <div className="status">{status}</div>
      {createBoard()}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const newHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(newHistory);
    setCurrentMove(newHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    // move is the index
    let description = move > 0 ? "Go to move #" + move : "Go to game start";
    return (
      <li key={move}>
        {move === currentMove ? (
          <p>You are at move #{move}</p>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xNext={xNext} squares={currentSquares} handlePlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningLine: lines[i] };
    }
  }
  return null;
}
