import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader, PageShell } from "@/components/PageHeader";
import { loadEpisodes } from "@/lib/sensoria-storage";
import { TRIGGER_TAGS } from "@/lib/sensoria-types";
import type { Episode } from "@/lib/sensoria-types";

export const Route = createFileRoute("/stats")({
  head: () => ({ meta: [{ title: "Statistik – Sensoria" }] }),
  component: StatsPage,
});

function StatsPage() {
  const [episodes, setEpisodes] = useState<Episode[] | null>(null);
  useEffect(() => {
    setEpisodes(loadEpisodes());
  }, []);

  return (
    <>
      <PageHeader title="Statistik" />
      <PageShell>
        {episodes === null ? null : episodes.length < 3 ? (
          <EmptyState />
        ) : (
          <Dashboard episodes={episodes} />
        )}
      </PageShell>
    </>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-border bg-card p-8 text-center">
      <h2 className="text-lg font-semibold">Noch nicht genug Daten für eine Statistik</h2>
      <p className="mt-2 text-muted-foreground">
        Erfasse mindestens drei Episoden, um Auswertungen zu sehen.
      </p>
      <Link
        to="/capture"
        className="mt-6 inline-flex h-12 items-center rounded-lg bg-primary px-5 text-base font-semibold text-primary-foreground hover:opacity-90"
      >
        Episode erfassen
      </Link>
    </div>
  );
}

function Dashboard({ episodes }: { episodes: Episode[] }) {
  const total = episodes.length;
  const avgIntensity =
    episodes.reduce((s, e) => s + e.intensity, 0) / total;
  const avgDuration =
    episodes.reduce((s, e) => s + e.durationMinutes, 0) / total;

  const triggerCounts = TRIGGER_TAGS.map((tag) => ({
    name: tag,
    count: episodes.filter((e) => e.triggers.includes(tag)).length,
  })).filter((d) => d.count > 0);

  const intensityOverTime = [...episodes]
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
    .map((e) => ({
      label: new Date(e.timestamp).toLocaleString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      intensity: e.intensity,
    }));

  const axisColor = "hsl(var(--muted-foreground))";
  const gridColor = "hsl(var(--border))";
  const barColor = "hsl(var(--primary))";

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-3 gap-3">
        <StatCard label="Episoden" value={String(total)} />
        <StatCard label="Ø Intensität" value={avgIntensity.toFixed(1)} />
        <StatCard label="Ø Dauer" value={`${Math.round(avgDuration)} min`} />
      </section>

      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-3 text-base font-semibold">Häufigkeit nach Auslöser</h2>
        {triggerCounts.length === 0 ? (
          <p className="text-sm text-muted-foreground">Keine Auslöser erfasst.</p>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={triggerCounts} margin={{ left: -20, right: 8, top: 8, bottom: 8 }}>
                <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke={axisColor}
                  fontSize={11}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke={axisColor} fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                />
                <Bar dataKey="count" fill={barColor} radius={[6, 6, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-3 text-base font-semibold">Intensität über Zeit</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={intensityOverTime}
              margin={{ left: -20, right: 8, top: 8, bottom: 8 }}
            >
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" stroke={axisColor} fontSize={11} />
              <YAxis
                stroke={axisColor}
                fontSize={12}
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 13,
                }}
              />
              <Line
                type="monotone"
                dataKey="intensity"
                stroke={barColor}
                strokeWidth={2}
                dot={{ r: 3 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-center">
      <div className="text-xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
