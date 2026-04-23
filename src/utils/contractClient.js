// ─── Prediction Market Contract Client ────────────────────────────────────────
// Simulates on-chain bet placement + payout with real Stellar XLM payments.
// When a real Soroban contract is deployed, replace POOL_ADDRESS with the
// contract's escrow address and hook createMarket/resolveMarket to RPC calls.
// ─────────────────────────────────────────────────────────────────────────────

import { buildPaymentXDR, submitXDR } from './stellar';
import { signXDR } from './walletKit';

// Escrow / pool treasury address (Stellar testnet)
export const POOL_ADDRESS = 'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN';

/**
 * Simulated in-memory market state.
 * In production these values come from a Soroban contract via SorobanRpc.
 */
const marketState = {};

/**
 * Returns current on-chain style bet book for a market ID.
 * Initialized from MATCH_DATA defaults.
 */
export function getMarketState(matchId) {
  return marketState[matchId] ?? null;
}

/**
 * Initialise market state (called at app boot from match data).
 */
export function initMarket(matchId, teamA, teamB, initialPool = 0) {
  if (!marketState[matchId]) {
    marketState[matchId] = {
      matchId,
      teamA,
      teamB,
      poolA: initialPool,
      poolB: initialPool,
      bets: [], // { address, team, amount, txHash }
      resolved: false,
      winner: null,
    };
  }
}

/**
 * Place a bet on a team for a given match.
 * Executes a real XLM payment to the pool address.
 *
 * @param {string} matchId   - Unique match identifier
 * @param {string} team      - 'A' or 'B'
 * @param {number} amount    - XLM amount to stake
 * @param {string} address   - Bettor's public key
 * @returns {object}         - { txHash, odds }
 */
export async function placeBet({ matchId, team, amount, address }) {
  const market = marketState[matchId];
  if (!market) throw new Error(`Market ${matchId} not initialised`);
  if (market.resolved) throw new Error('Market already resolved');
  if (amount <= 0) throw new Error('Amount must be positive');

  // Build + sign + submit XLM payment to pool
  const xdr = await buildPaymentXDR({ from: address, to: POOL_ADDRESS, amount });
  const signedXdr = await signXDR(xdr);
  const result = await submitXDR(signedXdr);

  const txHash = result.hash;

  // Record bet
  market.bets.push({ address, team, amount, txHash });
  if (team === 'A') market.poolA += amount;
  else market.poolB += amount;

  return {
    txHash,
    odds: computeOdds(market, team),
  };
}

/**
 * Resolve a market (admin only in a real contract).
 * In this MVP any connected user can resolve for demo purposes.
 */
export function resolveMarket(matchId, winner) {
  const market = marketState[matchId];
  if (!market) throw new Error(`Market ${matchId} not found`);
  if (market.resolved) throw new Error('Already resolved');
  market.resolved = true;
  market.winner = winner;
}

/**
 * Calculate implied odds for a side.
 * Returns a decimal e.g. 1.82 meaning 1.82× return on stake.
 */
export function computeOdds(market, team) {
  const totalPool = market.poolA + market.poolB;
  if (totalPool === 0) return 2.0;
  const sidePct = team === 'A' ? market.poolA / totalPool : market.poolB / totalPool;
  if (sidePct === 0) return 10.0;
  // 5% house rake
  return parseFloat(((1 / sidePct) * 0.95).toFixed(2));
}

/**
 * Compute potential payout for a bet.
 */
export function computePayout(market, address) {
  const winning = market.winner;
  if (!winning) return 0;

  const winBets = market.bets.filter((b) => b.team === winning);
  const loseBets = market.bets.filter((b) => b.team !== winning);
  const losePool = loseBets.reduce((s, b) => s + b.amount, 0);
  const winPool = winBets.reduce((s, b) => s + b.amount, 0);

  const myBets = winBets.filter((b) => b.address === address);
  const myStake = myBets.reduce((s, b) => s + b.amount, 0);

  if (myStake === 0 || winPool === 0) return 0;

  // Proportional share of losing pool + original stake, minus 5% rake
  const rake = 0.05;
  const shareOfLose = (myStake / winPool) * losePool;
  return parseFloat((myStake + shareOfLose * (1 - rake)).toFixed(7));
}
