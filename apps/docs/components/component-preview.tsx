export function ComponentPreview({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-large border p-10">
      {children}
    </div>
  );
}
