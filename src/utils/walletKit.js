import {
  isConnected,
  requestAccess,
  signTransaction as freighterSignTransaction,
} from '@stellar/freighter-api';

let activeAddress = null;

/**
 * Connect wallet via Freighter (injected extension).
 * Returns the public key on success.
 */
export async function connectWallet() {
  const hasFreighter = await isConnected();
  if (!hasFreighter) {
    throw new Error('Freighter wallet extension not found. Please install it from https://freighter.app');
  }

  const { address, error } = await requestAccess();
  
  if (error) {
    throw new Error(error);
  }
  
  if (!address) {
    throw new Error('Could not get public key from Freighter. Please ensure the wallet is unlocked and an account is selected.');
  }
  
  activeAddress = address;
  return address;
}

/**
 * Disconnect the wallet (clears the cached address).
 */
export function disconnectWallet() {
  activeAddress = null;
}

/**
 * Returns the cached public key or null.
 */
export function getActiveAddress() {
  return activeAddress;
}

/**
 * Sign an XDR transaction string using Freighter.
 * Returns the signed XDR.
 */
export async function signXDR(xdr, network = 'TESTNET') {
  const hasFreighter = await isConnected();
  if (!hasFreighter) {
    throw new Error('Freighter is not available');
  }

  const { signedTxXdr, error } = await freighterSignTransaction(xdr, {
    networkPassphrase:
      network === 'TESTNET'
        ? 'Test SDF Network ; September 2015'
        : 'Public Global Stellar Network ; September 2015',
  });
  
  if (error) {
    throw new Error(error);
  }

  return signedTxXdr;
}
