export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="relative z-10 text-center space-y-6">
        {/* Animated Logo/Icon */}
        <div className="w-24 h-24 mx-auto relative">
          <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          <div className="absolute inset-3 rounded-full border-4 border-accent/30 border-t-accent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
          <div className="absolute inset-6 rounded-full border-4 border-secondary/30 border-t-secondary animate-spin" style={{ animationDuration: '0.7s' }} />
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-black font-heading text-gradient-primary">
            Loading
          </h2>
          <p className="text-sm text-muted-foreground animate-pulse">
            Initializing systems...
          </p>
        </div>

        {/* Progress Bars */}
        <div className="w-64 space-y-2">
          <div className="h-1 bg-primary/20 rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: '60%' }} />
          </div>
          <div className="h-1 bg-accent/20 rounded-full overflow-hidden">
            <div className="h-full bg-accent" style={{ width: '80%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
