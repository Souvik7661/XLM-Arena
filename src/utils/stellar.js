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
 * Submit a signed XDR to Horizon.
 */
export async function submitXDR(signedXdr) {
  const { Transaction } = await import('@stellar/stellar-sdk');
  const tx = new Transaction(signedXdr, NETWORK);
  return server.submitTransaction(tx);
}
