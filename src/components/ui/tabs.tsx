import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs = ({ tabs, activeTab, onChange, className }: TabsProps) => {
  return (
    <div className={cn('flex space-x-1 bg-white/5 border border-white/5 p-1 rounded-full', className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative px-4 py-2 text-xs md:text-sm font-semibold rounded-full transition-colors duration-300 focus:outline-none cursor-pointer',
              isActive ? 'text-textPrimary' : 'text-textSecondary hover:text-textPrimary'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 border border-primary/40 rounded-full"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
