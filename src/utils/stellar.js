import {
  Horizon,
  TransactionBuilder,
  Operation,
  Asset,
  Networks,
  BASE_FEE,
} from '@stellar/stellar-sdk';

export const NETWORK = Networks.TESTNET;
export const HORIZON_URL = 'https://horizon-testnet.stellar.org';
export const server = new Horizon.Server(HORIZON_URL);

/**
 * Fetch XLM balance for a public key. Returns "0.0000000" if not found.
 */
export async function fetchXLMBalance(publicKey) {
  try {
    const account = await server.loadAccount(publicKey);
    const native = account.balances.find((b) => b.asset_type === 'native');
    return native ? parseFloat(native.balance).toFixed(2) : '0.00';
  } catch {
    return '0.00';
  }
}

/**
 * Build and return a native XLM payment XDR (unsigned).
 */
export async function buildPaymentXDR({ from, to, amount }) {
  const account = await server.loadAccount(from);
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK,
  })
    .addOperation(
      Operation.payment({
        destination: to,
        asset: Asset.native(),
        amount: String(amount),
      })
    )
    .setTimeout(180)
    .build();

  return tx.toXDR();
}

/**
 * Sponsor a transaction by wrapping it in a FeeBump transaction.
 */
export async function sponsorTransaction(signedInnerXdr) {
  const { TransactionBuilder, Keypair, Transaction } = await import('@stellar/stellar-sdk');
  
  const sponsorSecret = import.meta.env.VITE_SPONSOR_SECRET;
  if (!sponsorSecret) {
     return signedInnerXdr; // fallback to normal if no sponsor
  }
  
  const sponsorKeypair = Keypair.fromSecret(sponsorSecret);
  
  // Ensure sponsor is funded
  await ensureAccountFunded(sponsorKeypair.publicKey());
  
  const innerTx = new Transaction(signedInnerXdr, NETWORK);
  
  const feeBumpTx = TransactionBuilder.buildFeeBumpTransaction(
    sponsorKeypair,
    BASE_FEE,
    innerTx,
    NETWORK
  );
  
  feeBumpTx.sign(sponsorKeypair);
  
  return feeBumpTx.toXDR();
}

/**
 * Submit a signed XDR to Horizon.
 */
export async function submitXDR(signedXdr) {
  const { Transaction, FeeBumpTransaction } = await import('@stellar/stellar-sdk');
  let tx;
  try {
    tx = new Transaction(signedXdr, NETWORK);
  } catch (e) {
    tx = FeeBumpTransaction.fromXDR(signedXdr, NETWORK);
  }
  return server.submitTransaction(tx);
}

/**
 * Ensure an account exists on testnet. If it doesn't, fund it via Friendbot.
 * Throws if funding fails.
 */
export async function ensureAccountFunded(publicKey) {
  try {
    await server.loadAccount(publicKey);
    // Account already exists — nothing to do.
  } catch {
    // Account not found: fund it via Friendbot.
    const res = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`);
    if (!res.ok) {
      throw new Error(`Friendbot failed to fund ${publicKey}: ${res.statusText}`);
    }
    // Give the network a moment to settle.
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}
