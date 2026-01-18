import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function GuildsLoading() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-16 w-96 mx-auto mb-6" />
          <Skeleton className="h-6 w-3/4 max-w-2xl mx-auto" />
        </div>

        {/* Filters Skeleton */}
        <Card className="glass-strong border-2 border-primary/30 p-6 mb-8">
          <div className="flex gap-4 flex-wrap">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
        </Card>

        {/* Guild Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="glass-strong border-2 border-primary/20 p-6">
              <div className="flex items-start gap-3 mb-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-20 w-full mb-4" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
