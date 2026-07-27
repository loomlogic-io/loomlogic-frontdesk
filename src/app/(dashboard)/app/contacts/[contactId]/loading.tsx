export default function ContactDetailLoading() {
  return (
    <div aria-label="Loading contact" aria-live="polite" className="animate-pulse">
      <div className="bg-surface-strong h-4 w-24 rounded" />
      <div className="bg-surface-strong mt-7 h-8 w-64 rounded" />
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="bg-surface h-64 rounded-[var(--radius-panel)]" />
        <div className="bg-surface h-80 rounded-[var(--radius-panel)]" />
      </div>
    </div>
  );
}
