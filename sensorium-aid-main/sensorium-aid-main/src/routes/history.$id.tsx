import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader, PageShell } from "@/components/PageHeader";
import { deleteEpisode, getEpisode } from "@/lib/sensoria-storage";
import type { Episode } from "@/lib/sensoria-types";

export const Route = createFileRoute("/history/$id")({
  head: () => ({ meta: [{ title: "Episode – Sensoria" }] }),
  component: EpisodeDetail,
});

function EpisodeDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [episode, setEpisode] = useState<Episode | null | undefined>(undefined);

  useEffect(() => {
    setEpisode(getEpisode(id) ?? null);
  }, [id]);

  return (
    <>
      <PageHeader title="Episode" backTo="/history" />
      <PageShell>
        {episode === undefined ? null : episode === null ? (
          <p className="rounded-xl border border-border bg-card p-6 text-center text-muted-foreground">
            Episode nicht gefunden.
          </p>
        ) : (
          <div className="space-y-6">
            <Row label="Zeitpunkt" value={new Date(episode.timestamp).toLocaleString("de-DE", { dateStyle: "long", timeStyle: "short" })} />
            <Row label="Intensität" value={`${episode.intensity} / 5`} />
            <Row label="Dauer" value={`${episode.durationMinutes} Minuten`} />
            <Row
              label="Auslöser"
              value={episode.triggers.length ? episode.triggers.join(", ") : "—"}
            />
            {episode.triggersOther && <Row label="Sonstige Auslöser" value={episode.triggersOther} />}
            <Row
              label="Coping-Strategien"
              value={episode.coping.length ? episode.coping.join(", ") : "—"}
            />
            {episode.copingOther && <Row label="Sonstige Strategien" value={episode.copingOther} />}
            {episode.notes && <Row label="Notiz" value={episode.notes} />}

            <div className="grid grid-cols-2 gap-3 pt-4">
              <Link
                to="/history/$id/edit"
                params={{ id: episode.id }}
                className="flex h-14 items-center justify-center rounded-xl bg-primary text-base font-semibold text-primary-foreground"
              >
                Bearbeiten
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Diese Episode wirklich löschen?")) {
                    deleteEpisode(episode.id);
                    navigate({ to: "/history" });
                  }
                }}
                className="h-14 rounded-xl border border-destructive bg-card text-base font-semibold text-destructive"
              >
                Löschen
              </button>
            </div>
          </div>
        )}
      </PageShell>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 whitespace-pre-wrap text-base text-foreground">{value}</div>
    </div>
  );
}
