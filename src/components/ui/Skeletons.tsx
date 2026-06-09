import Skeleton from './Skeleton';

export const TrendCardSkeleton = () => {
  return (
    <div className="w-full max-w-[290px] sm:max-w-[320px] md:max-w-[350px] bg-[#12121e] rounded-[28px] border border-white/15 overflow-hidden flex flex-col p-2.5 space-y-4">
      {/* Thumbnail Frame */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-surface2/60">
        <Skeleton className="w-full h-full rounded-[20px]" />
      </div>

      {/* Opened Content Area */}
      <div className="px-3 pb-3 pt-1 flex-1 flex flex-col justify-between space-y-4">
        {/* Description */}
        <div className="space-y-2">
          {/* Overview label */}
          <Skeleton className="h-2 w-16 rounded-full" />
          {/* Description lines */}
          <Skeleton className="h-3.5 w-full rounded-full" />
          <Skeleton className="h-3.5 w-11/12 rounded-full" />
          <Skeleton className="h-3.5 w-2/3 rounded-full" />
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-white/5">
          <Skeleton className="w-full h-9 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const LatestGridSkeleton = ({ count = 8, showHeader = true }: { count?: number; showHeader?: boolean }) => {
  return (
    <div className="w-full py-2 space-y-8 relative z-10 animate-fade-in">
      {showHeader && (
        <div className="flex items-center justify-between border-b border-border1 pb-4">
          <div className="space-y-2 w-full max-w-sm">
            <Skeleton className="h-7 w-2/3 rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
        {Array.from({ length: count }).map((_, idx) => (
          <TrendCardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
};

export const FeaturedTrendsSkeleton = () => {
  return (
    <section className="w-full py-2 space-y-6 relative z-10 animate-fade-in">
      {/* Title & Scroll Buttons Header */}
      <div className="flex items-center justify-between border-b border-border1 pb-4">
        <div className="flex items-center space-x-3 w-full max-w-md">
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          <div className="space-y-2 w-full">
            <Skeleton className="h-6 w-1/3 rounded-full" />
            <Skeleton className="h-3.5 w-2/3 rounded-full" />
          </div>
        </div>

        {/* Scroll Navigation Buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>

      {/* Horizontal Scroll Area */}
      <div className="w-full overflow-hidden">
        <div className="flex space-x-6 items-start overflow-x-hidden pb-6 pt-2 px-1">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="w-[280px] sm:w-[300px] md:w-[320px] lg:w-[calc(25%-18px)] shrink-0">
              <TrendCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const TrendDetailSkeleton = () => {
  return (
    <div className="px-6 md:px-12 py-6 pt-16 space-y-6 animate-fade-in">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 w-64">
        <Skeleton className="h-3.5 w-16 rounded-full" />
        <span className="text-textMuted text-xs">/</span>
        <Skeleton className="h-3.5 w-20 rounded-full" />
        <span className="text-textMuted text-xs">/</span>
        <Skeleton className="h-3.5 w-24 rounded-full" />
      </div>

      {/* Main Detail Header Skeleton */}
      <div className="w-full p-6 md:p-8 rounded-[32px] border border-border1 bg-white/[0.03] backdrop-blur-md flex flex-col md:flex-row gap-6 md:gap-8 items-start relative overflow-hidden">
        {/* Thumbnail Preview Area */}
        <div className="w-full md:w-80 aspect-[16/10] md:h-52 rounded-2xl bg-surface2/60 shrink-0 relative overflow-hidden">
          <Skeleton className="w-full h-full rounded-2xl" />
        </div>

        {/* Header Text Details */}
        <div className="flex-1 space-y-4 w-full">
          <div className="space-y-2">
            {/* Category badge */}
            <Skeleton className="h-5 w-24 rounded-full" />
            {/* Title */}
            <Skeleton className="h-8 md:h-10 w-3/4 rounded-full" />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-5/6 rounded-full" />
            <Skeleton className="h-4 w-2/3 rounded-full" />
          </div>

          {/* Stats Bar / Badges */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
        {/* Left Side: Tabs + Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tab Selector */}
          <div className="flex space-x-2 border-b border-border1 pb-3">
            <Skeleton className="h-9 w-32 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-full" />
            <Skeleton className="h-9 w-36 rounded-full" />
          </div>

          {/* Guide Steps Cards */}
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="p-6 bg-surface2 border border-border1 rounded-[24px] space-y-4">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <Skeleton className="h-6 w-1/2 rounded-full" />
                </div>
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-3.5 w-full rounded-full" />
                  <Skeleton className="h-3.5 w-11/12 rounded-full" />
                  <Skeleton className="h-3.5 w-4/5 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Sidebar */}
        <div className="space-y-8">
          {/* Tools Used Box */}
          <div className="p-6 bg-surface2 border border-border1 rounded-2xl space-y-4">
            <Skeleton className="h-5 w-1/3 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>

          {/* Related Guides Box */}
          <div className="p-6 bg-surface2 border border-border1 rounded-2xl space-y-4">
            <Skeleton className="h-5 w-1/2 rounded-full" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex space-x-3 items-center">
                  <Skeleton className="w-16 h-12 rounded-lg shrink-0" />
                  <div className="space-y-1.5 w-full">
                    <Skeleton className="h-3.5 w-5/6 rounded-full" />
                    <Skeleton className="h-3 w-1/2 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CategorySkeleton = () => {
  return (
    <div className="space-y-8 px-6 md:px-12 py-6 pt-16 animate-fade-in">
      {/* Back Link */}
      <div className="inline-flex items-center space-x-1.5">
        <Skeleton className="h-3.5 w-24 rounded-full" />
      </div>

      {/* Category Hero Banner */}
      <div className="relative w-full p-8 md:p-12 rounded-3xl border border-white/15 bg-[#12121e] flex flex-col md:flex-row md:items-center gap-6">
        <Skeleton className="w-16 h-16 rounded-2xl bg-surface2/60 shrink-0" />
        <div className="space-y-3 flex-1 w-full">
          <Skeleton className="h-8 w-48 rounded-full" />
          <Skeleton className="h-4 w-full max-w-xl rounded-full" />
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex justify-between items-center border-b border-border1 pb-4">
        <Skeleton className="h-4.5 w-20 rounded-full" />
        <Skeleton className="h-8 w-40 rounded-full" />
      </div>

      {/* Results Grid Skeleton */}
      <LatestGridSkeleton count={3} showHeader={false} />
    </div>
  );
};
