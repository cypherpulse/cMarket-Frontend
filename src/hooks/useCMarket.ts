import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { cMarketAbi, erc20Abi } from '@/lib/abi/cMarketAbi';
import { useCeloChain } from './useCeloChain';
import { PaymentAsset, ListingStatus } from '@/lib/constants';

export interface Listing {
  id: number;
  seller: `0x${string}`;
  title: string;
  description: string;
  price: bigint;
  paymentAsset: PaymentAsset;
  status: ListingStatus;
}

export function useNextListingId() {
  const { cMarketAddress } = useCeloChain();

  return useReadContract({
    address: cMarketAddress,
    abi: cMarketAbi,
    functionName: 'getNextListingId',
  });
}

export function useListing(listingId: number) {
  const { cMarketAddress } = useCeloChain();

  return useReadContract({
    address: cMarketAddress,
    abi: cMarketAbi,
    functionName: 'getListing',
    args: [BigInt(listingId)],
  });
}

export function useIsActive(listingId: number) {
  const { cMarketAddress } = useCeloChain();

  return useReadContract({
    address: cMarketAddress,
    abi: cMarketAbi,
    functionName: 'isActive',
    args: [BigInt(listingId)],
  });
}

export function useCreateListing() {
  const { cMarketAddress } = useCeloChain();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createListing = (
    title: string,
    description: string,
    price: bigint,
    paymentAsset: PaymentAsset
  ) => {
    writeContract({
      address: cMarketAddress,
      abi: cMarketAbi,
      functionName: 'createListing',
      args: [title, description, price, paymentAsset],
    } as any);
  };

  return {
    createListing,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
    reset,
  };
}

export function useBuyListing() {
  const { cMarketAddress } = useCeloChain();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const buyWithCelo = (listingId: number, price: bigint) => {
    writeContract({
      address: cMarketAddress,
      abi: cMarketAbi,
      functionName: 'buyListing',
      args: [BigInt(listingId)],
      value: price,
    } as any);
  };

  const buyWithCusd = (listingId: number) => {
    writeContract({
      address: cMarketAddress,
      abi: cMarketAbi,
      functionName: 'buyListing',
      args: [BigInt(listingId)],
    } as any);
  };

  return {
    buyWithCelo,
    buyWithCusd,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
    reset,
  };
}

export function useApproveCusd() {
  const { cUsdAddress } = useCeloChain();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const approve = (spender: `0x${string}`, amount: bigint) => {
    writeContract({
      address: cUsdAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [spender, amount],
    } as any);
  };

  return {
    approve,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
    reset,
  };
}

export function useCancelListing() {
  const { cMarketAddress } = useCeloChain();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const cancelListing = (listingId: number) => {
    writeContract({
      address: cMarketAddress,
      abi: cMarketAbi,
      functionName: 'cancelListing',
      args: [BigInt(listingId)],
    } as any);
  };

  return {
    cancelListing,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
    reset,
  };
}
