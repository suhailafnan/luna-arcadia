"use client";
import { useRouter } from "next/navigation";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect, useState } from "react";

const GAMES = [
  {
    id: "luna-blitz",
    name: "LUNA BLITZ",
    icon: "🌙",
    status: "active",
    description: "Match-3 Duel Arena",
    competitiveReward: "$38.80 POT",
    competitiveEntry: "$20",
    duration: "3 MIN"
  },
  {
    id: "cosmic-race",
    name: "COSMIC RACE",
    icon: "🚀",
    status: "coming-soon",
    description: "Speed Racing Challenge",
    competitiveReward: "TBA",
    competitiveEntry: "TBA",
    duration: "TBA"
  },
  {
    id: "star-blast",
    name: "STAR BLAST",
    icon: "💥",
    status: "coming-soon",
    description: "Asteroid Shooter",
    competitiveReward: "TBA",
    competitiveEntry: "TBA",
    duration: "TBA"
  },
  {
    id: "crystal-miner",
    name: "CRYSTAL MINER",
    icon: "💎",
    status: "coming-soon",
    description: "Resource Collection",
    competitiveReward: "TBA",
    competitiveEntry: "TBA",
    duration: "TBA"
  }
];

export default function GamesArena() {
  const router = useRouter();
  const { connected, account } = useWallet();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [showModeSelector, setShowModeSelector] = useState(false);

  useEffect(() => {
    console.log("Games page - Connected:", connected);
    console.log("Games page - Account:", account);
  }, [connected, account]);

  const handleGameClick = (gameId: string) => {
    setSelectedGame(gameId);
    setShowModeSelector(true);
  };

  const handleModeSelect = (mode: 'competitive' | 'practice') => {
    if (selectedGame) {
      router.push(`/games/${selectedGame}?mode=${mode}`);
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-[#1f1f47] flex items-center justify-center p-4">
        <div className="text-center bg-gray-900 border-4 border-red-500 p-8 max-w-md">
          <h2 className="font-pixel text-2xl text-red-400 mb-4">ACCESS DENIED</h2>
          <p className="font-mono-game text-white mb-6">CONNECT WALLET TO PLAY</p>
          <button
            onClick={() => router.push("/")}
            className="bg-cyan-500 text-black px-6 py-3 font-pixel hover:bg-cyan-400"
          >
            RETURN TO HOME
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1f1f47] p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <button
            onClick={() => router.push("/")}
            className="mb-4 bg-gray-700 text-white px-4 py-2 font-pixel text-sm hover:bg-gray-600"
          >
            &lt; BACK TO HUB
          </button>
          <h1 
            className="font-pixel text-4xl md:text-5xl text-yellow-300 mb-2"
            style={{ textShadow: '4px 4px 0 #000000, 6px 6px 0 #ff3a3a' }}
          >
            GAME ARENA
          </h1>
          <p className="font-mono-game text-cyan-400">SELECT YOUR CHALLENGE</p>
          {account && (
            <p className="font-mono-game text-xs text-gray-400 mt-2">
              Player: {account.address.toString().slice(0, 6)}...{account.address.toString().slice(-4)}
            </p>
          )}
        </header>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GAMES.map((game) => (
            <div
              key={game.id}
              className={`relative bg-gray-900 border-4 rounded-lg p-6 ${
                game.status === 'active' 
                  ? 'border-green-500 shadow-lg shadow-green-500/50' 
                  : 'border-gray-600 opacity-70'
              }`}
            >
              {/* Coming Soon Badge */}
              {game.status === 'coming-soon' && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 font-pixel text-xs">
                  COMING SOON
                </div>
              )}

              {/* Game Icon */}
              <div className="text-6xl text-center mb-4">{game.icon}</div>

              {/* Game Info */}
              <h2 className="font-pixel text-2xl text-white text-center mb-2">
                {game.name}
              </h2>
              <p className="font-mono-game text-gray-400 text-center mb-4">
                {game.description}
              </p>

              {/* Game Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-800 p-3 rounded text-center">
                  <div className="font-mono-game text-xs text-gray-400">PRIZE POOL</div>
                  <div className="font-pixel text-sm text-yellow-400">{game.competitiveReward}</div>
                </div>
                <div className="bg-gray-800 p-3 rounded text-center">
                  <div className="font-mono-game text-xs text-gray-400">DURATION</div>
                  <div className="font-pixel text-sm text-cyan-400">{game.duration}</div>
                </div>
              </div>

              {/* Play Button */}
              {game.status === 'active' ? (
                <button
                  onClick={() => handleGameClick(game.id)}
                  className="w-full bg-green-500 hover:bg-green-600 text-black py-4 font-pixel text-lg border-4 border-green-300 shadow-retro-lg active:shadow-inner-retro transition-all"
                  style={{ borderRadius: '4px' }}
                >
                  SELECT MODE
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-700 text-gray-500 py-4 font-pixel text-lg border-4 border-gray-600 cursor-not-allowed"
                  style={{ borderRadius: '4px' }}
                >
                  LOCKED
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Mode Selection Modal */}
        {showModeSelector && selectedGame && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border-4 border-cyan-500 rounded-lg p-6 max-w-2xl w-full">
              <h2 className="font-pixel text-3xl text-yellow-300 text-center mb-6">
                SELECT GAME MODE
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Competitive Mode */}
                <div className="bg-gradient-to-br from-red-900 to-purple-900 border-4 border-red-500 rounded-lg p-6 hover:scale-105 transition-transform">
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-2">⚔️</div>
                    <h3 className="font-pixel text-xl text-red-300 mb-2">COMPETITIVE</h3>
                    <p className="font-mono-game text-sm text-gray-300 mb-4">
                      1v1 Duel Mode
                    </p>
                  </div>

                  <div className="bg-black/40 p-4 rounded mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-mono-game text-xs text-gray-400">Entry Fee:</span>
                      <span className="font-pixel text-sm text-red-400">
                        {GAMES.find(g => g.id === selectedGame)?.competitiveEntry}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-mono-game text-xs text-gray-400">Win Prize:</span>
                      <span className="font-pixel text-sm text-yellow-400">
                        {GAMES.find(g => g.id === selectedGame)?.competitiveReward}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono-game text-xs text-gray-400">Match Type:</span>
                      <span className="font-pixel text-sm text-green-400">RANKED</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleModeSelect('competitive')}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 font-pixel border-4 border-red-400 shadow-retro-sm"
                    style={{ borderRadius: '4px' }}
                  >
                    ENTER ARENA
                  </button>
                </div>

                {/* Practice Mode */}
            {/* Practice Mode */}
<div className="bg-gradient-to-br from-blue-900 to-cyan-900 border-4 border-cyan-500 rounded-lg p-6 hover:scale-105 transition-transform">
  <div className="text-center mb-4">
    <div className="text-5xl mb-2">🎮</div>
    <h3 className="font-pixel text-xl text-cyan-300 mb-2">PRACTICE</h3>
    <p className="font-mono-game text-sm text-gray-300 mb-4">
      Solo Training Mode
    </p>
  </div>

  <div className="bg-black/40 p-4 rounded mb-4">
    <div className="flex justify-between mb-2">
      <span className="font-mono-game text-xs text-gray-400">Entry Fee:</span>
      <span className="font-pixel text-sm text-green-400">FREE</span>
    </div>
    <div className="flex justify-between mb-2">
      <span className="font-mono-game text-xs text-gray-400">Earn:</span>
      <span className="font-pixel text-sm text-cyan-400">+50 POINTS</span>
    </div>
    <div className="flex justify-between">
      <span className="font-mono-game text-xs text-gray-400">Match Type:</span>
      <span className="font-pixel text-sm text-yellow-400">CASUAL</span>
    </div>
  </div>

  <button
    onClick={() => handleModeSelect('practice')}
    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 font-pixel border-4 border-cyan-400 shadow-retro-sm"
    style={{ borderRadius: '4px' }}
  >
    EARN POINTS
  </button>
</div>

              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowModeSelector(false)}
                className="w-full mt-6 bg-gray-700 hover:bg-gray-600 text-white py-3 font-pixel border-2 border-gray-500"
                style={{ borderRadius: '4px' }}
              >
                CANCEL
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
