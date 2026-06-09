import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { GumroadBanner } from './GumroadBanner';
import { cn } from '../../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div 
      className={cn(
        "min-h-screen flex flex-col relative overflow-x-hidden",
        isAdmin 
          ? "bg-aura-grid" // Premium Aura Grid creative background for admin dashboard
          : "bg-darkbg animated-mesh" // Moving mesh for public landing pages
      )}
    >
      {/* Subtle grid pattern overlay - only for non-admin public pages (as admin has it built-in) */}
      {!isAdmin && (
        <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(rgba(255,255,255,0.018)_1.2px,transparent_1.2px)] [background-size:28px_28px]" />
      )}

      {/* Decorative ambient glowing lights - hidden on admin dashboard */}
      {!isAdmin && (
        <>
          <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[60%] rounded-full bg-secondary/5 blur-[120px] pointer-events-none animate-pulse-slow z-0" />
          <div className="absolute bottom-[5%] right-[-15%] w-[70%] h-[70%] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none animate-pulse-slow z-0" />
        </>
      )}

      {/* Gumroad Promo Banner - disabled on admin portal */}
      {!isAdmin && <GumroadBanner />}

      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1 w-full z-10 relative">
        {children}
      </main>

      {/* Footer - hidden on admin pages for application focus */}
      {!isAdmin && <Footer />}
    </div>
  );
};
export default Layout;

