import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Approved local admin credentials
const MOCK_ADMIN_EMAIL = 'admin@viralaihub.com';
const MOCK_ADMIN_PASSWORD = 'admin123';
const SESSION_KEY = 'viralai_admin_session';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkSession() {
      try {
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setIsAuthenticated(true);
            setUserEmail(session.user.email || null);
          } else {
            setIsAuthenticated(false);
          }
        } else {
          // Check local mock session
          const localSession = sessionStorage.getItem(SESSION_KEY);
          if (localSession === 'true') {
            setIsAuthenticated(true);
            setUserEmail(MOCK_ADMIN_EMAIL);
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        console.error('Session check failed', err);
      } finally {
        setLoading(false);
      }
    }

    checkSession();

    // Listen for auth changes if Supabase is available
    let subscription: any = null;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(!!session);
        setUserEmail(session?.user?.email || null);
        setLoading(false);
      });
      subscription = data.subscription;
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      if (supabase) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (authError) throw authError;
        
        if (data.session) {
          setIsAuthenticated(true);
          setUserEmail(data.session.user.email || null);
          return true;
        }
        return false;
      } else {
        // Mock Login
        if (email.toLowerCase() === MOCK_ADMIN_EMAIL && password === MOCK_ADMIN_PASSWORD) {
          sessionStorage.setItem(SESSION_KEY, 'true');
          setIsAuthenticated(true);
          setUserEmail(MOCK_ADMIN_EMAIL);
          return true;
        } else {
          throw new Error('Invalid email or password. Use: admin@viralaihub.com / admin123');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setIsAuthenticated(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (supabase) {
        await supabase.auth.signOut();
      } else {
        sessionStorage.removeItem(SESSION_KEY);
      }
      setIsAuthenticated(false);
      setUserEmail(null);
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setLoading(false);
    }
  };

  return { isAuthenticated, loading, userEmail, error, login, logout };
}
