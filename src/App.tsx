import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';

// Toast Context Provider
import { ToastProvider } from './components/ui/toast';

// Layout
import Layout from './components/layout/Layout';

// Public Pages
import Home from './pages/Home';
import TrendDetail from './pages/TrendDetail';
import Category from './pages/Category';
import Search from './pages/Search';

// Page Transition Wrapper
const AnimatedPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

// Route Animator component to capture location changes
const RouteAnimator = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* Public Routes */}
        <Route 
          path="/" 
          element={
            <AnimatedPage>
              <Home />
            </AnimatedPage>
          } 
        />
        <Route 
          path="/trend/:slug" 
          element={
            <AnimatedPage>
              <TrendDetail />
            </AnimatedPage>
          } 
        />
        <Route 
          path="/category/:slug" 
          element={
            <AnimatedPage>
              <Category />
            </AnimatedPage>
          } 
        />
        <Route 
          path="/search" 
          element={
            <AnimatedPage>
              <Search />
            </AnimatedPage>
          } 
        />

        {/* Catch All Redirect to Home */}
        <Route 
          path="*" 
          element={
            <AnimatedPage>
              <Home />
            </AnimatedPage>
          } 
        />
        
      </Routes>
    </AnimatePresence>
  );
};

export function App() {
  return (
    <HelmetProvider>
      <ToastProvider>
        <Router>
          <Layout>
            <RouteAnimator />
          </Layout>
        </Router>
      </ToastProvider>
    </HelmetProvider>
  );
}

export default App;
