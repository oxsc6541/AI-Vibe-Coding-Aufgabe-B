import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader, PageShell } from "@/components/PageHeader";
import { EpisodeForm } from "@/components/EpisodeForm";
import { getEpisode, loadCustomTriggers, updateEpisode } from "@/lib/sensoria-storage";
import type { Episode } from "@/lib/sensoria-types";

export const Route = createFileRoute("/history/$id/edit")({
  head: () => ({ meta: [{ title: "Episode bearbeiten – Sensoria" }] }),
  component: EditPage,
});

function EditPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [ep, setEp] = useState<Episode | null | undefined>(undefined);
  const [extra, setExtra] = useState<string[]>([]);

  useEffect(() => {
    setEp(getEpisode(id) ?? null);
    setExtra(loadCustomTriggers());
  }, [id]);

  return (
    <>
      <PageHeader title="Episode bearbeiten" />
      <PageShell>
        {ep === undefined ? null : ep === null ? (
          <p className="rounded-xl border border-border bg-card p-6 text-center text-muted-foreground">
            Episode nicht gefunden.
          </p>
        ) : (
          <EpisodeForm
            initial={ep}
            extraTriggers={extra}
            submitLabel="Änderungen speichern"
            onSubmit={(data) => {
              updateEpisode({ ...ep, ...data });
              navigate({ to: "/history/$id", params: { id: ep.id } });
            }}
          />
        )}
      </PageShell>
    </>
  );
}
