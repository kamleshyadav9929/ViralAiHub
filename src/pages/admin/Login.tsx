import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export const Login = () => {
  const { login, isAuthenticated, error, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Get original redirect target if navigated here by ProtectedRoute
  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    const success = await login(email, password);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | ViralAI Hub</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/15 rounded-full blur-[80px] pointer-events-none" />
        
        <Card hoverEffect={false} className="w-full max-w-md border border-border1 z-10 bg-white">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto bg-primary p-3 rounded-full w-12 h-12 flex items-center justify-center text-white mb-2">
              <Lock size={20} />
            </div>
            
            <CardTitle className="text-2xl font-heading font-extrabold text-textPrimary">
              Admin Portal Login
            </CardTitle>
            
            <CardDescription className="text-xs text-textSecondary">
              Enter credentials to access the trends dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-start space-x-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-xl text-xs">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p className="leading-relaxed">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-textSecondary" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3.5 flex items-center text-textMuted">
                    <Mail size={14} />
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="admin@viralaihub.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-border1 rounded-full pl-10 pr-4 py-2 text-xs text-textPrimary focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-textSecondary" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3.5 flex items-center text-textMuted">
                    <Lock size={14} />
                  </span>
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-border1 rounded-full pl-10 pr-4 py-2 text-xs text-textPrimary focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                variant="default"
                className="w-full h-10 mt-2 font-bold text-xs"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </Button>
            </form>

            {/* Test Instructions Box */}
            <div className="mt-6 p-4 rounded-xl border border-border1 bg-surface1 text-[11px] text-textSecondary space-y-1">
              <div className="flex items-center space-x-1.5 text-secondary font-bold">
                <Sparkles size={12} className="animate-pulse" />
                <span>Local Sandbox Mode Enabled</span>
              </div>
              <p className="text-textMuted leading-relaxed">
                If Supabase Auth is not configured, log in with:
              </p>
              <div className="monospace-code text-textPrimary mt-1.5 p-2 bg-surface2 rounded border border-border1 flex flex-col space-y-0.5 select-all">
                <span>Email: admin@viralaihub.com</span>
                <span>Pass: admin123</span>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </>
  );
};
export default Login;
