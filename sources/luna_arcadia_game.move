address 0xf0c29b2a4d46010effaf11d67762f64881f14be4c1bc1b2ce88f6c7d67321283 {
  module LunaArcadiaGame {
    use std::signer;
    use std::vector;
    
    use std::option;
    use aptos_framework::timestamp;

    struct Player has copy, drop, store {
      addr: address,
      points: u64,
      referrals: u64,
      referral_code: vector<u8>,
      referred_by: option::Option<address>,
      last_active: u64,
    }

    struct PlayerEntry has copy, drop, store {
      key: address,
      player: Player,
    }

    struct ReferralEntry has copy, drop, store {
      key: vector<u8>,
      addr: address,
    }

    struct PlayerStore has key {
      players: vector<PlayerEntry>,
      referral_map: vector<ReferralEntry>,
      next_referral_number: u64,
    }

    public entry fun init(account: &signer) {
      let addr = signer::address_of(account);
      assert!(!exists<PlayerStore>(addr), 1);
      move_to(account, PlayerStore {
        players: vector::empty(),
        referral_map: vector::empty(),
        next_referral_number: 0,
      });
    }

    public entry fun register_player(account: &signer, referred_code: vector<u8>) acquires PlayerStore {
      let addr = signer::address_of(account);
      let store = borrow_global_mut<PlayerStore>(addr);

      // Check player does not exist
      assert!(find_player_index(&store.players, addr) == option::none(), 2);

      // Generate unique referral code = "arc"+referral_number bytes
      let referral_number = store.next_referral_number;

      // Manually create vector<u8> for "arc"
      let code = vector::empty<u8>();
      vector::push_back(&mut code, 97); // 'a'
      vector::push_back(&mut code, 114); // 'r'
      vector::push_back(&mut code, 99); // 'c'

      vector::append(&mut code, u64_to_bytes(referral_number));
      store.next_referral_number = referral_number + 1;

      // Lookup referrer address by referral code
      let referrer_opt = find_referral(&store.referral_map, &referred_code);
      let has_referrer = option::is_some(&referrer_opt);
      let referrer_addr = if (has_referrer) {
        option::extract(&mut referrer_opt)
      } else {
        @0x0  // dummy, won't be used
      };

      let new_player = Player {
        addr,
        points: 10,
        referrals: 0,
        referral_code: code,
        referred_by: if (has_referrer) { option::some(referrer_addr) } else { option::none() },
        last_active: timestamp::now_seconds(),
      };

      vector::push_back(&mut store.players, PlayerEntry { key: addr, player: new_player });
      vector::push_back(&mut store.referral_map, ReferralEntry { key: code, addr });

      // Credit referrer 10 points and increment referrals if exists
      if (has_referrer) {
        let ref_index_opt = find_player_index_mut(&mut store.players, referrer_addr);
        if (option::is_some(&ref_index_opt)) {
          let idx = option::extract(&mut ref_index_opt);
          let player_entry = vector::borrow_mut(&mut store.players, idx);
          player_entry.player.points = player_entry.player.points + 10;
          player_entry.player.referrals = player_entry.player.referrals + 1;
        }
      }
    }

    fun find_player_index(players: &vector<PlayerEntry>, addr: address): option::Option<u64> {
      let len = vector::length(players);
      let i = 0;
      while (i < len) {
        let entry = vector::borrow(players, i);
        if (entry.key == addr) {
          return option::some(i);
        };
        i = i + 1;
      };
      option::none()
    }

    fun find_player_index_mut(players: &mut vector<PlayerEntry>, addr: address): option::Option<u64> {
      let len = vector::length(players);
      let i = 0;
      while (i < len) {
        let entry = vector::borrow(players, i);
        if (entry.key == addr) {
          return option::some(i);
        };
        i = i + 1;
      };
      option::none()
    }

    fun find_referral(referrals: &vector<ReferralEntry>, code: &vector<u8>): option::Option<address> {
      let len = vector::length(referrals);
      let i = 0;
      while (i < len) {
        let entry = vector::borrow(referrals, i);
        if (entry.key == *code) {
          return option::some(entry.addr);
        };
        i = i + 1;
      };
      option::none()
    }

    fun u64_to_bytes(value: u64): vector<u8> {
      let b = vector::empty<u8>();
      let v = value;
      let i = 0;
      while (i < 8) {
        vector::push_back(&mut b, (v & 0xFF) as u8);
        v = v >> 8;
        i = i + 1;
      };
      b
    }
  }
}

