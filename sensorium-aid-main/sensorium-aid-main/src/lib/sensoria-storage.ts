import type { Episode, Profile } from "./sensoria-types";

const EPISODES_KEY = "sensoria.episodes.v1";
const PROFILE_KEY = "sensoria.profile.v1";
const CUSTOM_TRIGGERS_KEY = "sensoria.customTriggers.v1";

const isBrowser = () => typeof window !== "undefined";

export function loadEpisodes(): Episode[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(EPISODES_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as Episode[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveEpisodes(list: Episode[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(EPISODES_KEY, JSON.stringify(list));
}

export function addEpisode(ep: Episode) {
  const list = loadEpisodes();
  list.push(ep);
  saveEpisodes(list);
}

export function updateEpisode(ep: Episode) {
  const list = loadEpisodes().map((e) => (e.id === ep.id ? ep : e));
  saveEpisodes(list);
}

export function deleteEpisode(id: string) {
  saveEpisodes(loadEpisodes().filter((e) => e.id !== id));
}

export function getEpisode(id: string): Episode | undefined {
  return loadEpisodes().find((e) => e.id === id);
}

export function loadProfile(): Profile {
  if (!isBrowser()) return { name: "Mein Profil" };
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return { name: "Mein Profil" };
    return JSON.parse(raw) as Profile;
  } catch {
    return { name: "Mein Profil" };
  }
}

export function saveProfile(p: Profile) {
  if (!isBrowser()) return;
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

export function newId() {
  return (
    Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8)
  );
}

export function loadCustomTriggers(): string[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(CUSTOM_TRIGGERS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function saveCustomTriggers(list: string[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(CUSTOM_TRIGGERS_KEY, JSON.stringify(list));
}
