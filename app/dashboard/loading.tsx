import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-12 w-48 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="glass-strong border-2 border-primary/20 p-6">
              <Skeleton className="h-5 w-24 mb-3" />
              <Skeleton className="h-10 w-32 mb-2" />
              <Skeleton className="h-4 w-20" />
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Missions */}
          <div className="lg:col-span-2">
            <Card className="glass-strong border-2 border-primary/30 p-6">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 glass rounded-lg border border-primary/20">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="glass-strong border-2 border-accent/30 p-6">
              <Skeleton className="h-8 w-32 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
