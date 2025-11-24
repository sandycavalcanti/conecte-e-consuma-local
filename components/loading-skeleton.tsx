export function EmpreendedorCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="w-full h-48 bg-muted rounded-lg mb-4" />
      <div className="h-6 bg-muted rounded w-3/4 mb-3" />
      <div className="h-4 bg-muted rounded w-1/2 mb-3" />
      <div className="h-4 bg-muted rounded w-full mb-2" />
      <div className="h-4 bg-muted rounded w-5/6" />
    </div>
  )
}

export function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <EmpreendedorCardSkeleton key={i} />
      ))}
    </div>
  )
}
