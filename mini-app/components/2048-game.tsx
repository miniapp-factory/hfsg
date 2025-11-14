import { useEffect, useState } from "react";

const SIZE = 4;
const TILE_VALUES = [2, 4];
const TILE_PROBABILITIES = [0.9, 0.1];

function createEmptyBoard(): number[][] {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function addRandomTile(board: number[][]): number[][] {
  const emptyCells: [number, number][] = [];
  board.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (cell === 0) emptyCells.push([r, c]);
    })
  );
  if (emptyCells.length === 0) return board;
  const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const value =
    Math.random() < TILE_PROBABILITIES[0] ? TILE_VALUES[0] : TILE_VALUES[1];
  const newBoard = board.map((row) => row.slice());
  newBoard[r][c] = value;
  return newBoard;
}

function slideAndMerge(row: number[]): { newRow: number[]; scoreDelta: number } {
  const nonZero = row.filter((v) => v !== 0);
  const merged: number[] = [];
  let scoreDelta = 0;
  for (let i = 0; i < nonZero.length; i++) {
    if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
      const mergedVal = nonZero[i] * 2;
      merged.push(mergedVal);
      scoreDelta += mergedVal;
      i++; // skip next
    } else {
      merged.push(nonZero[i]);
    }
  }
  while (merged.length < SIZE) merged.push(0);
  return { newRow: merged, scoreDelta };
}

function transpose(board: number[][]): number[][] {
  return board[0].map((_, i) => board.map((row) => row[i]));
}

function reverseRows(board: number[][]): number[][] {
  return board.map((row) => row.slice().reverse());
}

export interface Game2048Props {
  onGameOver: (finalScore: number) => void;
}

export function Game2048({ onGameOver }: Game2048Props) {
  const [board, setBoard] = useState<number[][]>(createEmptyBoard());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    let b = createEmptyBoard();
    b = addRandomTile(b);
    b = addRandomTile(b);
    setBoard(b);
  }, []);

  const move = (direction: "up" | "down" | "left" | "right") => {
    if (gameOver) return;
    let newBoard = board;
    let scoreDelta = 0;
    if (direction === "up" || direction === "down") {
      newBoard = transpose(newBoard);
    }
    if (direction === "right" || direction === "down") {
      newBoard = reverseRows(newBoard);
    }
    const movedBoard: number[][] = [];
    for (const row of newBoard) {
      const { newRow, scoreDelta: delta } = slideAndMerge(row);
      movedBoard.push(newRow);
      scoreDelta += delta;
    }
    if (direction === "right" || direction === "down") {
      movedBoard = reverseRows(movedBoard);
    }
    if (direction === "up" || direction === "down") {
      movedBoard = transpose(movedBoard);
    }
    if (JSON.stringify(movedBoard) !== JSON.stringify(board)) {
      let updatedBoard = addRandomTile(movedBoard);
      setBoard(updatedBoard);
      setScore((s) => s + scoreDelta);
      if (checkGameOver(updatedBoard)) {
        setGameOver(true);
        onGameOver(score + scoreDelta);
      }
    }
  };

  const checkGameOver = (b: number[][]): boolean => {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (b[r][c] === 0) return false;
        if (c + 1 < SIZE && b[r][c] === b[r][c + 1]) return false;
        if (r + 1 < SIZE && b[r][c] === b[r + 1][c]) return false;
      }
    }
    return true;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-4 gap-2">
        {board.flat().map((val, idx) => (
          <div
            key={idx}
            className={`w-12 h-12 flex items-center justify-center rounded-md text-xl font-bold ${
              val
                ? `bg-${val}-500 text-white`
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {val || ""}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={() => move("up")}>↑</button>
        <button onClick={() => move("left")}>←</button>
        <button onClick={() => move("right")}>→</button>
        <button onClick={() => move("down")}>↓</button>
      </div>
      <div className="text-lg">Score: {score}</div>
      {gameOver && <div className="text-red-600">Game Over!</div>}
    </div>
  );
}
