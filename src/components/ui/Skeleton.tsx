import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton = ({ className = '', ...props }: SkeletonProps) => {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-surface1/60 ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
