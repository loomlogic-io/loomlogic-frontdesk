import { LoadingShell } from "@/components/shared/loading-shell";

export default function RootLoading() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-16">
      <LoadingShell />
    </main>
  );
}
