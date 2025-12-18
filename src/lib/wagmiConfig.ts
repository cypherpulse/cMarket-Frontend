import { defineChain } from 'viem';

// Custom chain definitions for Celo
export const celoMainnet = defineChain({
  id: 42220,
  caipNetworkId: 'eip155:42220',
  chainNamespace: 'eip155',
  name: 'Celo Mainnet',
  nativeCurrency: {
    name: 'CELO',
    symbol: 'CELO',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://forno.celo.org'] },
  },
  blockExplorers: {
    default: { name: 'CeloScan', url: 'https://celoscan.io' },
  },
});

export const celoSepolia = defineChain({
  id: 11142220,
  caipNetworkId: 'eip155:11142220',
  chainNamespace: 'eip155',
  name: 'Celo Sepolia Testnet',
  nativeCurrency: {
    name: 'CELO',
    symbol: 'CELO',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://forno.celo-sepolia.celo-testnet.org'] },
  },
  blockExplorers: {
    default: { name: 'Celo Sepolia Blockscout', url: 'https://celo-sepolia.blockscout.com' },
  },
  testnet: true,
});

// WalletConnect project ID from environment
export const WALLETCONNECT_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
