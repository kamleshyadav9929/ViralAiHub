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

  const isDev = import.meta.env.DEV;

  useEffect(() => {
    async function checkSession() {
      try {
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setIsAuthenticated(true);
            setUserEmail(session.user.email || null);
            return;
          }
        }
        
        // Fallback or default mock session check (Dev only)
        if (isDev) {
          const localSession = sessionStorage.getItem(SESSION_KEY);
          if (localSession === 'true') {
            setIsAuthenticated(true);
            setUserEmail(MOCK_ADMIN_EMAIL);
            return;
          }
        }
        
        setIsAuthenticated(false);
      } catch (err) {
        console.error('Session check failed', err);
        
        // Fallback to local session check on error (Dev only)
        if (isDev) {
          const localSession = sessionStorage.getItem(SESSION_KEY);
          if (localSession === 'true') {
            setIsAuthenticated(true);
            setUserEmail(MOCK_ADMIN_EMAIL);
          }
        }
      } finally {
        setLoading(false);
      }
    }

    checkSession();

    // Listen for auth changes if Supabase is available
    let subscription: any = null;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setIsAuthenticated(true);
          setUserEmail(session.user.email || null);
        } else {
          // If Supabase signed out, check if mock session is still active
          const localSession = isDev ? sessionStorage.getItem(SESSION_KEY) : null;
          if (localSession !== 'true') {
            setIsAuthenticated(false);
            setUserEmail(null);
          }
        }
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
        try {
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
        } catch (err: any) {
          // Fallback to local mock credentials (Dev only)
          if (isDev && email.toLowerCase() === MOCK_ADMIN_EMAIL && password === MOCK_ADMIN_PASSWORD) {
            sessionStorage.setItem(SESSION_KEY, 'true');
            setIsAuthenticated(true);
            setUserEmail(MOCK_ADMIN_EMAIL);
            return true;
          }
          throw err;
        }
      } else {
        // Mock Login (Dev only)
        if (isDev && email.toLowerCase() === MOCK_ADMIN_EMAIL && password === MOCK_ADMIN_PASSWORD) {
          sessionStorage.setItem(SESSION_KEY, 'true');
          setIsAuthenticated(true);
          setUserEmail(MOCK_ADMIN_EMAIL);
          return true;
        } else {
          throw new Error(
            isDev 
              ? 'Invalid email or password. Use: admin@viralaihub.com / admin123'
              : 'Database authentication system is not configured.'
          );
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
