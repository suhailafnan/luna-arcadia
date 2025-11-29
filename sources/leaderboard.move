address  WalletAddress {
 
  module Leaderboard {
    use std::vector;
    use aptos_framework::timestamp;
    use std::signer;

    struct LeaderboardData has key {
      points_10h: vector<(address, u64)>,
      points_24h: vector<(address, u64)>,
      points_weekly: vector<(address, u64)>,
      points_monthly: vector<(address, u64)>,
      last_reset_10h: u64,
      last_reset_24h: u64,
      last_reset_weekly: u64,
      last_reset_monthly: u64,
      prize_pool_10h: u64,
      prize_pool_24h: u64,
      prize_pool_weekly: u64,
      prize_pool_monthly: u64,
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
    }

   fun reset_leaderboard_if_needed(
  points_vec: &mut vector<(address, u64)>,
  last_reset: &mut u64,
  reset_interval_secs: u64
) {
  let now = timestamp::now_seconds();
  if (now >= *last_reset + reset_interval_secs) {
    // Clear the vector by removing elements from the end
    while (!vector::is_empty(points_vec)) {
      vector::pop_back(points_vec);
    };
    *last_reset = now;
  }
}

    public entry fun update_player_points(account: &signer, player: address, points: u64) acquires LeaderboardData {
      let addr = signer::address_of(account);
      let lb = borrow_global_mut<LeaderboardData>(addr);

      // Reset leaderboards if time windows have elapsed
      reset_leaderboard_if_needed(&mut lb.points_10h, &mut lb.last_reset_10h, 10 * 3600);
      reset_leaderboard_if_needed(&mut lb.points_24h, &mut lb.last_reset_24h, 24 * 3600);
      reset_leaderboard_if_needed(&mut lb.points_weekly, &mut lb.last_reset_weekly, 7 * 24 * 3600);
      reset_leaderboard_if_needed(&mut lb.points_monthly, &mut lb.last_reset_monthly, 30 * 24 * 3600);

      // Update player points in all leaderboards
      update_points(&mut lb.points_10h, player, points);
      update_points(&mut lb.points_24h, player, points);
      update_points(&mut lb.points_weekly, player, points);
      update_points(&mut lb.points_monthly, player, points);
    }

    fun update_points(points_vector: &mut vector<(address, u64)>, player: address, new_points: u64) {
      let len = vector::length(points_vector);
      let i = 0;
      while (i < len) {
        let entry = vector::borrow_mut(points_vector, i);
        let (addr, pts) = *entry;
        
        if (addr == player) {
          *entry = (addr, pts + new_points);
          return
        };
        i = i + 1;
      };
      
      vector::push_back(points_vector, (player, new_points));
    }

    public entry fun add_to_prize_pool(account: &signer, amount: u64, tier_hours: u64) acquires LeaderboardData {
      let addr = signer::address_of(account);
      let lb = borrow_global_mut<LeaderboardData>(addr);

      if (tier_hours == 10) {
        lb.prize_pool_10h = lb.prize_pool_10h + amount;
      } else if (tier_hours == 24) {
        lb.prize_pool_24h = lb.prize_pool_24h + amount;
      } else if (tier_hours == 168) {
        lb.prize_pool_weekly = lb.prize_pool_weekly + amount;
      } else if (tier_hours == 720) {
        lb.prize_pool_monthly = lb.prize_pool_monthly + amount;
      }
    }

    // TODO: Implement payout logic here or call PrizeDistribution module payout functions
  }
}