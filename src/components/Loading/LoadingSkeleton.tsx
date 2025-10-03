interface LoadingSkeletonProps {
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
          <div className="h-6 bg-white/20 rounded mb-3 w-3/4"></div>
          <div className="h-4 bg-white/10 rounded mb-2 w-1/4"></div>
          <div className="h-4 bg-white/10 rounded mb-4 w-full"></div>
          <div className="h-4 bg-white/10 rounded mb-4 w-5/6"></div>
          <div className="flex gap-2 mb-4">
            <div className="h-6 bg-white/10 rounded-full w-16"></div>
            <div className="h-6 bg-white/10 rounded-full w-20"></div>
          </div>
          <div className="h-10 bg-white/20 rounded-lg w-full"></div>
        </div>
      ))}
    </div>
  );
};
