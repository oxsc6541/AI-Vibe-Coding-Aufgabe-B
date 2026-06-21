import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageHeader, PageShell } from "@/components/PageHeader";
import {
  loadCustomTriggers,
  loadEpisodes,
  loadProfile,
  saveCustomTriggers,
  saveProfile,
} from "@/lib/sensoria-storage";
import type { Episode, Profile } from "@/lib/sensoria-types";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Konto – Sensoria" }] }),
  component: AccountPage,
});

function AccountPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [exporting, setExporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProfile(loadProfile());
    setCustomTags(loadCustomTriggers());
  }, []);

  if (!profile) {
    return (
      <>
        <PageHeader title="Konto" />
        <PageShell>{null}</PageShell>
      </>
    );
  }

  const update = (p: Profile) => {
    setProfile(p);
    saveProfile(p);
  };

  const onPickFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => update({ ...profile, avatarDataUrl: String(reader.result) });
    reader.readAsDataURL(file);
  };

  const startEditName = () => {
    setNameDraft(profile.name);
    setEditingName(true);
  };

  const commitName = () => {
    const v = nameDraft.trim();
    if (v) update({ ...profile, name: v });
    setEditingName(false);
  };

  const addTag = () => {
    const v = newTag.trim();
    if (!v) return;
    if (customTags.includes(v)) {
      setNewTag("");
      return;
    }
    const next = [...customTags, v];
    setCustomTags(next);
    saveCustomTriggers(next);
    setNewTag("");
  };

  const removeTag = (t: string) => {
    const next = customTags.filter((x) => x !== t);
    setCustomTags(next);
    saveCustomTriggers(next);
  };

  const exportPdf = async () => {
    setExporting(true);
    try {
      const { jsPDF } = await import("jspdf");
      const episodes = [...loadEpisodes()].sort((a, b) =>
        b.timestamp.localeCompare(a.timestamp),
      );
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 48;
      let y = margin;

      const ensureSpace = (needed: number) => {
        if (y + needed > pageH - margin) {
          doc.addPage();
          y = margin;
        }
      };

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("Sensoria – Episoden-Export", margin, y);
      y += 24;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(110);
      doc.text(
        `Erstellt am ${new Date().toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" })} · ${episodes.length} Episode${episodes.length === 1 ? "" : "n"}`,
        margin,
        y,
      );
      doc.setTextColor(0);
      y += 24;

      if (episodes.length === 0) {
        doc.setFontSize(12);
        doc.text("Keine Episoden vorhanden.", margin, y);
      }

      const line = (label: string, value: string) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(label, margin, y);
        doc.setFont("helvetica", "normal");
        const wrapped = doc.splitTextToSize(value || "—", pageW - margin * 2 - 90);
        doc.text(wrapped, margin + 90, y);
        y += wrapped.length * 13;
      };

      episodes.forEach((e, idx) => {
        ensureSpace(140);
        doc.setDrawColor(220);
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageW - margin, y);
        y += 16;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text(`Episode ${idx + 1}`, margin, y);
        y += 18;

        line("Datum/Zeit:", formatTs(e.timestamp));
        line("Auslöser:", formatTriggers(e));
        line("Intensität:", `${e.intensity} / 5`);
        line("Dauer:", `${e.durationMinutes} Min`);
        line("Coping:", formatCoping(e));
        line("Notiz:", e.notes ?? "—");
        y += 8;
      });

      const total = doc.getNumberOfPages();
      for (let i = 1; i <= total; i++) {
        doc.setPage(i);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(140);
        doc.text(`Seite ${i} / ${total}`, pageW - margin, pageH - 20, { align: "right" });
        doc.setTextColor(0);
      }

      const stamp = new Date().toISOString().slice(0, 10);
      doc.save(`sensoria-episoden-${stamp}.pdf`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <PageHeader title="Konto" />
      <PageShell>
        <section className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary text-2xl font-semibold text-secondary-foreground"
            aria-label="Profilbild ändern"
          >
            {profile.avatarDataUrl ? (
              <img src={profile.avatarDataUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              profile.name.slice(0, 1).toUpperCase()
            )}
          </button>
          <div className="min-w-0 flex-1">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              Profilname
            </span>
            {editingName ? (
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  autoFocus
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitName();
                    if (e.key === "Escape") setEditingName(false);
                  }}
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base"
                />
                <button
                  type="button"
                  onClick={commitName}
                  className="h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
                >
                  OK
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={startEditName}
                className="mt-1 block w-full rounded-lg border border-transparent px-3 py-2 text-left text-lg font-medium hover:border-border hover:bg-accent"
                aria-label="Profilname bearbeiten"
              >
                {profile.name}
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onPickFile(f);
            }}
          />
        </section>

        <section className="mt-8">
          <h2 className="mb-3 text-base font-semibold">Eigene Auslöser-Tags</h2>
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Neuen Tag eingeben"
                className="h-12 flex-1 rounded-lg border border-input bg-background px-3 text-base"
              />
              <button
                type="button"
                onClick={addTag}
                className="h-12 rounded-lg bg-primary px-5 text-base font-semibold text-primary-foreground"
              >
                Hinzufügen
              </button>
            </div>
            {customTags.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Noch keine eigenen Tags. Eigene Tags erscheinen zusätzlich im Erfassen-Formular.
              </p>
            ) : (
              <ul className="mt-3 flex flex-wrap gap-2">
                {customTags.map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-2 rounded-full border border-border bg-background pl-4 pr-2 py-1"
                  >
                    <span className="text-base">{t}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      aria-label={`Tag ${t} löschen`}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-3 text-base font-semibold">Datenexport</h2>
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="mb-3 text-sm text-muted-foreground">
              Alle Episoden als druckfertiges PDF herunterladen.
            </p>
            <button
              type="button"
              onClick={exportPdf}
              disabled={exporting}
              className="h-12 w-full rounded-lg bg-primary text-base font-semibold text-primary-foreground disabled:opacity-60"
            >
              {exporting ? "Wird erstellt…" : "Als PDF exportieren"}
            </button>
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Alle Daten werden ausschließlich lokal auf deinem Gerät gespeichert.
        </p>
      </PageShell>
    </>
  );
}

function formatTs(iso: string) {
  try {
    return new Date(iso).toLocaleString("de-DE", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function formatTriggers(e: Episode) {
  const list = [...e.triggers];
  if (e.triggersOther) {
    const idx = list.indexOf("Sonstiges");
    const label = `Sonstiges: ${e.triggersOther}`;
    if (idx >= 0) list[idx] = label;
    else list.push(label);
  }
  return list.length ? list.join(", ") : "—";
}

function formatCoping(e: Episode) {
  const list = [...e.coping];
  if (e.copingOther) {
    const idx = list.indexOf("Sonstiges");
    const label = `Sonstiges: ${e.copingOther}`;
    if (idx >= 0) list[idx] = label;
    else list.push(label);
  }
  return list.length ? list.join(", ") : "—";
}
