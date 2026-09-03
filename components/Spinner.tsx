// Always renders a status region: visible text when labelled, sr-only
// otherwise, so a spinner without a caption is still announced.
export function Spinner({ label }: { label?: string }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3">
      <div
        aria-hidden="true"
        className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin"
      />
      <p role="status" className={label ? "text-gray-600 text-sm" : "sr-only"}>
        {label ?? "Loading…"}
      </p>
    </main>
  );
}
