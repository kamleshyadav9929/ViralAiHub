import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Library, Eye, Terminal, Plus, LogOut, Settings, ListCollapse, List, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { dbService } from '../../services/db';
import type { AdminStats } from '../../types';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export const Dashboard = () => {
  const { logout, userEmail } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const data = await dbService.getAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin dashboard stats', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-primary border-r-secondary rounded-full animate-spin" />
        </div>
        <span className="text-xs text-textSecondary font-semibold">Gathering dashboard analytics...</span>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Trends',
      value: stats?.totalTrends || 0,
      icon: <Library className="text-primary" size={18} />,
      desc: 'Active guides in libraries'
    },
    {
      title: 'Total Views',
      value: stats?.totalViews || 0,
      icon: <Eye className="text-secondary" size={18} />,
      desc: 'Cumulative guide visits'
    },
    {
      title: 'Most Lengthy Prompt',
      value: stats?.mostCopiedPrompt.substring(0, 15) + '...' || 'N/A',
      icon: <Terminal className="text-emerald-400" size={18} />,
      desc: 'Detailed template block'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | ViralAI Hub</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-8 px-6 md:px-12 py-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="space-y-1.5">
            <h1 className="font-heading text-2xl md:text-4xl font-extrabold text-textPrimary leading-none">
              Admin Dashboard
            </h1>
            <p className="text-xs text-textSecondary font-medium">
              Signed in as: <span className="text-primary font-semibold">{userEmail}</span>
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-1.5 h-9 text-xs"
          >
            <LogOut size={12} />
            <span>Sign Out</span>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((c) => (
            <Card key={c.title} hoverEffect={false} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-textSecondary">{c.title}</span>
                <div className="p-2 bg-white/5 border border-white/5 rounded-xl">
                  {c.icon}
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-heading text-2xl font-extrabold text-textPrimary leading-none">
                  {c.value}
                </div>
                <p className="text-[10px] text-textMuted font-medium">{c.desc}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Action Panel & Recent List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Quick Actions (1 column) */}
          <div className="space-y-6 lg:col-span-1">
            <h3 className="font-heading text-sm uppercase tracking-wider font-extrabold text-textPrimary flex items-center gap-2">
              <Settings size={14} className="text-primary" />
              <span>Quick Actions</span>
            </h3>

            <div className="flex flex-col space-y-3">
              <Link to="/admin/trends/new">
                <Button className="w-full flex items-center justify-start gap-2.5 h-12 text-xs font-bold pl-5">
                  <Plus size={16} />
                  <span>Create Trend Guide</span>
                </Button>
              </Link>
              
              <Link to="/admin/trends">
                <Button variant="secondary" className="w-full flex items-center justify-start gap-2.5 h-12 text-xs font-bold pl-5">
                  <List size={16} />
                  <span>Manage Trend Guides</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Recently Added (2 columns) */}
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm uppercase tracking-wider font-extrabold text-textPrimary flex items-center gap-2">
                <ListCollapse size={14} className="text-secondary" />
                <span>Recently Added</span>
              </h3>
              <Link to="/admin/trends" className="text-xs text-secondary hover:underline flex items-center gap-0.5 font-bold">
                <span>View all</span>
                <ArrowRight size={10} />
              </Link>
            </div>

            <div className="space-y-4">
              {stats?.recentlyAdded && stats.recentlyAdded.length > 0 ? (
                stats.recentlyAdded.map((trend) => (
                  <Card 
                    key={trend.id}
                    hoverEffect={true}
                    className="p-4 flex items-center justify-between bg-white/[0.01]"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-10 rounded-lg overflow-hidden bg-neutral-900 border border-white/5 shrink-0">
                        <img 
                          src={trend.thumbnail_url} 
                          alt={trend.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-textPrimary leading-none">
                          {trend.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-[10px] text-textMuted">
                          <span>{trend.category?.name || 'N/A'}</span>
                          <span>•</span>
                          <span>{trend.difficulty}</span>
                        </div>
                      </div>
                    </div>

                    <Link to={`/admin/trends/edit/${trend.id}`}>
                      <Button variant="outline" size="sm" className="text-[10px] h-7 px-3 py-1 border-white/5">
                        Edit
                      </Button>
                    </Link>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10 bg-white/[0.01] border border-white/5 rounded-2xl">
                  <p className="text-xs text-textSecondary">No trends in database yet.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </>
  );
};
export default Dashboard;
