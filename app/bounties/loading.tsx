import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function BountiesLoading() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Skeleton */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-12 w-64 mb-2" />
            <Skeleton className="h-6 w-40" />
          </div>
          <Skeleton className="h-12 w-36" />
        </div>

        {/* Search and Filters Skeleton */}
        <Card className="glass-strong border-2 border-primary/30 p-6 mb-8">
          <Skeleton className="h-10 w-full mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        </Card>

        {/* Bounty Cards Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="glass-strong border-2 border-primary/30 p-6">
              <div className="flex justify-between mb-4">
                <div className="flex-1">
                  <div className="flex gap-2 mb-3">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-8 w-20 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              <Skeleton className="h-12 w-full mb-4" />
              <div className="flex gap-4 mb-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-primary/20">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-10 w-24" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
