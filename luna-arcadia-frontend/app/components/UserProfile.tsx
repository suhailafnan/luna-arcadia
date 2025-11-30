"use client";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState, useEffect, useMemo } from "react";

export function UserProfile() {
  const { account } = useWallet();
  const [points, setPoints] = useState(0);

  // Derive referral code from account address using useMemo instead of state
  const referralCode = useMemo(() => {
    if (!account) return "";
    return account.address.toString().slice(0, 8).toUpperCase();
  }, [account]);

  useEffect(() => {
    if (account) {
      // Load points from localStorage asynchronously
      const loadPoints = async () => {
        const savedPoints = localStorage.getItem(`points_${account.address}`);
        setPoints(savedPoints ? parseInt(savedPoints) : 0);
      };
      loadPoints();
    }
  }, [account]);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    alert("REFERRAL CODE COPIED!");
  };

  if (!account) return null;

  return (
    <div className="arcade-panel mb-6">
      <h2 className="arcade-title text-xl mb-4">PLAYER STATS</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="stat-box">
          <div className="stat-label">WALLET</div>
          <div className="stat-value text-xs">
            {account.address.toString().slice(0, 6)}...{account.address.toString().slice(-4)}
          </div>
        </div>
        
        <div className="stat-box">
          <div className="stat-label">POINTS</div>
          <div className="stat-value text-2xl text-yellow-400">{points}</div>
        </div>
        
        <div className="stat-box col-span-2">
          <div className="stat-label">REFERRAL CODE</div>
          <div className="flex items-center gap-2">
            <div className="stat-value flex-1">{referralCode}</div>
            <button 
              onClick={copyReferralCode}
              className="arcade-button-small"
            >
              COPY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
