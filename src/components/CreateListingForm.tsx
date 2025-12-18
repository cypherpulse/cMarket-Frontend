import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateListing } from '@/hooks/useCMarket';
import { PaymentAsset, PAYMENT_ASSET_LABELS } from '@/lib/constants';
import { parsePrice, getContractErrorMessage } from '@/lib/format';
import { toast } from 'sonner';
import { Plus, Loader2 } from 'lucide-react';

interface CreateListingFormProps {
  onSuccess?: () => void;
}

export function CreateListingForm({ onSuccess }: CreateListingFormProps) {
  const { isConnected } = useAccount();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [paymentAsset, setPaymentAsset] = useState<PaymentAsset>(PaymentAsset.CELO);

  const { createListing, isPending, isConfirming, isSuccess, error, reset } = useCreateListing();

  useEffect(() => {
    if (isSuccess) {
      toast.success('Listing created successfully!');
      setTitle('');
      setDescription('');
      setPrice('');
      setPaymentAsset(PaymentAsset.CELO);
      reset();
      onSuccess?.();
    }
  }, [isSuccess, onSuccess, reset]);

  useEffect(() => {
    if (error) {
      toast.error(getContractErrorMessage(error));
      reset();
    }
  }, [error, reset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }
    
    const priceWei = parsePrice(price);
    if (priceWei === 0n) {
      toast.error('Please enter a valid price');
      return;
    }

    createListing(title.trim(), description.trim(), priceWei, paymentAsset);
  };

  const isLoading = isPending || isConfirming;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Create Listing
        </CardTitle>
        <CardDescription>
          List an item for sale on the Celo blockchain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter item title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your item..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="text"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentAsset">Payment Asset</Label>
              <Select
                value={paymentAsset.toString()}
                onValueChange={(v) => setPaymentAsset(parseInt(v) as PaymentAsset)}
                disabled={isLoading}
              >
                <SelectTrigger id="paymentAsset">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PaymentAsset.CELO.toString()}>
                    {PAYMENT_ASSET_LABELS[PaymentAsset.CELO]}
                  </SelectItem>
                  <SelectItem value={PaymentAsset.cUSD.toString()}>
                    {PAYMENT_ASSET_LABELS[PaymentAsset.cUSD]}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!isConnected || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isConfirming ? 'Confirming...' : 'Creating...'}
              </>
            ) : (
              'Create Listing'
            )}
          </Button>

          {!isConnected && (
            <p className="text-center text-sm text-muted-foreground">
              Connect your wallet to create a listing
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
