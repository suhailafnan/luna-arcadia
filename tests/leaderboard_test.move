address WalletAddress {
    #[test_only]
    module LeaderboardTest {
        use std::vector;
        use std::signer;
        use aptos_framework::timestamp;
        use WalletAddress::Leaderboard;

        #[test(aptos_framework = @0x1, account = @WalletAddress)]
        public fun test_init_and_update_points(aptos_framework: &signer, account: &signer) {
            // Set up timestamp for testing
            timestamp::set_time_has_started_for_testing(aptos_framework);
            
            // Initialize leaderboard
            Leaderboard::init(account);
            
            // Update points for player
            let player = @0x123;
            Leaderboard::update_player_points(account, player, 10);
            
            // Use getter function instead of direct field access
            let addr = signer::address_of(account);
            let points_10h = Leaderboard::get_points_10h_for_testing(addr);
            
            assert!(vector::length(&points_10h) == 1, 1);
            
            let entry = vector::borrow(&points_10h, 0);
            
            // Use the actual public accessor functions from the Leaderboard module
            assert!(Leaderboard::get_player_from_score(entry) == player, 2);
            assert!(Leaderboard::get_points_from_score(entry) == 10, 3);
        }

        #[test(aptos_framework = @0x1, account = @WalletAddress)]
        public fun test_reset_leaderboard(aptos_framework: &signer, account: &signer) {
            // Set up timestamp for testing
            timestamp::set_time_has_started_for_testing(aptos_framework);
            
            // Initialize leaderboard
            Leaderboard::init(account);
            
            let player = @0x123;
            Leaderboard::update_player_points(account, player, 10);
            
            // Fast forward time by more than 10 hours (11 hours = 39600 seconds)
            timestamp::fast_forward_seconds(39600);
            
            // Trigger update which will reset leaderboard (because time passed)
            Leaderboard::update_player_points(account, player, 5);
            
            let addr = signer::address_of(account);
            let points_10h = Leaderboard::get_points_10h_for_testing(addr);
            
            // After reset, points vector should have 1 entry with points 5 only
            assert!(vector::length(&points_10h) == 1, 4);
            
            let entry = vector::borrow(&points_10h, 0);
            
            // Use the actual public accessor functions from the Leaderboard module
            assert!(Leaderboard::get_player_from_score(entry) == player, 5);
            assert!(Leaderboard::get_points_from_score(entry) == 5, 6);
        }
    }
}
