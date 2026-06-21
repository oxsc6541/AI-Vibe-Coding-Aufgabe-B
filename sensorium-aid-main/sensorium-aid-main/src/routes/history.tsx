import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader, PageShell } from "@/components/PageHeader";
import { loadEpisodes } from "@/lib/sensoria-storage";
import type { Episode } from "@/lib/sensoria-types";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "Verlauf – Sensoria" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const [episodes, setEpisodes] = useState<Episode[] | null>(null);
  useEffect(() => {
    const list = [...loadEpisodes()].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    setEpisodes(list);
  }, []);

  return (
    <>
      <PageHeader title="Verlauf" />
      <PageShell>
        {episodes === null ? null : episodes.length === 0 ? (
          <p className="rounded-xl border border-border bg-card p-6 text-center text-muted-foreground">
            Noch keine Episoden erfasst.
          </p>
        ) : (
          <ul className="space-y-3">
            {episodes.map((e) => (
              <li key={e.id}>
                <Link
                  to="/history/$id"
                  params={{ id: e.id }}
                  className="block rounded-xl border border-border bg-card p-4 hover:bg-accent"
                >
                  <div className="flex items-center justify-between gap-3">
                    <time className="text-sm text-muted-foreground">
                      {formatTimestamp(e.timestamp)}
                    </time>
                    <span className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold">
                      Intensität {e.intensity}
                    </span>
                  </div>
                  <div className="mt-2 text-base font-medium">
                    {e.triggers.length > 0 ? e.triggers.join(", ") : "Keine Auslöser"}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Dauer: {e.durationMinutes} Min
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PageShell>
    </>
  );
}

function formatTimestamp(iso: string) {
  try {
    return new Date(iso).toLocaleString("de-DE", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}
