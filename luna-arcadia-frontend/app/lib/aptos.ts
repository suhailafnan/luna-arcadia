import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const config = new AptosConfig({ 
  network: Network.TESTNET 
});

export const aptos = new Aptos(config);

export const MODULE_ADDRESS = process.env.NEXT_PUBLIC_MODULE_ADDRESS!;

// Get top players from leaderboard
export async function getTopPlayers(
  tier: "10h" | "24h" | "weekly" | "monthly", 
  count: number
) {
  try {
    const result = await aptos.view({
      payload: {
        function: `${MODULE_ADDRESS}::Leaderboard::get_top_${tier}`,
        typeArguments: [],
        functionArguments: [MODULE_ADDRESS, count],
      }
    });
    
    return result[0] as Array<{ player: string; points: number }>;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}
