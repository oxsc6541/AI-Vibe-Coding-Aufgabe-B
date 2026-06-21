export type TriggerTag =
  | "Geräusche"
  | "Licht"
  | "Berührung"
  | "Geruch"
  | "Menschenmenge"
  | "soziale Situation"
  | "Sonstiges";

export type CopingTag =
  | "Kopfhörer"
  | "Rückzugsort"
  | "Stimming"
  | "Pause"
  | "Sonstiges";

export const TRIGGER_TAGS: TriggerTag[] = [
  "Geräusche",
  "Licht",
  "Berührung",
  "Geruch",
  "Menschenmenge",
  "soziale Situation",
  "Sonstiges",
];

export const COPING_TAGS: CopingTag[] = [
  "Kopfhörer",
  "Rückzugsort",
  "Stimming",
  "Pause",
  "Sonstiges",
];

export interface Episode {
  id: string;
  timestamp: string; // ISO, not editable
  triggers: string[];
  triggersOther?: string;
  intensity: 1 | 2 | 3 | 4 | 5;
  durationMinutes: number;
  coping: string[];
  copingOther?: string;
  notes?: string;
}

export interface Profile {
  name: string;
  avatarDataUrl?: string;
}
