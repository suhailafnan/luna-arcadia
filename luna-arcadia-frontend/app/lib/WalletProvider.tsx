"use client";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { PropsWithChildren } from "react";

export function WalletProvider({ children }: PropsWithChildren) {
  return (
    <AptosWalletAdapterProvider>
      {children}
    </AptosWalletAdapterProvider>
  );
}
