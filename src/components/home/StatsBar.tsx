import { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';
import { Library, LayoutGrid, Terminal } from 'lucide-react';
import { dbService } from '../../services/db';

const Counter = ({ value, suffix = '', duration = 1.2 }: { value: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const end = value;
      if (end === 0) return;

      const totalMiliseconds = duration * 1000;
      const steps = 40;
      const stepTime = totalMiliseconds / steps;
      const stepValue = end / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          clearInterval(timer);
          setCount(end);
        } else {
          setCount(Math.floor(stepValue * currentStep));
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

export const StatsBar = () => {
  const [stats, setStats] = useState({ trends: 0, categories: 0, prompts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [trends, categories, promptsCount] = await Promise.all([
          dbService.getTrends(),
          dbService.getCategories(),
          dbService.getPromptsCount()
        ]);

        setStats({
          trends: trends.length,
          categories: categories.length,
          prompts: promptsCount || 6, // Fallback to seed prompts count
        });
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-8 border-y border-border1 bg-surface1/20 animate-pulse">
        <div className="w-full px-6 md:px-12 grid grid-cols-3 gap-4 h-12" />
      </div>
    );
  }

  const statItems = [
    {
      label: 'AI Trends',
      value: stats.trends,
      suffix: '+',
      icon: <Library className="text-[#ff7759]" size={20} />,
    },
    {
      label: 'Categories',
      value: stats.categories,
      suffix: '',
      icon: <LayoutGrid className="text-[#ff7759]" size={20} />,
    },
    {
      label: 'Total Prompts',
      value: stats.prompts,
      suffix: '+',
      icon: <Terminal className="text-emerald-400" size={20} />,
    },
  ];

  return (
    <div className="w-full py-4 border-y border-neutral-200 bg-[#eeece7] relative z-10">
      <div className="w-full px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
        {statItems.map((item) => (
          <div 
            key={item.label}
            className="flex items-center justify-center space-x-4 md:border-r last:border-r-0 border-neutral-300/60"
          >
            <div className="p-3 bg-white border border-neutral-200 rounded-2xl shadow-sm">
              {item.icon}
            </div>
            <div className="text-left">
              <div className="font-heading text-2xl md:text-3xl font-bold text-[#17171c] leading-none mb-1">
                <Counter value={item.value} suffix={item.suffix} />
              </div>
              <div className="text-[10px] text-[#616161] uppercase tracking-widest font-bold font-mono">
                {item.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default StatsBar;
