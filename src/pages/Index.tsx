import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { CreateListingForm } from '@/components/CreateListingForm';
import { ListingsTable } from '@/components/ListingsTable';

const Index = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleListingCreated = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      
      <main className="container mx-auto px-4 pb-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <CreateListingForm onSuccess={handleListingCreated} />
          </div>
          <div>
            <ListingsTable refreshTrigger={refreshKey} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Celo Market Hub</h3>
              <p className="text-sm text-muted-foreground">
                Decentralized marketplace built on the Celo blockchain for trustless trading.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Resources</h4>
              <div className="space-y-2">
                <a href="https://celo.org" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-foreground">
                  Celo Documentation
                </a>
                <a href="https://docs.celo.org" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-foreground">
                  Developer Docs
                </a>
                <a href="https://github.com/celo-org" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-foreground">
                  GitHub
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Community</h4>
              <div className="space-y-2">
                <a href="https://discord.gg/celo" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-foreground">
                  Discord
                </a>
                <a href="https://twitter.com/CeloOrg" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-foreground">
                  Twitter
                </a>
                <a href="https://forum.celo.org" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-foreground">
                  Forum
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Legal</h4>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Celo Market Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
