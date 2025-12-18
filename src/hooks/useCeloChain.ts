import { useChainId } from 'wagmi';
import { celoSepolia, celoMainnet, CONTRACTS } from '@/lib/constants';

export function useCeloChain() {
  const chainId = useChainId();

  const isCeloSepolia = chainId === celoSepolia.id;
  const isCeloMainnet = chainId === celoMainnet.id;
  const isSupportedChain = isCeloSepolia || isCeloMainnet;

  const contracts = isSupportedChain
    ? CONTRACTS[chainId as keyof typeof CONTRACTS]
    : CONTRACTS[celoSepolia.id];

  const cMarketAddress = contracts.cMarket;
  const cUsdAddress = contracts.cUSD;

  const chainName = isCeloMainnet ? 'Celo Mainnet' : 'Celo Sepolia Testnet';
  const explorerUrl = isCeloMainnet
    ? 'https://celoscan.io'
    : 'https://celo-sepolia.blockscout.com';

  return {
    chainId,
    isCeloSepolia,
    isCeloMainnet,
    isSupportedChain,
    cMarketAddress,
    cUsdAddress,
    chainName,
    explorerUrl,
  };
}
