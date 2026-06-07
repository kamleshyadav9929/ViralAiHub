import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Trash2, Edit3, ArrowLeft, Search, Plus, Star, Eye } from 'lucide-react';
import { useTrends, useTrendActions } from '../../hooks/useTrends';
import { Dialog } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { useToast } from '../../components/ui/toast';

export const TrendsList = () => {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch trends
  const { trends, loading, refetch } = useTrends();
  const { deleteTrend, actionLoading } = useTrendActions();

  // Dialog deletion state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await deleteTrend(deleteId);
      toast.show('Trend guide deleted successfully!');
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
      refetch();
    } catch (err) {
      console.error(err);
      toast.show('Failed to delete trend guide.');
    }
  };

  // Filter trends locally for immediate responsive searches
  const filteredTrends = trends.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.tools?.some(tool => tool.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <Helmet>
        <title>Manage Trends | ViralAI Hub</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-8 px-6 md:px-12 py-6">
        
        {/* Back Link */}
        <div className="flex items-center justify-between border-b border-border1 pb-4">
          <div className="space-y-1">
            <Link 
              to="/admin/dashboard" 
              className="inline-flex items-center space-x-1.5 text-xs text-textMuted hover:text-textPrimary transition-colors"
            >
              <ArrowLeft size={12} />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-textPrimary">
              Manage Trend Guides
            </h1>
          </div>

          <Link to="/admin/trends/new">
            <Button size="sm" className="flex items-center gap-1.5 text-xs font-bold">
              <Plus size={14} />
              <span>Add Trend</span>
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-textMuted">
            <Search size={14} />
          </div>
          <input
            type="text"
            placeholder="Search within admin library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-border1 rounded-full pl-10 pr-4 py-2 text-xs text-textPrimary focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Table View */}
        {loading ? (
          <div className="min-h-[30vh] flex flex-col items-center justify-center py-10">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 border-3 border-border1 rounded-full" />
              <div className="absolute inset-0 border-3 border-t-primary border-r-secondary rounded-full animate-spin" />
            </div>
            <span className="text-xs text-textSecondary font-semibold mt-3">Fetching trend entries...</span>
          </div>
        ) : filteredTrends.length === 0 ? (
          <div className="text-center py-16 bg-surface1 border border-border1 rounded-2xl">
            <p className="text-xs text-textSecondary">No trends found matching search query.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto rounded-2xl border border-border1 bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border1 bg-surface1 text-textPrimary font-bold uppercase tracking-wider">
                  <th className="p-4 w-20">Preview</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Tools Used</th>
                  <th className="p-4">Stats</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border1">
                {filteredTrends.map((trend) => (
                  <tr key={trend.id} className="hover:bg-surface2 transition-colors text-textSecondary hover:text-textPrimary">
                    {/* Thumbnail */}
                    <td className="p-4">
                      <div className="w-12 h-9 rounded bg-surface2 border border-border1 overflow-hidden">
                        <img 
                          src={trend.thumbnail_url} 
                          alt={trend.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    
                    {/* Title */}
                    <td className="p-4 font-bold text-textPrimary max-w-[200px] truncate">
                      {trend.title}
                    </td>

                    {/* Category */}
                    <td className="p-4 font-medium">
                      {trend.category?.name || 'AI Video'}
                    </td>

                    {/* Tools */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {trend.tools?.slice(0, 2).map(tool => (
                          <span key={tool} className="bg-surface1 border border-border1 px-2 py-0.5 rounded text-[10px]">
                            {tool}
                          </span>
                        ))}
                        {trend.tools && trend.tools.length > 2 && (
                          <span className="text-[10px] text-textMuted">+{trend.tools.length - 2}</span>
                        )}
                      </div>
                    </td>

                    {/* Stats */}
                    <td className="p-4 font-medium">
                      <div className="flex items-center gap-1">
                        <Eye size={12} className="text-textMuted" />
                        <span>{trend.view_count || 0}</span>
                      </div>
                    </td>

                    {/* Featured */}
                    <td className="p-4">
                      {trend.is_featured ? (
                        <div className="text-amber-400">
                          <Star size={14} className="fill-amber-400" />
                        </div>
                      ) : (
                        <span className="text-textMuted">-</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Link to={`/admin/trends/edit/${trend.id}`}>
                          <Button variant="outline" className="h-7 w-7 p-0 rounded-full border-border1">
                            <Edit3 size={12} />
                          </Button>
                        </Link>
                        
                        <Button
                          variant="outline"
                          className="h-7 w-7 p-0 rounded-full border-border1 hover:bg-rose-500/10 hover:text-rose-400"
                          onClick={() => {
                            setDeleteId(trend.id);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Dialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          title="Delete Trend Guide?"
        >
          <div className="space-y-4">
            <p className="text-xs leading-relaxed text-textSecondary">
              Are you sure you want to delete this trend guide? This will permanently delete the guide, its steps, prompt codes, and references from the system. This action cannot be undone.
            </p>
            
            <div className="flex items-center justify-end space-x-3 border-t border-border1 pt-4 mt-2">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDeleteConfirm}
                disabled={actionLoading}
                className="bg-rose-500/10 hover:bg-rose-500 border-rose-500/20 text-rose-400 hover:text-white"
              >
                {actionLoading ? 'Deleting...' : 'Delete Permanently'}
              </Button>
            </div>
          </div>
        </Dialog>

      </div>
    </>
  );
};
export default TrendsList;
