import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { GumroadBanner } from './GumroadBanner';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-darkbg flex flex-col relative">
      {/* Gumroad Promo Banner */}
      <GumroadBanner />

      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1 w-full z-10 relative">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
export default Layout;
