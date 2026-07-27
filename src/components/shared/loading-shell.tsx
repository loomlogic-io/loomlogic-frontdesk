export function LoadingShell() {
  return (
    <div aria-label="Loading page" className="animate-pulse space-y-8" role="status">
      <span className="sr-only">Loading</span>
      <div className="space-y-3 border-b pb-7">
        <div className="bg-surface-strong h-7 w-44 rounded-md" />
        <div className="bg-surface-strong h-4 max-w-xl rounded-md" />
      </div>
      <div className="space-y-4 py-12">
        <div className="bg-surface-strong size-11 rounded-[var(--radius-panel)]" />
        <div className="bg-surface-strong h-6 w-56 rounded-md" />
        <div className="bg-surface-strong h-4 max-w-md rounded-md" />
        <div className="bg-surface-strong h-4 w-72 rounded-md" />
      </div>
    </div>
  );
}
