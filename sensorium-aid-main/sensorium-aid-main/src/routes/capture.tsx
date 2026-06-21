import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader, PageShell } from "@/components/PageHeader";
import { EpisodeForm } from "@/components/EpisodeForm";
import { addEpisode, loadCustomTriggers, newId } from "@/lib/sensoria-storage";

export const Route = createFileRoute("/capture")({
  head: () => ({ meta: [{ title: "Episode erfassen – Sensoria" }] }),
  component: CapturePage,
});

function CapturePage() {
  const navigate = useNavigate();
  const [extra, setExtra] = useState<string[]>([]);
  useEffect(() => setExtra(loadCustomTriggers()), []);
  return (
    <>
      <PageHeader title="Episode erfassen" />
      <PageShell>
        <EpisodeForm
          extraTriggers={extra}
          onSubmit={(data) => {
            const { timestamp, ...rest } = data;
            addEpisode({
              id: newId(),
              timestamp: timestamp ?? new Date().toISOString(),
              ...rest,
            });
            navigate({ to: "/history" });
          }}
        />
      </PageShell>
    </>
  );
}
