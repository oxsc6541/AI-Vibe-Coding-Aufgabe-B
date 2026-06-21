import { useState } from "react";
import {
  COPING_TAGS,
  TRIGGER_TAGS,
  type Episode,
} from "@/lib/sensoria-types";

interface Props {
  initial?: Partial<Episode>;
  onSubmit: (data: Omit<Episode, "id" | "timestamp"> & { timestamp?: string }) => void;
  submitLabel?: string;
  extraTriggers?: string[];
}

export function EpisodeForm({ initial, onSubmit, submitLabel = "Speichern", extraTriggers = [] }: Props) {
  const initialDate = initial?.timestamp ? new Date(initial.timestamp) : new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const toDateInput = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const toTimeInput = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

  const [date, setDate] = useState<string>(toDateInput(initialDate));
  const [time, setTime] = useState<string>(toTimeInput(initialDate));
  const [triggers, setTriggers] = useState<string[]>(initial?.triggers ?? []);
  const [triggersOther, setTriggersOther] = useState(initial?.triggersOther ?? "");
  const [intensity, setIntensity] = useState<number>(initial?.intensity ?? 3);
  const [duration, setDuration] = useState<number>(initial?.durationMinutes ?? 10);
  const [coping, setCoping] = useState<string[]>(initial?.coping ?? []);
  const [copingOther, setCopingOther] = useState(initial?.copingOther ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const allTriggers = [...TRIGGER_TAGS.filter((t) => t !== "Sonstiges"), ...extraTriggers, "Sonstiges"];

  const toggle = (arr: string[], v: string, set: (x: string[]) => void) => {
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const [y, m, d] = date.split("-").map((n) => parseInt(n, 10));
        const [hh, mm] = time.split(":").map((n) => parseInt(n, 10));
        const ts = new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0);
        onSubmit({
          timestamp: isNaN(ts.getTime()) ? undefined : ts.toISOString(),
          triggers,
          triggersOther: triggers.includes("Sonstiges") ? triggersOther : undefined,
          intensity: Math.min(5, Math.max(1, intensity)) as 1 | 2 | 3 | 4 | 5,
          durationMinutes: Math.max(0, duration),
          coping,
          copingOther: coping.includes("Sonstiges") ? copingOther : undefined,
          notes: notes.trim() || undefined,
        });
      }}
      className="space-y-7"
    >
      <Section title="Datum & Uhrzeit">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-14 w-full rounded-lg border border-input bg-card px-4 text-lg"
            aria-label="Datum"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="h-14 w-full rounded-lg border border-input bg-card px-4 text-lg"
            aria-label="Uhrzeit"
          />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Voreingestellt auf jetzt — anpassbar für nachträgliche Einträge.
        </p>
      </Section>


      <Section title="Auslöser">
        <TagGrid tags={allTriggers} selected={triggers} onToggle={(t) => toggle(triggers, t, setTriggers)} />
        {triggers.includes("Sonstiges") && (
          <input
            type="text"
            value={triggersOther}
            onChange={(e) => setTriggersOther(e.target.value)}
            placeholder="Sonstige Auslöser beschreiben"
            className="mt-3 w-full rounded-lg border border-input bg-card px-4 py-3 text-base"
          />
        )}
      </Section>

      <Section title="Intensität">
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => setIntensity(n)}
              className={`h-14 rounded-lg border text-xl font-semibold ${
                intensity === n
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-accent"
              }`}
              aria-pressed={intensity === n}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">1 = leicht, 5 = sehr stark</p>
      </Section>

      <Section title="Dauer (Minuten)">
        <input
          type="number"
          min={0}
          inputMode="numeric"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value || "0", 10))}
          className="w-full rounded-lg border border-input bg-card px-4 py-3 text-lg"
        />
      </Section>

      <Section title="Coping-Strategien">
        <TagGrid tags={COPING_TAGS} selected={coping} onToggle={(t) => toggle(coping, t, setCoping)} />
        {coping.includes("Sonstiges") && (
          <input
            type="text"
            value={copingOther}
            onChange={(e) => setCopingOther(e.target.value)}
            placeholder="Sonstige Strategien beschreiben"
            className="mt-3 w-full rounded-lg border border-input bg-card px-4 py-3 text-base"
          />
        )}
      </Section>

      <Section title="Notiz (optional)">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Was möchtest du festhalten?"
          className="w-full rounded-lg border border-input bg-card px-4 py-3 text-base"
        />
      </Section>

      <button
        type="submit"
        className="h-14 w-full rounded-xl bg-primary text-lg font-semibold text-primary-foreground hover:opacity-95"
      >
        {submitLabel}
      </button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function TagGrid({
  tags,
  selected,
  onToggle,
}: {
  tags: readonly string[];
  selected: string[];
  onToggle: (t: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => {
        const active = selected.includes(t);
        return (
          <button
            type="button"
            key={t}
            onClick={() => onToggle(t)}
            className={`min-h-12 rounded-full border px-4 py-2 text-base ${
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:bg-accent"
            }`}
            aria-pressed={active}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}
