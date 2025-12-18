import { formatEther, parseEther } from 'viem';
import { PaymentAsset, PAYMENT_ASSET_LABELS } from './constants';

/**
 * Format a BigInt price value to a human-readable string with symbol
 */
export function formatPrice(value: bigint, paymentAsset: PaymentAsset): string {
  const formatted = formatEther(value);
  const symbol = PAYMENT_ASSET_LABELS[paymentAsset];
  return `${parseFloat(formatted).toFixed(4)} ${symbol}`;
}

/**
 * Parse a string price to wei (BigInt)
 */
export function parsePrice(value: string): bigint {
  try {
    return parseEther(value);
  } catch {
    return 0n;
  }
}

/**
 * Truncate an address for display
 */
export function truncateAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Get a friendly error message from contract errors
 */
export function getContractErrorMessage(error: Error): string {
  const message = error.message || '';
  
  if (message.includes('cMarket__ListingNotActive')) {
    return 'This listing is no longer active.';
  }
  if (message.includes('cMarket__IncorrectPaymentAmount')) {
    return 'Incorrect payment amount sent.';
  }
  if (message.includes('cMarket__InsufficientAllowance')) {
    return 'Insufficient cUSD allowance. Please approve the required amount.';
  }
  if (message.includes('cMarket__InvalidPrice')) {
    return 'Invalid price. Price must be greater than zero.';
  }
  if (message.includes('cMarket__NotSeller')) {
    return 'Only the seller can perform this action.';
  }
  if (message.includes('cMarket__SellerCannotBuy')) {
    return 'You cannot buy your own listing.';
  }
  if (message.includes('cMarket__TransferFailed')) {
    return 'Payment transfer failed. Please try again.';
  }
  if (message.includes('User rejected')) {
    return 'Transaction was rejected.';
  }
  
  return 'An error occurred. Please try again.';
}
