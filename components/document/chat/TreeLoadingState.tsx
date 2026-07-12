"use client";

export default function TreeLoadingState() {
  return (
    <div className="p-3 space-y-2">
      <div className="mb-3 h-4 w-32 rounded bg-muted animate-pulse" />
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-8 rounded bg-muted animate-pulse"
          style={{ marginLeft: `${(i % 3) * 12}px`, width: `${100 - (i % 3) * 15}%` }}
        />
      ))}
    </div>
  );
}
