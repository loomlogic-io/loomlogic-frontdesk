export default function ConversationDetailLoading() {
  return (
    <div aria-label="Loading conversation" aria-live="polite" className="animate-pulse">
      <div className="bg-surface-strong h-4 w-20 rounded" />
      <div className="bg-surface-strong mt-7 h-8 w-80 max-w-full rounded" />
      <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="bg-surface h-96 rounded-[var(--radius-panel)]" />
        <div className="bg-surface h-56 rounded-[var(--radius-panel)]" />
      </div>
    </div>
  );
}
