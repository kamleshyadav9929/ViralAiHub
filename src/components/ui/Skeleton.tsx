import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton = ({ className = '', ...props }: SkeletonProps) => {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-white/10 ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
