import { Link } from 'react-router-dom';
import { Video, Image, Music, Mic, User, Layers, HelpCircle, ArrowRight } from 'lucide-react';
import type { Category } from '../../types';
import { Card } from '../ui/card';

interface CategoryCardProps {
  category: Category;
  animateEntry?: boolean;
  delayIndex?: number;
}

export const CategoryIcon = ({ iconName, size = 20, className }: { iconName?: string; size?: number; className?: string }) => {
  switch (iconName) {
    case 'Video': return <Video size={size} className={className} />;
    case 'Image': return <Image size={size} className={className} />;
    case 'Music': return <Music size={size} className={className} />;
    case 'Mic': return <Mic size={size} className={className} />;
    case 'User': return <User size={size} className={className} />;
    case 'Layers': return <Layers size={size} className={className} />;
    default: return <HelpCircle size={size} className={className} />;
  }
};

export const CategoryCard = ({ category, animateEntry = true, delayIndex = 0 }: CategoryCardProps) => {
  return (
    <Link to={`/category/${category.slug}`} className="block h-full group">
      <Card 
        className="p-6 h-full flex flex-col justify-between"
        animateEntry={animateEntry}
        delayIndex={delayIndex}
      >
        <div className="space-y-4">
          {/* Icon */}
          <div className="w-12 h-12 rounded-2xl bg-surface1 border border-border1 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
            <CategoryIcon iconName={category.icon} size={22} />
          </div>

          {/* Texts */}
          <div className="space-y-2">
            <h3 className="font-heading text-lg font-medium text-textPrimary leading-none group-hover:text-secondary transition-colors duration-300">
              {category.name}
            </h3>
            <p className="text-xs text-textSecondary leading-relaxed">
              {category.description || 'Discover standard prompts and creation guides for this AI category.'}
            </p>
          </div>
        </div>

        {/* Read More */}
        <div className="flex items-center space-x-1 text-xs text-textMuted font-semibold mt-6 group-hover:text-textPrimary transition-colors duration-300">
          <span>Explore Trends</span>
          <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
        </div>
      </Card>
    </Link>
  );
};
export default CategoryCard;
