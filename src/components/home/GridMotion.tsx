import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './GridMotion.css';

interface GridMotionProps {
  items?: (string | React.ReactNode)[];
  gradientColor?: string;
}

export const GridMotion: React.FC<GridMotionProps> = ({ items = [], gradientColor = 'rgba(255, 255, 255, 0.85)' }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouseXRef = useRef(typeof window !== 'undefined' ? window.innerWidth / 2 : 500);

  const totalItems = 28;
  const defaultItems = Array.from({ length: totalItems }, (_, index) => `Item ${index + 1}`);
  const combinedItems = items.length > 0 ? items.slice(0, totalItems) : defaultItems;

  // If items length is less than 28, pad it by repeating
  const finalItems: (string | React.ReactNode)[] = [];
  if (combinedItems.length > 0) {
    while (finalItems.length < totalItems) {
      finalItems.push(...combinedItems);
    }
  }
  const displayItems = finalItems.slice(0, totalItems);

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);

    const handleMouseMove = (e: MouseEvent) => {
      mouseXRef.current = e.clientX;
    };

    const updateMotion = () => {
      const maxMoveAmount = 300;
      const baseDuration = 0.8;
      const inertiaFactors = [0.6, 0.4, 0.3, 0.2];

      rowRefs.current.forEach((row, index) => {
        if (row) {
          const direction = index % 2 === 0 ? 1 : -1;
          const moveAmount = ((mouseXRef.current / window.innerWidth) * maxMoveAmount - maxMoveAmount / 2) * direction;

          gsap.to(row, {
            x: moveAmount,
            duration: baseDuration + inertiaFactors[index % inertiaFactors.length],
            ease: 'power3.out',
            overwrite: 'auto'
          });
        }
      });
    };

    const removeAnimationLoop = gsap.ticker.add(updateMotion);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      removeAnimationLoop();
    };
  }, []);

  return (
    <div className="gridmotion-noscroll" ref={gridRef}>
      <section className="intro-grid">
        {/* Slanted grid container */}
        <div className="gridMotion-container">
          {[...Array(4)].map((_, rowIndex) => (
            <div key={rowIndex} className="row-grid" ref={el => (rowRefs.current[rowIndex] = el)}>
              {[...Array(7)].map((_, itemIndex) => {
                const content = displayItems[rowIndex * 7 + itemIndex];
                return (
                  <div key={itemIndex} className="row-grid__item">
                    <div className="row-grid__item-inner">
                      {typeof content === 'string' && content.startsWith('http') ? (
                        <div
                          className="row-grid__item-img"
                          style={{
                            backgroundImage: `url(${content})`
                          }}
                        ></div>
                      ) : (
                        <div className="row-grid__item-content">{content}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* The radial spotlight mask overlay on top of the grid to keep text legible */}
        <div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `radial-gradient(circle at center, rgba(255, 255, 255, 0.88) 0%, ${gradientColor} 45%, rgba(255, 255, 255, 0.0) 100%)`
          }}
        />
      </section>
    </div>
  );
};

export default GridMotion;
