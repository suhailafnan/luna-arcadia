"use client";
import { useState, useMemo } from 'react';

// Mock data for demonstration
const MOCK_USER_STATS = {
  username: "PLAYER_001",
  credits: 5,
  tokens: 12450,
  rank: 42,
  referralCode: "ARC42XYZ"
};

const MOCK_LEADERBOARD_DATA = [
  { rank: 1, player: "0x1a2b...3c4d", score: 125000, isUser: false },
  { rank: 2, player: "0x5e6f...7g8h", score: 118500, isUser: false },
  { rank: 3, player: "0x9i0j...1k2l", score: 112300, isUser: false },
  { rank: 4, player: "0x3m4n...5o6p", score: 108900, isUser: false },
  { rank: 5, player: "0x7q8r...9s0t", score: 105200, isUser: false },
  { rank: 42, player: "YOU", score: 98245, isUser: true },
];

interface ConnectedDashboardProps {
  account: {
    address: string;
  };
  disconnect: () => void;
}

const ConnectedDashboard = ({ account, disconnect }: ConnectedDashboardProps) => {
  const [activeTab, setActiveTab] = useState('WEEKLY'); // WEEKLY, DAILY, MONTHLY
  const [activeScreen, setActiveScreen] = useState('DASHBOARD'); // DASHBOARD, PROFILE, REFERRAL

  const address = account.address.toString();
  const userData = MOCK_USER_STATS;

  // Memoized function to render the leaderboard rows
  const renderLeaderboard = useMemo(() => {
    return MOCK_LEADERBOARD_DATA.map((row) => {
      const isTop3 = row.rank <= 3;
      const rankColor = isTop3 ? 'text-yellow-400' : row.isUser ? 'text-red-400' : 'text-gray-300';
      const playerColor = row.isUser ? 'text-red-400' : 'text-white';
      const scoreColor = isTop3 ? 'text-yellow-400' : row.isUser ? 'text-red-400' : 'text-lime-400';
      
      const rowStyle = row.isUser 
        ? "flex p-2 font-mono-game bg-indigo-800 border-t-2 border-b-2 border-red-500 shadow-neon-sm" 
        : "flex p-2 font-mono-game border-b-2 border-gray-700 hover:bg-gray-800 transition-colors";

      return (
        <div key={row.rank} className={rowStyle}>
          <span className={`w-1/6 font-bold ${rankColor}`}>{row.rank}</span>
          <span className={`w-3/6 ${playerColor} truncate`}>{row.player}</span>
          <span className={`w-2/6 text-right font-bold ${scoreColor}`}>{row.score.toLocaleString()}</span>
        </div>
      );
    });
  }, [activeTab]);


  // Simple Navigation Logic
  let screenContent;
  if (activeScreen === 'PROFILE') {
    screenContent = (
      <div className="p-4 text-white bg-gray-900 border-2 border-white/50 shadow-inner-retro min-h-[300px]">
        <h3 className="font-pixel text-xl text-lime-400 mb-4"> PLAYER PROFILE </h3>
        <p className="font-mono-game text-lg mb-2"><span className="text-cyan-400">USER ID:</span> {userData.username}</p>
        <p className="font-mono-game text-lg mb-2"><span className="text-cyan-400">APTOS ADDRESS:</span> {address.slice(0, 10)}...</p>
        <p className="font-mono-game text-lg mb-4"><span className="text-cyan-400">HIGHEST SCORE:</span> 98,245</p>
        <button
          onClick={disconnect}
          className="w-full mt-4 bg-red-700 text-white text-md font-pixel px-4 py-3 border-2 border-red-500 shadow-retro-sm hover:bg-red-600 transition-colors duration-150"
          style={{ borderRadius: '2px' }}
        >
          LOG OUT OF ARCADIA
        </button>
      </div>
    );
  } else if (activeScreen === 'REFERRAL') {
    screenContent = (
      <div className="p-4 text-white bg-gray-900 border-2 border-white/50 shadow-inner-retro min-h-[300px] text-center">
        <h3 className="font-pixel text-xl text-yellow-400 mb-4">REFERRAL CODE </h3>
        <p className="font-mono-game text-lg mb-4">SHARE THIS CODE WITH NEW PLAYERS:</p>
        <div className="bg-gray-800 border-2 border-yellow-400 p-4 shadow-neon-sm inline-block">
          <p className="font-pixel text-3xl text-yellow-400">{userData.referralCode}</p>
        </div>
        <p className="font-mono-game text-sm text-lime-400 mt-4">REWARD: 10 TOKENS PER NEW PLAYER!</p>
        <button
          className="w-full mt-8 bg-cyan-700 text-white text-md font-pixel px-4 py-3 border-2 border-cyan-500 shadow-retro-sm hover:bg-cyan-600 transition-colors duration-150"
          style={{ borderRadius: '2px' }}
          onClick={() => {
            navigator.clipboard.writeText(userData.referralCode).then(() => {
              console.log("Referral code copied!");
            }).catch(() => {
              // Fallback for older browsers
              const tempInput = document.createElement('textarea');
              tempInput.value = userData.referralCode;
              document.body.appendChild(tempInput);
              tempInput.select();
              document.execCommand('copy');
              document.body.removeChild(tempInput);
              console.log("Referral code copied!");
            });
          }}
        >
          COPY CODE
        </button>
      </div>
    );
  } else {
    // DASHBOARD (Default view)
    screenContent = (
      <>
        {/* MAIN ACTION AREA: The Central Play Button */}
        <div className="text-center mb-6">
          <button 
            className="inline-block px-10 py-5 bg-green-500 hover:bg-green-600 text-gray-900 text-2xl font-pixel shadow-retro-lg border-4 border-green-300 active:shadow-inner-retro transition duration-150 ease-in-out transform hover:scale-[1.02]"
            style={{ borderRadius: '4px' }}
          >
            PLAY LUNA BLITZ!
            <span className="text-sm block font-mono-game mt-1 text-green-800">(-1 CREDIT)</span>
          </button>
        </div>

        {/* LEADERBOARDS: Competitive Focus */}
        <div className="leaderboard-container flex-grow p-3 bg-gray-900 border-4 border-indigo-400 shadow-inner-retro">
          <h2 className="font-pixel text-xl text-center mb-4 text-indigo-300 tracking-wider">GLOBAL HIGH SCORES</h2>
          
          {/* Tabs */}
          <div className="flex justify-center space-x-2 mb-4">
            {['WEEKLY', 'DAILY', 'MONTHLY'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-sm font-pixel border-2 shadow-retro-sm transition-colors duration-150 ${
                  activeTab === tab 
                    ? 'bg-indigo-400 text-gray-900 border-indigo-200'
                    : 'bg-indigo-700 text-white border-indigo-500 hover:bg-indigo-600'
                }`}
                style={{ borderRadius: '2px' }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Leaderboard Table */}
          <div className="overflow-x-auto rounded-lg">
            <div className="min-w-full">
              <div className="flex text-xs uppercase font-pixel bg-indigo-900/50 p-2 border-b-2 border-indigo-400">
                <span className="w-1/6">RANK</span>
                <span className="w-3/6">PLAYER ID</span>
                <span className="w-2/6 text-right">SCORE</span>
              </div>
              
              {/* Dynamic Rows */}
              <div className="max-h-64 overflow-y-auto">
                {renderLeaderboard}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }


  // ARCADE FRAME CONTAINER
  return (
    <div className="arcade-frame max-w-lg mx-auto bg-gray-950 border-8 border-cyan-600 shadow-retro-lg p-3 sm:p-5 min-h-[500px]">
      
      {/* HEADER BAR: Logo, Profile, and Referral Links */}
      <header className="p-3 mb-4 flex justify-between items-center border-b-4 border-dashed border-cyan-400">
        <h1 
            className="font-pixel text-xl sm:text-2xl text-yellow-300 tracking-widest"
            style={{ textShadow: '1px 1px 0 #FFD700, 2px 2px 0 #FF8C00' }} 
        >
            LUNA ARCADIA
        </h1>
        <div className="flex space-x-2 text-sm">
          <button 
            onClick={() => setActiveScreen('PROFILE')}
            className={`px-3 py-1 text-white text-xs sm:text-sm font-pixel border-2 shadow-retro-sm transition-colors duration-150 ${activeScreen === 'PROFILE' ? 'bg-purple-500 border-white' : 'bg-purple-700 border-purple-500 hover:bg-purple-600'}`}
            style={{ borderRadius: '2px' }}
          >
            👤 PROFILE
          </button>
          <button 
            onClick={() => setActiveScreen('REFERRAL')}
            className={`px-3 py-1 text-white text-xs sm:text-sm font-pixel border-2 shadow-retro-sm transition-colors duration-150 ${activeScreen === 'REFERRAL' ? 'bg-red-500 border-white' : 'bg-red-700 border-red-500 hover:bg-red-600'}`}
            style={{ borderRadius: '2px' }}
          >
            🎁 REFERRAL
          </button>
        </div>
      </header>

      {/* STATUS BAR: Energy, Tokens, and Rank */}
      <div className="status-bar p-3 mb-6 bg-gray-900 border-4 border-yellow-400 shadow-inner-retro">
        <div className="flex justify-between items-center font-mono-game text-xl">
          {/* Energy Display (Credits) */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-yellow-400 uppercase leading-none">CREDITS</span>
            <span className="text-white text-2xl font-bold">{userData.credits}</span>
          </div>
          {/* Tokens */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-lime-400 uppercase leading-none">TOKENS</span>
            <span className="text-white text-2xl font-bold">{userData.tokens.toLocaleString()}</span>
          </div>
          {/* Rank */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-red-500 uppercase leading-none">RANK</span>
            <span className="text-red-400 text-2xl font-bold">#{userData.rank}</span>
          </div>
          {/* Back button for sub-screens */}
          {activeScreen !== 'DASHBOARD' && (
             <button 
                onClick={() => setActiveScreen('DASHBOARD')}
                className="px-3 py-1 bg-gray-700 text-white text-xs font-pixel border-2 border-gray-500 shadow-retro-sm hover:bg-gray-600"
                style={{ borderRadius: '2px' }}
              >
                &lt; BACK
              </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow">
        {screenContent}
      </div>
      
      {/* FOOTER HINT */}
      <footer className="p-2 mt-4 text-center border-t-2 border-dashed border-gray-700">
        <p className="text-xs text-gray-500 font-mono-game">APTOS WALLET ID: {address.slice(0, 4)}...{address.slice(-4)}</p>
      </footer>
    </div>
  );
};

export default ConnectedDashboard;