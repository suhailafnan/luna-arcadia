"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LunaBlitz() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'practice';

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-4">
      <style jsx global>{`
        @keyframes tileClick {
          0% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.3) rotate(180deg); }
          100% { transform: scale(0.8) rotate(360deg); opacity: 0; }
        }
        
        @keyframes tileAppear {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .tile-click-animation {
          animation: tileClick 0.4s ease-out forwards;
        }
        
        .tile-appear-animation {
          animation: tileAppear 0.3s ease-out forwards;
        }
      `}</style>
      
      <div className="w-full max-w-md">
        <button
          onClick={() => router.push("/games")}
          className="mb-4 bg-gray-700 text-white px-4 py-2 font-pixel text-sm hover:bg-gray-600"
        >
          &lt; EXIT GAME
        </button>

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
  const [timeLeft, setTimeLeft] = useState(mode === 'competitive' ? 180 : 120);
  const [pressureLevel, setPressureLevel] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [combo, setCombo] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  const isCompetitive = mode === 'competitive';

  const handleTileClick = () => {
    if (!gameActive) return;

    const points = Math.floor(Math.random() * 40) + 10;
    setScore((prev) => prev + points);
    setCombo((prev) => prev + 1);

    setPressureLevel((prev) => {
      const newLevel = Math.min(100, prev + 5);
      
      if (newLevel >= 100) {
        setScore((s) => s + points);
        setTimeout(() => setPressureLevel(0), 500);
      }
      
      return newLevel;
    });
  };

  useEffect(() => {
    if (gameActive) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameActive(false);
            setShowGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      if (isCompetitive) {
        const opponentTimer = setInterval(() => {
          setOpponentScore((prev) => prev + Math.floor(Math.random() * 30) + 10);
        }, 2000);
        return () => {
          clearInterval(timer);
          clearInterval(opponentTimer);
        };
      }

      return () => clearInterval(timer);
    }
  }, [gameActive, isCompetitive]);

  useEffect(() => {
    if (gameActive) {
      initGame(handleTileClick);
    }
  }, [gameActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startGame = () => {
    setGameActive(true);
    setShowGameOver(false);
    setScore(0);
    setOpponentScore(0);
    setPressureLevel(0);
    setCombo(0);
    setTimeLeft(isCompetitive ? 180 : 120);
  };

  if (showGameOver) {
    const didWin = isCompetitive ? score > opponentScore : score >= 1000;
    
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 border-4 border-yellow-400 rounded-lg p-8 max-w-md w-full text-center">
          <h2 className="font-pixel text-4xl mb-4 text-yellow-300 animate-pulse">
            GAME OVER!
          </h2>
          
          <div className="mb-6">
            {isCompetitive ? (
              <>
                <div className="mb-4">
                  <p className="font-pixel text-sm text-gray-400 mb-2">YOUR SCORE</p>
                  <p className="font-pixel text-3xl text-green-400">{score}</p>
                </div>
                <div className="mb-4">
                  <p className="font-pixel text-sm text-gray-400 mb-2">OPPONENT SCORE</p>
                  <p className="font-pixel text-3xl text-red-400">{opponentScore}</p>
                </div>
                {didWin ? (
                  <p className="font-pixel text-xl text-green-400 mt-6">
                    🏆 YOU WON $38.80! 🏆
                  </p>
                ) : (
                  <p className="font-pixel text-xl text-red-400 mt-6">
                    😢 OPPONENT WON
                  </p>
                )}
              </>
            ) : (
              <>
                <div className="mb-4">
                  <p className="font-pixel text-sm text-gray-400 mb-2">FINAL SCORE</p>
                  <p className="font-pixel text-5xl text-green-400">{score}</p>
                </div>
                <div className="mb-4">
                  <p className="font-pixel text-sm text-gray-400 mb-2">COMBO</p>
                  <p className="font-pixel text-2xl text-cyan-400">{combo}x</p>
                </div>
                {didWin ? (
                  <p className="font-pixel text-lg text-green-400 mt-6">
                    ✨ +50 POINTS EARNED! ✨
                  </p>
                ) : (
                  <p className="font-pixel text-lg text-yellow-400 mt-6">
                    TRY AGAIN TO WIN +50!
                  </p>
                )}
              </>
            )}
          </div>

          <button
            onClick={startGame}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 font-pixel text-lg mb-3 border-4 border-green-400 rounded"
          >
            PLAY AGAIN
          </button>
          
          <button
            onClick={() => window.location.href = '/games'}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 font-pixel text-sm border-2 border-gray-500 rounded"
          >
            BACK TO GAMES
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="header-panel p-3 mb-2 bg-slate-800 rounded-lg shadow-inner border-b border-indigo-500">
        <div className="flex justify-between items-center text-sm font-semibold mb-2">
          <div className="text-indigo-400 font-pixel text-xs">
            {isCompetitive ? (
              <span>$20 DUEL MODE</span>
            ) : (
              <span>PRACTICE MODE</span>
            )}
          </div>
          <div className={`text-3xl font-extrabold ${timeLeft < 30 ? 'text-red-600 animate-pulse' : 'text-red-500'} bg-red-900/40 px-3 py-1 rounded-full border border-red-500 shadow-lg`}>
            {formatTime(timeLeft)}
          </div>
        </div>

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

      <div className="mechanics-panel p-3 mb-3 bg-slate-800 rounded-lg border-b border-purple-500">
        <div className="mb-2">
          <h3 className="text-xs font-mono text-center mb-1 text-purple-300">
            {pressureLevel >= 100 ? '🔥 FEVER MODE! 🔥' : 'Pressure Gauge'}
          </h3>
          <div className="h-4 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
            <div 
              className={`h-full transition-all duration-300 ${pressureLevel >= 100 ? 'bg-yellow-400 animate-pulse' : 'bg-indigo-600'}`}
              style={{ width: `${pressureLevel}%` }}
            ></div>
          </div>
          <p className="text-xs text-center mt-1 text-gray-400">
            {pressureLevel >= 100 ? '2x POINTS ACTIVE!' : 'Fill bar for 2x Score Multiplier!'}
          </p>
        </div>
        
        <div className="text-center mt-3 bg-purple-900/30 p-2 rounded-md border-2 border-purple-600">
          <h4 className="text-sm font-semibold text-purple-300 font-pixel text-xs">Combo:</h4>
          <p className="text-lg font-bold text-white">{combo}x</p>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center p-2 min-h-[400px]">
        <div id="board-grid" className="grid grid-cols-7 grid-rows-7 aspect-square w-full gap-0.5 bg-[#1a1a2e] p-1 rounded-lg border-2 border-[#5b64c0] shadow-inner">
        </div>
      </div>
      
      <div className="footer-panel p-3 mt-3 bg-slate-800 rounded-lg border-t border-indigo-500">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <span className="text-sm text-gray-400">Your Score:</span>
            <span className="text-3xl font-extrabold text-green-400 block">{score}</span>
          </div>
          <button 
            onClick={startGame}
            disabled={gameActive}
            className={`px-6 py-3 font-bold font-pixel text-sm rounded-full shadow-lg transition duration-200 transform hover:scale-105 ${
              gameActive 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white'
            }`}
          >
            {gameActive ? 'PLAYING...' : 'START MATCH'}
          </button>
        </div>
      </div>
    </>
  );
}

function initGame(onTileClick: () => void) {
  const board = document.getElementById('board-grid');
  if (!board) return;

  const TILE_SYMBOLS = ['⭐', '🚀', '🔮', '👾', '💎', '🟢', '🔴'];
  const GRID_SIZE = 7;

  board.innerHTML = '';
  
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const tile = document.createElement('div');
    tile.className = 'flex items-center justify-center text-2xl bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition-all';
    tile.textContent = TILE_SYMBOLS[Math.floor(Math.random() * TILE_SYMBOLS.length)];
    tile.dataset.index = i.toString();
    tile.style.transition = 'all 0.3s ease';
    
    tile.addEventListener('click', () => {
      onTileClick();
      
      // Add click animation
      tile.classList.add('tile-click-animation', 'bg-gradient-to-br', 'from-green-400', 'to-blue-500');
      
      setTimeout(() => {
        // Change symbol
        tile.textContent = TILE_SYMBOLS[Math.floor(Math.random() * TILE_SYMBOLS.length)];
        tile.classList.remove('tile-click-animation', 'bg-gradient-to-br', 'from-green-400', 'to-blue-500');
        tile.classList.add('tile-appear-animation');
        
        setTimeout(() => {
          tile.classList.remove('tile-appear-animation');
        }, 300);
      }, 400);
    });
    
    board.appendChild(tile);
  }
}
