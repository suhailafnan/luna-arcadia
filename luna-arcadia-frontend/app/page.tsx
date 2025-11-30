// "use client";
// import { WalletProvider } from "./components/WalletConnect";

// export default function Home() {
//   return (
//     <WalletProvider>
// <div className="min-h-screen bg-[#1f1f47] flex items-center justify-center p-4"></div>
//     </WalletProvider>
    
     
    
//   );
// }

// "use client";

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-red-500 flex items-center justify-center p-4">
//       <h1 className="text-white text-4xl">TEST - CAN YOU SEE THIS?</h1>
//     </div>
//   );
// }


"use client";
import { WalletConnect } from "./components/WalletConnect";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1f1f47] flex items-center justify-center p-4">
      <WalletConnect />
    </div>
  );
}
