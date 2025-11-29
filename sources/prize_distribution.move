address  WalletAddress {

  module PrizeDistribution {
    use std::vector;
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    /// Prize pool balances per tier (hours)
    struct PrizePool has key {
      pool_10h: u64,
      pool_24h: u64,
      pool_weekly: u64,
      pool_monthly: u64,
    }

    /// Initialize prize pools
    public entry fun init(account: &signer) {
      let addr = signer::address_of(account);
      assert!(!exists<PrizePool>(addr), 1);
      move_to(account, PrizePool {
        pool_10h: 0,
        pool_24h: 0,
        pool_weekly: 0,
        pool_monthly: 0,
      });
    }

    /// Add funds to a prize pool tier
    public entry fun add_to_pool(account: &signer, tier_hours: u64, amount: u64) acquires PrizePool {
      let addr = signer::address_of(account);
      let pool = borrow_global_mut<PrizePool>(addr);

      if (tier_hours == 10) {
        pool.pool_10h = pool.pool_10h + amount;
      } else if (tier_hours == 24) {
        pool.pool_24h = pool.pool_24h + amount;
      } else if (tier_hours == 168) {
        pool.pool_weekly = pool.pool_weekly + amount;
      } else if (tier_hours == 720) {
        pool.pool_monthly = pool.pool_monthly + amount;
      } else {
        abort 2  // invalid tier
      };
    }

    /// Distribute prize pool to winners equally
    public entry fun distribute_prize(
      account: &signer,
      tier_hours: u64,
      winners: vector<address>, // top winners' addresses
      total_prize: u64 // total prize amount to distribute
    ) acquires PrizePool {
      let addr = signer::address_of(account);
      let pool = borrow_global_mut<PrizePool>(addr);

      // Calculate share per winner
      let count = vector::length(&winners);
      assert!(count > 0, 3);

      let share = total_prize / count;

      // Deduct from pool
      if (tier_hours == 10) {
        assert!(pool.pool_10h >= total_prize, 4);
        pool.pool_10h = pool.pool_10h - total_prize;
      } else if (tier_hours == 24) {
        assert!(pool.pool_24h >= total_prize, 4);
        pool.pool_24h = pool.pool_24h - total_prize;
      } else if (tier_hours == 168) {
        assert!(pool.pool_weekly >= total_prize, 4);
        pool.pool_weekly = pool.pool_weekly - total_prize;
      } else if (tier_hours == 720) {
        assert!(pool.pool_monthly >= total_prize, 4);
        pool.pool_monthly = pool.pool_monthly - total_prize;
      } else {
        abort 2
      };

      // Transfer to each winner
      let i = 0;
      while (i < count) {
        let winner = *vector::borrow(&winners, i);
        // Transfer coins to winner
        coin::transfer<AptosCoin>(account, winner, share);
        i = i + 1;
      };
    }
  }
}