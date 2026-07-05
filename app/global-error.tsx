"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void error;
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center px-4">
          <div className="mb-6 flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-destructive/10">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="mb-2 text-2xl font-bold">Something went wrong</h1>
          <p className="mb-8 max-w-md mx-auto text-muted-foreground">
            A critical error occurred. Please refresh the page or try again later.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={reset}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Try Again
            </button>
            <a
              href="/"
              className="px-4 py-2 rounded-md border border-border hover:bg-muted"
            >
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
