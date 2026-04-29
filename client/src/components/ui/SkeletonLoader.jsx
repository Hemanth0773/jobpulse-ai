export default function SkeletonLoader({ type = 'card', count = 1 }) {
  const skeletons = Array(count).fill(0);

  if (type === 'card') {
    return (
      <>
        {skeletons.map((_, i) => (
          <div key={i} className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-6 space-y-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl skeleton" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 skeleton" />
                <div className="h-3 w-1/3 skeleton" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full skeleton" />
              <div className="h-3 w-4/5 skeleton" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-16 skeleton rounded-full" />
              <div className="h-6 w-20 skeleton rounded-full" />
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-white/[0.06]">
              <div className="h-5 w-24 skeleton" />
              <div className="h-9 w-20 skeleton rounded-xl" />
            </div>
          </div>
        ))}
      </>
    );
  }

  if (type === 'text') {
    return (
      <div className="space-y-3 animate-pulse">
        {skeletons.map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-3/4 skeleton" />
            <div className="h-4 w-1/2 skeleton" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'avatar') {
    return (
      <div className="flex items-center gap-3 animate-pulse">
        <div className="w-10 h-10 rounded-full skeleton" />
        <div className="space-y-2">
          <div className="h-3 w-24 skeleton" />
          <div className="h-3 w-16 skeleton" />
        </div>
      </div>
    );
  }

  return null;
}
