import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const generateBoard = (size, mines) => {
  let board = Array(size * size).fill("safe");
  let mineIndices = new Set();
  while (mineIndices.size < mines) {
    mineIndices.add(Math.floor(Math.random() * size * size));
  }
  mineIndices.forEach((i) => (board[i] = "mine"));
  return board;
};

export default function MinesGame() {
  const size = 5;
  const [mineCount, setMineCount] = useState(5);
  const [bet, setBet] = useState(10);
  const [balance, setBalance] = useState(1000);
  const [board, setBoard] = useState(generateBoard(size, mineCount));
  const [revealed, setRevealed] = useState(Array(size * size).fill(false));
  const [gameOver, setGameOver] = useState(false);
  const [cashout, setCashout] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleClick = (index) => {
    if (!gameStarted || gameOver || revealed[index]) return;
    setClickCount(prev => prev + 1);
    
    setTimeout(() => {
      const newRevealed = [...revealed];
      newRevealed[index] = true;
      setRevealed(newRevealed);
      if (board[index] === "mine") {
        setGameOver(true);
        setCashout(0);
      } else {
        setCashout((prev) => prev * (1 + mineCount / 25));
      }
    }, 300);
  };

  const handleCashout = () => {
    if (!gameStarted || clickCount === 0) return;
    setBalance((prev) => prev + bet * cashout);
    alert(`You cashed out with $${(bet * cashout).toFixed(2)}!`);
    resetGame();
  };

  const handleStart = () => {
    if (bet > balance || bet <= 0) {
      alert("Invalid bet amount");
      return;
    }
    setBalance((prev) => prev - bet);
    setGameStarted(true);
    resetGame();
  };

  const resetGame = () => {
    setBoard(generateBoard(size, mineCount));
    setRevealed(Array(size * size).fill(false));
    setGameOver(false);
    setCashout(1);
    setClickCount(0);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="text-lg font-bold">Balance: ${balance.toFixed(2)}</div>
      <div className="flex gap-2">
        <div className="flex flex-col items-center">
          <label className="text-sm font-bold">Bet Amount</label>
          <input
            type="number"
            value={bet}
            onChange={(e) => setBet(Number(e.target.value))}
            className="p-2 border rounded"
          />
        </div>
        <div className="flex flex-col items-center">
          <label className="text-sm font-bold">Mine Count</label>
          <input
            type="number"
            value={mineCount}
            onChange={(e) => setMineCount(Number(e.target.value))}
            className="p-2 border rounded"
          />
        </div>
        <Button onClick={handleStart}>Start</Button>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {board.map((cell, i) => (
          <motion.button
            key={i}
            className={`w-12 h-12 text-xl font-bold rounded ${revealed[i] ? (cell === "mine" ? "bg-red-600" : "bg-green-500") : "bg-gray-400"}`}
            onClick={() => handleClick(i)}
            initial={{ opacity: 0 }}
            animate={{ opacity: revealed[i] ? 1 : 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {revealed[i] && (cell === "mine" ? "💣" : "💰")}
          </motion.button>
        ))}
      </div>
      <div className="flex gap-4">
        <span className="text-lg font-bold">Cashout: ${(bet * cashout).toFixed(2)}</span>
        <Button 
          onClick={handleCashout} 
          disabled={!gameStarted || clickCount === 0 || gameOver} 
          className="bg-green-500 hover:bg-green-600"
        >
          Cash Out
        </Button>
      </div>
      {gameOver && <div className="text-red-600 text-lg font-bold">You hit a mine!</div>}
    </div>
  );
}
