import { Coins, Shield, Zap } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative overflow-hidden py-12 lg:py-20">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Decentralized Marketplace on{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Celo
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Buy and sell items using CELO or cUSD. Trustless, permissionless, and built for the Celo ecosystem.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
          <div className="group rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur transition-all hover:border-primary/50 hover:bg-card">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Coins className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold">Multi-Asset Payments</h3>
            <p className="text-sm text-muted-foreground">
              Accept payments in native CELO or cUSD stablecoin
            </p>
          </div>

          <div className="group rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur transition-all hover:border-primary/50 hover:bg-card">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold">Trustless Trading</h3>
            <p className="text-sm text-muted-foreground">
              Smart contract handles escrow and payments securely
            </p>
          </div>

          <div className="group rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur transition-all hover:border-primary/50 hover:bg-card">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold">Fast & Low Fees</h3>
            <p className="text-sm text-muted-foreground">
              Celo's fast finality and low gas costs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
