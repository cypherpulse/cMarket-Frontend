import { useState, useEffect } from 'react';
import { useAccount, useReadContracts } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useNextListingId, useBuyListing, useApproveCusd, useCancelListing, type Listing } from '@/hooks/useCMarket';
import { useCeloChain } from '@/hooks/useCeloChain';
import { cMarketAbi } from '@/lib/abi/cMarketAbi';
import { PaymentAsset, ListingStatus, STATUS_LABELS } from '@/lib/constants';
import { formatPrice, truncateAddress, getContractErrorMessage } from '@/lib/format';
import { toast } from 'sonner';
import { ShoppingCart, X, Loader2, RefreshCw, Package } from 'lucide-react';

interface ListingData {
  seller: `0x${string}`;
  title: string;
  description: string;
  price: bigint;
  paymentAsset: number;
  status: number;
}

interface ListingsTableProps {
  refreshTrigger?: number;
}

export function ListingsTable({ refreshTrigger }: ListingsTableProps) {
  const { address, isConnected } = useAccount();
  const { cMarketAddress } = useCeloChain();
  const { data: nextId, refetch: refetchNextId } = useNextListingId();
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<number | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [approvingForId, setApprovingForId] = useState<number | null>(null);

  const buyListing = useBuyListing();
  const approveCusd = useApproveCusd();
  const cancelListing = useCancelListing();

  // Generate contract calls for all listings
  const listingCount = nextId ? Number(nextId) : 0;
  const listingIds = Array.from({ length: listingCount }, (_, i) => i);

  const { data: listingsData, refetch: refetchListings } = useReadContracts({
    contracts: listingIds.map((id) => ({
      address: cMarketAddress,
      abi: cMarketAbi,
      functionName: 'getListing' as const,
      args: [BigInt(id)],
    })),
  });

  useEffect(() => {
    if (listingsData) {
      const parsed: Listing[] = listingsData
        .map((result, index) => {
          if (result.status === 'success' && result.result) {
            const data = result.result as unknown as ListingData;
            return {
              id: index,
              seller: data.seller,
              title: data.title,
              description: data.description,
              price: data.price,
              paymentAsset: data.paymentAsset as PaymentAsset,
              status: data.status as ListingStatus,
            };
          }
          return null;
        })
        .filter((l): l is Listing => l !== null);
      
      setListings(parsed);
      setIsLoading(false);
    }
  }, [listingsData]);

  useEffect(() => {
    refetchNextId();
    refetchListings();
  }, [refreshTrigger, refetchNextId, refetchListings]);

  // Handle buy success/error
  useEffect(() => {
    if (buyListing.isSuccess) {
      toast.success('Purchase successful!');
      setBuyingId(null);
      buyListing.reset();
      refetchListings();
    }
    if (buyListing.error) {
      toast.error(getContractErrorMessage(buyListing.error));
      setBuyingId(null);
      buyListing.reset();
    }
  }, [buyListing.isSuccess, buyListing.error, buyListing, refetchListings]);

  // Handle approve success
  useEffect(() => {
    if (approveCusd.isSuccess && approvingForId !== null) {
      toast.success('cUSD approved! Now completing purchase...');
      const listing = listings.find(l => l.id === approvingForId);
      if (listing) {
        setBuyingId(approvingForId);
        setApprovingForId(null);
        buyListing.buyWithCusd(listing.id);
      }
      approveCusd.reset();
    }
    if (approveCusd.error) {
      toast.error(getContractErrorMessage(approveCusd.error));
      setApprovingForId(null);
      approveCusd.reset();
    }
  }, [approveCusd.isSuccess, approveCusd.error, approvingForId, listings, buyListing, approveCusd]);

  // Handle cancel success/error
  useEffect(() => {
    if (cancelListing.isSuccess) {
      toast.success('Listing cancelled');
      setCancellingId(null);
      cancelListing.reset();
      refetchListings();
    }
    if (cancelListing.error) {
      toast.error(getContractErrorMessage(cancelListing.error));
      setCancellingId(null);
      cancelListing.reset();
    }
  }, [cancelListing.isSuccess, cancelListing.error, cancelListing, refetchListings]);

  const handleBuy = (listing: Listing) => {
    if (listing.paymentAsset === PaymentAsset.CELO) {
      setBuyingId(listing.id);
      buyListing.buyWithCelo(listing.id, listing.price);
    } else {
      // Need to approve cUSD first
      setApprovingForId(listing.id);
      approveCusd.approve(cMarketAddress, listing.price);
    }
  };

  const handleCancel = (listingId: number) => {
    setCancellingId(listingId);
    cancelListing.cancelListing(listingId);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    refetchNextId();
    refetchListings();
  };

  const getStatusBadgeVariant = (status: ListingStatus) => {
    switch (status) {
      case ListingStatus.Active:
        return 'default';
      case ListingStatus.Sold:
        return 'secondary';
      case ListingStatus.Cancelled:
        return 'outline';
      default:
        return 'outline';
    }
  };

  const activeListings = listings.filter(l => l.status === ListingStatus.Active);

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Listings
          </CardTitle>
          <CardDescription>
            {activeListings.length} active listing{activeListings.length !== 1 ? 's' : ''} available
          </CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium text-muted-foreground">No listings yet</p>
            <p className="text-sm text-muted-foreground/70">Be the first to create a listing!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map((listing) => {
              const isSeller = address?.toLowerCase() === listing.seller.toLowerCase();
              const isActive = listing.status === ListingStatus.Active;
              const isBuying = buyingId === listing.id;
              const isApproving = approvingForId === listing.id;
              const isCancelling = cancellingId === listing.id;
              const isProcessing = isBuying || isApproving || isCancelling;

              return (
                <div
                  key={listing.id}
                  className="rounded-lg border border-border/50 bg-background/50 p-4 transition-colors hover:border-border"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{listing.title}</h3>
                        <Badge variant={getStatusBadgeVariant(listing.status)} className="text-xs">
                          {STATUS_LABELS[listing.status]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {listing.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-mono text-muted-foreground">
                          Seller: {truncateAddress(listing.seller)}
                        </span>
                        <span className="font-semibold text-primary">
                          {formatPrice(listing.price, listing.paymentAsset)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {isActive && isConnected && !isSeller && (
                        <Button
                          size="sm"
                          onClick={() => handleBuy(listing)}
                          disabled={isProcessing}
                        >
                          {isBuying || isApproving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {isApproving ? 'Approving...' : 'Buying...'}
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Buy
                            </>
                          )}
                        </Button>
                      )}

                      {isActive && isConnected && isSeller && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleCancel(listing.id)}
                          disabled={isProcessing}
                        >
                          {isCancelling ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <X className="mr-2 h-4 w-4" />
                              Cancel
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
