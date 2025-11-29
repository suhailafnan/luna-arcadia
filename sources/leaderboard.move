address WalletAddress {
  module Leaderboard {
    use std::vector;
    use aptos_framework::timestamp;
    use std::signer;
    use aptos_framework::event;
    use aptos_framework::account;

    // NEW: Create a struct to replace the tuple
    public struct PlayerScore has copy, drop, store {
       player: address,
       points: u64,
    }

    public struct LeaderboardData has key {
      points_10h: vector<PlayerScore>,
      points_24h: vector<PlayerScore>,
      points_weekly: vector<PlayerScore>,
      points_monthly: vector<PlayerScore>,
      last_reset_10h: u64,
      last_reset_24h: u64,
      last_reset_weekly: u64,
      last_reset_monthly: u64,
      prize_pool_10h: u64,
      prize_pool_24h: u64,
      prize_pool_weekly: u64,
      prize_pool_monthly: u64,
    }

      #[test_only]
public fun get_player_from_score(score: &PlayerScore): address {
  score.player
}

#[test_only]
public fun get_points_from_score(score: &PlayerScore): u64 {
  score.points
}

    // Test helper functions
    #[test_only]
    public fun get_points_10h_for_testing(account_addr: address): &vector<PlayerScore> acquires LeaderboardData {
      let lb = borrow_global<LeaderboardData>(account_addr);
      &lb.points_10h
    }

    #[test_only]
    public fun get_last_reset_10h_for_testing(account_addr: address): u64 acquires LeaderboardData {
      let lb = borrow_global<LeaderboardData>(account_addr);
      lb.last_reset_10h
    }

    #[test_only]
    public fun set_last_reset_10h_for_testing(account_addr: address, value: u64) acquires LeaderboardData {
      let lb = borrow_global_mut<LeaderboardData>(account_addr);
      lb.last_reset_10h = value;
    }

    public struct PointsUpdatedEvent has drop, store {
      player: address,
      points_added: u64,  // FIXED: removed "public" prefix - events don't need public fields
      tier_hours: u64,
    }

    public struct PrizePoolDepositedEvent has drop, store {
      amount: u64,
      tier_hours: u64,
    }

    public struct LeaderboardEvents has key {
      points_updated_events: event::EventHandle<PointsUpdatedEvent>,
      prize_pool_deposited_events: event::EventHandle<PrizePoolDepositedEvent>,
    }

    public entry fun init(account: &signer) {
      let addr = signer::address_of(account);
      assert!(!exists<LeaderboardData>(addr), 1);

      move_to(account, LeaderboardData {
        points_10h: vector::empty(),
        points_24h: vector::empty(),
        points_weekly: vector::empty(),
        points_monthly: vector::empty(),
        last_reset_10h: timestamp::now_seconds(),
        last_reset_24h: timestamp::now_seconds(),
        last_reset_weekly: timestamp::now_seconds(),
        last_reset_monthly: timestamp::now_seconds(),
        prize_pool_10h: 0,
        prize_pool_24h: 0,
        prize_pool_weekly: 0,
        prize_pool_monthly: 0,
      });

      move_to(account, LeaderboardEvents {
        points_updated_events: account::new_event_handle<PointsUpdatedEvent>(account),
        prize_pool_deposited_events: account::new_event_handle<PrizePoolDepositedEvent>(account),
      });
    }

    fun reset_leaderboard_if_needed(
      points_vec: &mut vector<PlayerScore>,
      last_reset: &mut u64,
      reset_interval_secs: u64
    ) {
      let now = timestamp::now_seconds();
      if (now >= *last_reset + reset_interval_secs) {
        while (!vector::is_empty(points_vec)) {
          vector::pop_back(points_vec);
        };
        *last_reset = now;
      }
    }

    public entry fun update_player_points(account: &signer, player: address, points: u64) acquires LeaderboardData, LeaderboardEvents {
      let addr = signer::address_of(account);
      let lb = borrow_global_mut<LeaderboardData>(addr);
      let events = borrow_global_mut<LeaderboardEvents>(addr);

      reset_leaderboard_if_needed(&mut lb.points_10h, &mut lb.last_reset_10h, 10 * 3600);
      reset_leaderboard_if_needed(&mut lb.points_24h, &mut lb.last_reset_24h, 24 * 3600);
      reset_leaderboard_if_needed(&mut lb.points_weekly, &mut lb.last_reset_weekly, 7 * 24 * 3600);
      reset_leaderboard_if_needed(&mut lb.points_monthly, &mut lb.last_reset_monthly, 30 * 24 * 3600);

      update_points(&mut lb.points_10h, player, points);
      update_points(&mut lb.points_24h, player, points);
      update_points(&mut lb.points_weekly, player, points);
      update_points(&mut lb.points_monthly, player, points);

      event::emit_event(&mut events.points_updated_events, PointsUpdatedEvent {
        player,
        points_added: points,
        tier_hours: 10,
      });
    }

    fun update_points(points_vector: &mut vector<PlayerScore>, player: address, new_points: u64) {
      let len = vector::length(points_vector);
      let i = 0;
      while (i < len) {
        let entry = vector::borrow_mut(points_vector, i);
        
        if (entry.player == player) {
          entry.points = entry.points + new_points;
          return
        };
        i = i + 1;
      };
      
      vector::push_back(points_vector, PlayerScore { player, points: new_points });
    }

    public entry fun add_to_prize_pool(account: &signer, amount: u64, tier_hours: u64) acquires LeaderboardData, LeaderboardEvents {
      let addr = signer::address_of(account);
      let lb = borrow_global_mut<LeaderboardData>(addr);
      let events = borrow_global_mut<LeaderboardEvents>(addr);

      if (tier_hours == 10) {
        lb.prize_pool_10h = lb.prize_pool_10h + amount;
      } else if (tier_hours == 24) {
        lb.prize_pool_24h = lb.prize_pool_24h + amount;
      } else if (tier_hours == 168) {
        lb.prize_pool_weekly = lb.prize_pool_weekly + amount;
      } else if (tier_hours == 720) {
        lb.prize_pool_monthly = lb.prize_pool_monthly + amount;
      };

      event::emit_event(&mut events.prize_pool_deposited_events, PrizePoolDepositedEvent {
        amount,
        tier_hours,
      });
    }

    fun sort_points_desc(points: &mut vector<PlayerScore>) {
      let len = vector::length(points);
      let i = 0;
      while (i < len) {
        let j = 0;
        while (j < len - 1 - i) {
          let p1 = vector::borrow(points, j);
          let p2 = vector::borrow(points, j + 1);
          
          if (p1.points < p2.points) {
            vector::swap(points, j, j + 1);
          };
          j = j + 1;
        };
        i = i + 1;
      }
    }

    public fun get_top_players(points_vec: &mut vector<PlayerScore>, count: u64): vector<PlayerScore> {
      sort_points_desc(points_vec);
      let len = vector::length(points_vec);
      let limit = if (len < count) { len } else { count };
      let result = vector::empty();
      let i = 0;
      while (i < limit) {
        let entry = *vector::borrow(points_vec, i);
        vector::push_back(&mut result, entry);
        i = i + 1;
      };
      result
    }

    #[view]
    public fun get_top_10h(account_addr: address, count: u64): vector<PlayerScore> acquires LeaderboardData {
      let lb = borrow_global_mut<LeaderboardData>(account_addr);
      get_top_players(&mut lb.points_10h, count)
    }

    #[view]
    public fun get_top_24h(account_addr: address, count: u64): vector<PlayerScore> acquires LeaderboardData {
      let lb = borrow_global_mut<LeaderboardData>(account_addr);
      get_top_players(&mut lb.points_24h, count)
    }

    #[view]
    public fun get_top_weekly(account_addr: address, count: u64): vector<PlayerScore> acquires LeaderboardData {
      let lb = borrow_global_mut<LeaderboardData>(account_addr);
      get_top_players(&mut lb.points_weekly, count)
    }

    #[view]
    public fun get_top_monthly(account_addr: address, count: u64): vector<PlayerScore> acquires LeaderboardData {
      let lb = borrow_global_mut<LeaderboardData>(account_addr);
      get_top_players(&mut lb.points_monthly, count)
    }
  }
}