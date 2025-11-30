"use client";
import { useState, useEffect } from "react";

interface LeaderboardEntry {
  address: string;
  points: number;
  rank: number;
}

export function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);

  const loadLeaderboard = () => {
    // Load all scores from localStorage
    const allScores: LeaderboardEntry[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('points_')) {
        const address = key.replace('points_', '');
        const points = parseInt(localStorage.getItem(key) || '0');
        allScores.push({ address, points, rank: 0 });
      }
    }
    
    // Sort by points and assign ranks
    allScores.sort((a, b) => b.points - a.points);
    allScores.forEach((entry, index) => {
      entry.rank = index + 1;
    });
    
    setLeaders(allScores.slice(0, 10)); // Top 10
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      loadLeaderboard();
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="arcade-panel mb-6">
      <h2 className="arcade-title text-xl mb-4">TOP PLAYERS</h2>
      
      <div className="leaderboard-screen">
        {leaders.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            NO SCORES YET<br/>BE THE FIRST!
          </div>
        ) : (
          <div className="space-y-2">
            {leaders.map((entry) => (
              <div key={entry.address} className="leaderboard-entry">
                <span className="rank">#{entry.rank}</span>
                <span className="player-address">
                  {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                </span>
                <span className="score">{entry.points} PTS</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
