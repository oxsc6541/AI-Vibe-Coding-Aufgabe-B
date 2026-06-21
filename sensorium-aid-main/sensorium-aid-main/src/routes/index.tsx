import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, History, BarChart3, User } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sensoria – Sensorischer Episoden-Tracker" },
      {
        name: "description",
        content:
          "Sensoria: ruhige, reizarme App zum Erfassen sensorischer Überlastungs-Episoden.",
      },
      { name: "theme-color", content: "#e9e3d6" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="mx-auto max-w-xl px-4 pb-12 pt-10">
      <header className="mb-8">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">Sensoria</p>
        <h1 className="mt-1 text-3xl font-semibold">Hallo.</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Was möchtest du tun?
        </p>
      </header>

      <nav className="grid grid-cols-1 gap-4">
        <HomeButton to="/capture" icon={<ClipboardList className="h-6 w-6" />} label="Episode erfassen" primary />
        <HomeButton to="/history" icon={<History className="h-6 w-6" />} label="Verlauf" />
        <HomeButton to="/stats" icon={<BarChart3 className="h-6 w-6" />} label="Statistik" />
        <HomeButton to="/account" icon={<User className="h-6 w-6" />} label="Konto" />
      </nav>
    </main>
  );
}

function HomeButton({
  to,
  icon,
  label,
  primary,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex min-h-20 items-center gap-4 rounded-2xl border px-6 py-5 text-xl font-semibold shadow-sm ${
        primary
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-card-foreground hover:bg-accent"
      }`}
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
          primary ? "bg-primary-foreground/15" : "bg-secondary"
        }`}
      >
        {icon}
      </span>
      <span className="flex-1">{label}</span>
    </Link>
  );
}
