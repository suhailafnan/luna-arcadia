address WalletAddress {
    #[test_only]
    module LeaderboardTest {
        use std::vector;
        use std::signer;
        use WalletAddress::Leaderboard;


        #[test(account = @WalletAddress)]
        public fun test_init_and_update_points(account: &signer) {
            // Initialize leaderboard
            Leaderboard::init(account);
            
            // Update points for player
            let player = @0x123;
            Leaderboard::update_player_points(account, player, 10);
            
            // Use getter function instead of direct field access
            let addr = signer::address_of(account);
            let points_10h = Leaderboard::get_points_10h_for_testing(addr);
            
            assert!(vector::length(points_10h) == 1, 1);
            
            let entry = vector::borrow(points_10h, 0);
            
            // FIX: Use the actual public accessor functions from the Leaderboard module
            assert!(Leaderboard::get_player_from_score(entry) == player, 2);
            assert!(Leaderboard::get_points_from_score(entry) == 10, 3);
        }

        #[test(account = @WalletAddress)]
        public fun test_reset_leaderboard(account: &signer) {
            // Initialize leaderboard
            Leaderboard::init(account);
            
            let player = @0x123;
            Leaderboard::update_player_points(account, player, 10);
            
            // Use setter and getter functions for testing time reset logic
            let addr = signer::address_of(account);
            let current_reset = Leaderboard::get_last_reset_10h_for_testing(addr);
            let new_reset = current_reset - (11 * 3600); // Set time back more than 10 hours
            Leaderboard::set_last_reset_10h_for_testing(addr, new_reset);
            
            // Trigger update which will reset leaderboard (because time passed)
            Leaderboard::update_player_points(account, player, 5);
            
            let points_10h = Leaderboard::get_points_10h_for_testing(addr);
            
            // After reset, points vector should have 1 entry with points 5 only
            assert!(vector::length(points_10h) == 1, 4);
            
            let entry = vector::borrow(points_10h, 0);
            
            // FIX: Use the actual public accessor functions from the Leaderboard module
            assert!(Leaderboard::get_player_from_score(entry) == player, 5);
            assert!(Leaderboard::get_points_from_score(entry) == 5, 6);
        }
    }
}