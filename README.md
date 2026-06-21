# Sensoria

Ein mobile-first Web-App-Tracker für sensorische Überlastungs-Episoden, primär für Menschen mit autistischen Störungen entwickelt.

## Über das Projekt

Sensoria hilft dabei, Meltdowns (Zusammenbrüche als Folge von Reizüberflutung) besser zu verstehen und zu kontrollieren. Die App unterstützt Nutzer:innen dabei,

- Auslösermuster zu erkennen (Geräusche, Licht, Berührung, Geruch, Menschenmenge, soziale Situationen),
- die Intensität einzelner Episoden zu dokumentieren,
- geeignete Coping-Strategien festzuhalten und weiterzuentwickeln,
- Verläufe über die Zeit auszuwerten.

Die App ist für einen einzelnen Nutzer gedacht, läuft komplett lokal (kein Login, kein Passwort, keine Auth-Logik) und ist als Progressive Web App (PWA) installierbar.

## Funktionen

- **Episode erfassen**: Schnelles, reizarmes Formular mit Datum/Uhrzeit (editierbar, für nachträgliche Erfassung nach einem Meltdown), Auslöser-Tags, Intensitätsskala (1–5), Dauer, Coping-Strategien und optionalem Notizfeld
- **Verlauf**: Liste aller erfassten Episoden, neueste oben, mit Detailansicht (Bearbeiten/Löschen)
- **Statistik**: Dashboard mit Häufigkeit nach Auslöser, Intensitätsverlauf über Zeit und Kennzahlen-Übersicht, basierend auf den echten gespeicherten Daten
- **Konto**: Profilname, eigene Auslöser-Tags verwalten, Datenexport als druckfertiges PDF

## Design

Bewusst ruhig und reizarm gehalten: gedeckte Farben, keine Animationen oder grellen Akzente, große Touch-Targets, klare Beschriftungen — passend zur Zielgruppe.

## Technische Umsetzung

- Entwickelt mit [Lovable](https://lovable.dev) im Rahmen einer VibeCoding-Aufgabe
- Prompts wurden iterativ mit Unterstützung von Claude (Anthropic) nachgebessert und präzisiert
- Daten werden ausschließlich lokal auf dem Gerät gespeichert

## Nutzer-Feedback

Die App wurde einer autistischen Person zur Erprobung vorgestellt. Das Feedback war positiv, die ruhige Gestaltung und die unkomplizierte Erfassung wurden als hilfreich empfunden.


