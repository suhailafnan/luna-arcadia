"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LunaBlitz() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'practice'; // Get mode from URL

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => router.push("/games")}
          className="mb-4 bg-gray-700 text-white px-4 py-2 font-pixel text-sm hover:bg-gray-600"
        >
          &lt; EXIT GAME
        </button>

        {/* Game Container */}
        <div className="game-container bg-[#252840] rounded-3xl shadow-2xl p-3">
          <GameContent mode={mode} />
        </div>
      </div>
    </div>
  );
}

function GameContent({ mode }: { mode: string }) {
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(mode === 'competitive' ? 180 : 120); // 3 min for competitive, 2 min for practice
  const [pressureLevel, setPressureLevel] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  const isCompetitive = mode === 'competitive';

  useEffect(() => {
    if (gameActive) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            setGameActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameActive]);

  useEffect(() => {
    // Initialize game board
    initGame();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setOpponentScore(0);
    setPressureLevel(0);
    setTimeLeft(isCompetitive ? 180 : 120);
  };

  return (
    <>
      {/* Header Panel */}
      <div className="header-panel p-3 mb-2 bg-slate-800 rounded-lg shadow-inner border-b border-indigo-500">
        <div className="flex justify-between items-center text-sm font-semibold mb-2">
          <div className="text-indigo-400 font-pixel text-xs">
            {isCompetitive ? (
              <span>$20 DUEL MODE</span>
            ) : (
              <span>PRACTICE MODE</span>
            )}
          </div>
          <div className="text-3xl font-extrabold text-red-500 bg-red-900/40 px-3 py-1 rounded-full border border-red-500 shadow-lg">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Show opponent only in competitive mode */}
        {isCompetitive ? (
          <div className="opponent-status bg-slate-900 p-2 rounded-lg flex justify-between items-center border border-gray-600">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">👤</span>
              <span className="text-gray-300 font-pixel text-xs">Opponent</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400">Score:</span>
              <span className="text-lg font-bold text-yellow-300">{opponentScore}</span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 p-3 rounded-lg border border-cyan-500 text-center">
            <div className="text-xs text-cyan-400 font-pixel mb-1">TARGET SCORE</div>
            <div className="text-2xl font-bold text-cyan-300">1000 PTS</div>
            <div className="text-xs text-gray-400 mt-1">Earn +50 bonus on win</div>
          </div>
        )}
      </div>

      {/* Pressure Bar */}
      <div className="mechanics-panel p-3 mb-3 bg-slate-800 rounded-lg border-b border-purple-500">
        <div className="mb-2">
          <h3 className="text-xs font-mono text-center mb-1 text-purple-300">
            Pressure Gauge
          </h3>
          <div className="h-4 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
            <div 
              className="h-full bg-indigo-600 transition-all duration-300" 
              style={{ width: `${pressureLevel}%` }}
            ></div>
          </div>
          <p className="text-xs text-center mt-1 text-gray-400">Fill bar for 2x Score Multiplier!</p>
        </div>
        
        <div className="text-center mt-3 bg-purple-900/30 p-2 rounded-md border-2 border-purple-600">
          <h4 className="text-sm font-semibold text-purple-300 font-pixel text-xs">Match Objective:</h4>
          <p className="text-lg font-bold text-white">Clear 5 🚀 tiles</p>
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-grow flex items-center justify-center p-2 min-h-[400px]">
        <div id="board-grid" className="grid grid-cols-7 grid-rows-7 aspect-square w-full gap-0.5 bg-[#1a1a2e] p-1 rounded-lg border-2 border-[#5b64c0] shadow-inner">
          {/* Tiles will be generated by JS */}
        </div>
      </div>
      
      {/* Footer */}
      <div className="footer-panel p-3 mt-3 bg-slate-800 rounded-lg border-t border-indigo-500">
        <div className="flex justify-between items-center mb-4">
          <div className="text-center">
            <span className="text-sm text-gray-400">Your Score:</span>
            <span className="text-3xl font-extrabold text-green-400 block">{score}</span>
          </div>
          <button 
            onClick={startGame}
            disabled={gameActive}
            className={`px-6 py-3 font-bold font-pixel rounded-full shadow-lg transition duration-200 transform hover:scale-105 ${
              gameActive 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white'
            }`}
          >
            {gameActive ? 'PLAYING...' : 'START MATCH'}
          </button>
        </div>

        {/* Game Status */}
        {!gameActive && timeLeft === 0 && (
          <div className="text-center mt-2">
            {isCompetitive ? (
              score > opponentScore ? (
                <p className="font-pixel text-green-400 text-sm">YOU WON $38.80!</p>
              ) : (
                <p className="font-pixel text-red-400 text-sm">OPPONENT WON</p>
              )
            ) : (
              score >= 1000 ? (
                <p className="font-pixel text-green-400 text-sm">+50 POINTS EARNED!</p>
              ) : (
                <p className="font-pixel text-yellow-400 text-sm">TRY AGAIN!</p>
              )
            )}
          </div>
        )}
      </div>
    </>
  );
}

function initGame() {
  console.log("Luna Blitz initialized");
  
  // Initialize game board
  const board = document.getElementById('board-grid');
  if (!board) return;

  const TILE_SYMBOLS = ['⭐', '🚀', '🔮', '👾', '💎', '🟢', '🔴'];
  const GRID_SIZE = 7;

  board.innerHTML = '';
  
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const tile = document.createElement('div');
    tile.className = 'flex items-center justify-center text-2xl bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition-colors';
    tile.textContent = TILE_SYMBOLS[Math.floor(Math.random() * TILE_SYMBOLS.length)];
    tile.dataset.index = i.toString();
    
    tile.addEventListener('click', () => {
      // Simple click animation
      tile.classList.add('animate-ping');
      setTimeout(() => {
        tile.classList.remove('animate-ping');
        tile.textContent = TILE_SYMBOLS[Math.floor(Math.random() * TILE_SYMBOLS.length)];
      }, 300);
    });
    
    board.appendChild(tile);
  }
}
