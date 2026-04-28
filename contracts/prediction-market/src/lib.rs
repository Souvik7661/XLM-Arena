#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, String,
};

/// Storage keys
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    Market(u32),
    MarketCount,
    UserBets(Address),
}

/// A single bet record
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Bet {
    pub bettor: Address,
    pub team: u32,    // 0 = Team A, 1 = Team B
    pub amount: i128, // in stroops
}

/// Market state
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Market {
    pub id: u32,
    pub title: String,
    pub pool_a: i128,
    pub pool_b: i128,
    pub resolved: bool,
    pub winner: u32,   // 0 = A, 1 = B, 99 = unresolved
    pub bet_count: u32,
}

#[contract]
pub struct PredictionMarket;

#[contractimpl]
impl PredictionMarket {
    /// Initialize the contract with an admin address.
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::MarketCount, &0u32);
    }

    /// Create a new prediction market. Only admin can create.
    pub fn create_market(env: Env, title: String) -> u32 {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let mut count: u32 = env
            .storage()
            .instance()
            .get(&DataKey::MarketCount)
            .unwrap_or(0u32);

        let market = Market {
            id: count,
            title,
            pool_a: 0,
            pool_b: 0,
            resolved: false,
            winner: 99,
            bet_count: 0,
        };

        env.storage().instance().set(&DataKey::Market(count), &market);
        count += 1;
        env.storage().instance().set(&DataKey::MarketCount, &count);

        env.events()
            .publish((symbol_short!("mkt_new"),), market.id);

        market.id
    }

    /// Place a bet on a market. Bettor must authorize.
    pub fn place_bet(env: Env, market_id: u32, bettor: Address, team: u32, amount: i128) {
        bettor.require_auth();

        assert!(amount > 0, "amount must be positive");
        assert!(team == 0 || team == 1, "team must be 0 or 1");

        let mut market: Market = env
            .storage()
            .instance()
            .get(&DataKey::Market(market_id))
            .expect("market not found");

        assert!(!market.resolved, "market already resolved");

        // Update pool
        if team == 0 {
            market.pool_a += amount;
        } else {
            market.pool_b += amount;
        }
        market.bet_count += 1;

        env.storage()
            .instance()
            .set(&DataKey::Market(market_id), &market);

        env.events().publish(
            (symbol_short!("bet"),),
            (market_id, bettor.clone(), team, amount),
        );
    }

    /// Resolve a market. Only admin can resolve.
    pub fn resolve_market(env: Env, market_id: u32, winner: u32) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        assert!(winner == 0 || winner == 1, "winner must be 0 or 1");

        let mut market: Market = env
            .storage()
            .instance()
            .get(&DataKey::Market(market_id))
            .expect("market not found");

        assert!(!market.resolved, "already resolved");

        market.resolved = true;
        market.winner = winner;

        env.storage()
            .instance()
            .set(&DataKey::Market(market_id), &market);

        env.events()
            .publish((symbol_short!("resolve"),), (market_id, winner));
    }

    /// Get market details by ID.
    pub fn get_market(env: Env, market_id: u32) -> Market {
        env.storage()
            .instance()
            .get(&DataKey::Market(market_id))
            .expect("market not found")
    }

    /// Get total number of markets.
    pub fn get_market_count(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::MarketCount)
            .unwrap_or(0u32)
    }

    /// Compute odds for a given team. Returns basis points (e.g., 18200 = 1.82x).
    pub fn get_odds(env: Env, market_id: u32, team: u32) -> i128 {
        let market: Market = env
            .storage()
            .instance()
            .get(&DataKey::Market(market_id))
            .expect("market not found");

        let total = market.pool_a + market.pool_b;
        if total == 0 {
            return 20000; // 2.0x default odds
        }

        let side = if team == 0 {
            market.pool_a
        } else {
            market.pool_b
        };

        if side == 0 {
            return 100000; // 10.0x if no bets on this side
        }

        // odds = (total / side) * 0.95 * 10000 (basis points)
        (total * 9500) / side
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;
    use soroban_sdk::Env;

    #[test]
    fn test_full_flow() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(PredictionMarket, ());
        let client = PredictionMarketClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        client.initialize(&admin);

        // Create a market
        let title = String::from_str(&env, "Team Liquid vs Fnatic");
        let market_id = client.create_market(&title);
        assert_eq!(market_id, 0);

        // Place bets
        let bettor1 = Address::generate(&env);
        let bettor2 = Address::generate(&env);

        client.place_bet(&market_id, &bettor1, &0, &1000);
        client.place_bet(&market_id, &bettor2, &1, &500);

        // Check market state
        let market = client.get_market(&market_id);
        assert_eq!(market.pool_a, 1000);
        assert_eq!(market.pool_b, 500);
        assert_eq!(market.bet_count, 2);
        assert!(!market.resolved);

        // Get odds
        let odds_a = client.get_odds(&market_id, &0);
        let odds_b = client.get_odds(&market_id, &1);
        assert!(odds_a < odds_b); // team A has more bets, lower odds

        // Resolve
        client.resolve_market(&market_id, &0);
        let resolved = client.get_market(&market_id);
        assert!(resolved.resolved);
        assert_eq!(resolved.winner, 0);

        // Market count
        assert_eq!(client.get_market_count(), 1);
    }
}
