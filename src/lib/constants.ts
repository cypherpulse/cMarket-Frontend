import { celoSepolia, celoMainnet } from './wagmiConfig';

// Contract addresses
// TODO: Move to environment variables
export const CONTRACTS = {
  [celoSepolia.id]: {
    cMarket: '0xF735e31Cc35B0C3c1826FA50558508d05d23fAa0' as `0x${string}`,
    cUSD: '0x01C5C0122039549AD1493B8220cABEdD739BC44E' as `0x${string}`,
  },
  [celoMainnet.id]: {
    // TODO: Update with actual mainnet addresses when deployed
    cMarket: '0x1234567890123456789012345678901234567890' as `0x${string}`,
    cUSD: '0x765DE816845861e75A25fCA122bb6898B8B1282a' as `0x${string}`,
  },
} as const;

// Payment asset enum matching the contract
export enum PaymentAsset {
  CELO = 0,
  cUSD = 1,
}

export const PAYMENT_ASSET_LABELS: Record<PaymentAsset, string> = {
  [PaymentAsset.CELO]: 'CELO',
  [PaymentAsset.cUSD]: 'cUSD',
};

// Listing status
export enum ListingStatus {
  Active = 0,
  Sold = 1,
  Cancelled = 2,
}

export const STATUS_LABELS: Record<ListingStatus, string> = {
  [ListingStatus.Active]: 'Active',
  [ListingStatus.Sold]: 'Sold',
  [ListingStatus.Cancelled]: 'Cancelled',
};

// Re-export chains
export { celoSepolia, celoMainnet };
