import { AppKitButton, AppKitNetworkButton } from '@reown/appkit/react';
import { ShoppingBag } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <ShoppingBag className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">cMarket</span>
        </div>
        
        <div className="flex items-center gap-2">
          <AppKitNetworkButton />
          <AppKitButton />
        </div>
      </div>
    </nav>
  );
}
