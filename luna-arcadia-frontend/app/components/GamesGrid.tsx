"use client";
import { useRouter } from "next/navigation";

const GAMES = [
  { id: "rock-paper-scissors", name: "ROCK PAPER SCISSORS", icon: "✊✋✌️", reward: 10 },
  { id: "number-guess", name: "NUMBER GUESSER", icon: "🎲", reward: 15 },
  { id: "memory-match", name: "MEMORY MATCH", icon: "🧠", reward: 20 },
  { id: "quick-click", name: "QUICK CLICKER", icon: "⚡", reward: 5 },
];

export function GamesGrid() {
  const router = useRouter();

  return (
    <div className="arcade-panel">
      <h2 className="arcade-title text-xl mb-4">ARCADE GAMES</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {GAMES.map((game) => (
          <button
            key={game.id}
            onClick={() => router.push(`/game/${game.id}`)}
            className="game-card"
          >
            <div className="game-icon">{game.icon}</div>
            <div className="game-name">{game.name}</div>
            <div className="game-reward">+{game.reward} PTS</div>
          </button>
        ))}
      </div>
    </div>
  );
}
