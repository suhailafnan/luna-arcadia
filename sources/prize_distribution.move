address  WalletAddress {

  module PrizeDistribution {
    use std::vector;
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::event;
    use aptos_framework::account;

    /// Prize pool balances per tier (hours)
    public struct PrizePool has key {
      pool_10h: u64,
      pool_24h: u64,
      pool_weekly: u64,
      pool_monthly: u64,
      owner: address,  // contract owner for access control
    }

    public struct PrizePoolDepositedEvent has drop, store {
      amount: u64,
      tier_hours: u64,
    }

    public struct PrizePayoutEvent has drop, store {
      recipient: address,
      amount: u64,
      tier_hours: u64,
    }

    public struct PrizeDistributionEvents has key {
      prize_pool_deposited_events: event::EventHandle<PrizePoolDepositedEvent>,
      prize_payout_events: event::EventHandle<PrizePayoutEvent>,
    }

     // Add these test helper functions to your PrizeDistribution module

#[test_only]
public fun get_pool_10h_for_testing(account_addr: address): u64 acquires PrizePool {
  let pool = borrow_global<PrizePool>(account_addr);
  pool.pool_10h
}

#[test_only]
public fun get_pool_24h_for_testing(account_addr: address): u64 acquires PrizePool {
  let pool = borrow_global<PrizePool>(account_addr);
  pool.pool_24h
}

#[test_only]
public fun get_pool_weekly_for_testing(account_addr: address): u64 acquires PrizePool {
  let pool = borrow_global<PrizePool>(account_addr);
  pool.pool_weekly
}

#[test_only]
public fun get_pool_monthly_for_testing(account_addr: address): u64 acquires PrizePool {
  let pool = borrow_global<PrizePool>(account_addr);
  pool.pool_monthly
}

    /// Initialize prize pools with owner set to creator
    public entry fun init(account: &signer) {
      let addr = signer::address_of(account);
      assert!(!exists<PrizePool>(addr), 1);
      
      move_to(account, PrizePool {
        pool_10h: 0,
        pool_24h: 0,
        pool_weekly: 0,
        pool_monthly: 0,
        owner: addr,
      });

      move_to(account, PrizeDistributionEvents {
        prize_pool_deposited_events: account::new_event_handle<PrizePoolDepositedEvent>(account),
        prize_payout_events: account::new_event_handle<PrizePayoutEvent>(account),
      });
    }

    /// Helper function to assert owner access
    fun assert_owner(account: &signer, owner_addr: address) {
      assert!(signer::address_of(account) == owner_addr, 100);
    }

    /// Add funds to a prize pool tier
    public entry fun add_to_pool(account: &signer, tier_hours: u64, amount: u64) acquires PrizePool, PrizeDistributionEvents {
      let addr = signer::address_of(account);
      let pool = borrow_global_mut<PrizePool>(addr);
      let events = borrow_global_mut<PrizeDistributionEvents>(addr);
      
      // Access control: only owner can add to pool
      assert_owner(account, pool.owner);

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

      event::emit_event(&mut events.prize_pool_deposited_events, PrizePoolDepositedEvent {
        amount,
        tier_hours,
      });
    }

    /// Distribute prize pool to winners equally
    public entry fun distribute_prize(
      account: &signer,
      tier_hours: u64,
      winners: vector<address>, // top winners' addresses
      total_prize: u64 // total prize amount to distribute
    ) acquires PrizePool, PrizeDistributionEvents {
      let addr = signer::address_of(account);
      let pool = borrow_global_mut<PrizePool>(addr);
      let events = borrow_global_mut<PrizeDistributionEvents>(addr);

      // Access control: only owner can distribute payouts
      assert_owner(account, pool.owner);

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

      // Transfer coins to winners and emit events
      let i = 0;
      while (i < count) {
        let winner = *vector::borrow(&winners, i);
        coin::transfer<AptosCoin>(account, winner, share);
        
        event::emit_event(&mut events.prize_payout_events, PrizePayoutEvent {
          recipient: winner,
          amount: share,
          tier_hours,
        });
        
        i = i + 1;
      };
    }
  }
}