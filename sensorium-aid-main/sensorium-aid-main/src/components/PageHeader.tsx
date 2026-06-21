import { useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export function PageHeader({ title, backTo = "/" }: { title: string; backTo?: string }) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-xl items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) router.history.back();
            else router.navigate({ to: backTo });
          }}
          className="inline-flex h-12 items-center gap-1 rounded-lg border border-border bg-secondary px-3 text-base font-medium text-secondary-foreground hover:bg-accent"
          aria-label="Zurück"
        >
          <ChevronLeft className="h-5 w-5" />
          Zurück
        </button>
        <h1 className="flex-1 truncate text-lg font-semibold">{title}</h1>
      </div>
    </header>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto max-w-xl px-4 pb-28 pt-4">{children}</main>;
}
