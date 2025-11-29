address WalletAddress {
  #[test_only]
  module PrizeDistributionTest {
    use std::vector;
    use std::signer;
    use WalletAddress::PrizeDistribution;

    #[test(account = @WalletAddress)]
    public fun test_init_and_add_to_pool(account: &signer) {
      // Initialize prize distribution
      PrizeDistribution::init(account);
      
      // Add to pool
      PrizeDistribution::add_to_pool(account, 10, 1000);
      
      // Check pool balance using getter
      let addr = signer::address_of(account);
      let pool_10h = PrizeDistribution::get_pool_10h_for_testing(addr);
      assert!(pool_10h == 1000, 1);
    }

    #[test(account = @WalletAddress)]
    #[expected_failure(abort_code = 4, location = WalletAddress::PrizeDistribution)]
    public fun test_distribute_prize_insufficient_funds(account: &signer) {
      // Initialize prize distribution
      PrizeDistribution::init(account);
      
      // Add insufficient funds to 10h pool
      PrizeDistribution::add_to_pool(account, 10, 500);
      
      // Prepare winners
      let winners = vector::empty<address>();
      vector::push_back(&mut winners, @0x123);
      vector::push_back(&mut winners, @0x456);
      
      // This should fail with abort code 4 (insufficient funds)
      PrizeDistribution::distribute_prize(account, 10, winners, 1000);
    }

    #[test(account = @WalletAddress)]
    public fun test_add_to_multiple_pools(account: &signer) {
      // Initialize prize distribution
      PrizeDistribution::init(account);
      
      // Add to different pools
      PrizeDistribution::add_to_pool(account, 10, 1000);
      PrizeDistribution::add_to_pool(account, 24, 2000);
      PrizeDistribution::add_to_pool(account, 168, 3000);
      PrizeDistribution::add_to_pool(account, 720, 4000);
      
      // Check all pool balances using getters
      let addr = signer::address_of(account);
      assert!(PrizeDistribution::get_pool_10h_for_testing(addr) == 1000, 1);
      assert!(PrizeDistribution::get_pool_24h_for_testing(addr) == 2000, 2);
      assert!(PrizeDistribution::get_pool_weekly_for_testing(addr) == 3000, 3);
      assert!(PrizeDistribution::get_pool_monthly_for_testing(addr) == 4000, 4);
    }

    #[test(account = @WalletAddress)]
    public fun test_pool_deduction_after_distribution(account: &signer) {
      // Initialize prize distribution
      PrizeDistribution::init(account);
      
      // Add fund to 10h pool
      PrizeDistribution::add_to_pool(account, 10, 1000);
      
      let addr = signer::address_of(account);
      let pool_10h = PrizeDistribution::get_pool_10h_for_testing(addr);
      assert!(pool_10h == 1000, 1);
    }

    #[test(account = @WalletAddress)]
    #[expected_failure(abort_code = 2, location = WalletAddress::PrizeDistribution)]
    public fun test_invalid_tier(account: &signer) {
      // Initialize prize distribution
      PrizeDistribution::init(account);
      
      // Try to add to invalid tier (should abort with code 2)
      PrizeDistribution::add_to_pool(account, 99, 1000);
    }

    #[test(account = @WalletAddress)]
    #[expected_failure(abort_code = 3, location = WalletAddress::PrizeDistribution)]
    public fun test_distribute_with_no_winners(account: &signer) {
      // Initialize prize distribution
      PrizeDistribution::init(account);
      
      // Add funds
      PrizeDistribution::add_to_pool(account, 10, 1000);
      
      // Empty winners vector (should abort with code 3)
      let winners = vector::empty<address>();
      PrizeDistribution::distribute_prize(account, 10, winners, 1000);
    }
  }
}