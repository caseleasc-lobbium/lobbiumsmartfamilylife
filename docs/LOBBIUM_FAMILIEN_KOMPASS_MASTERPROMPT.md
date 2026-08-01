# LOBBIUM FAMILIEN-KOMPASS — MASTER-PROMPT & SCHLANKE ROADMAP

> Verdichtete, auf den **echten aktuellen Stack** zugeschnittene Fassung des ursprünglichen
> „Codex Master Prompt". Alle bereits erledigten Phasen wurden entfernt, der Umfang auf den
> tatsächlichen Produktkern (Familien-Kompass) fokussiert und die Rechts-/Ehrlichkeits-Leitplanken
> verschärft. **Kein Greenfield — wir bauen additiv auf dem Bestand auf.**
>
> Stand der Ableitung: 2026-08. Quelle: `LOBBIUM_ROADMAP_CODEX_MASTER_PROMPT.md` (Original, veraltet).

---

## 0. Warum dieser Prompt anders ist als das Original

Der ursprüngliche Prompt beschreibt einen **älteren Projektzustand**. Folgendes ist bei Lobbium
bereits **produktiv erledigt** und darf NICHT erneut „repariert" oder umgebaut werden:

- Admin-Auth = **Passwort-Login + 2FA (TOTP)**, serverseitige **HMAC-Session** (kein Magic-Link-Loop, kein `localStorage` als Auth-Quelle)
- **Brevo-only** E-Mail-Versand (Resend vollständig entfernt)
- Secrets aus Git, `.env.local`/Vercel, RLS aktiv, durables Rate-Limit + Fehler-Log
- **i18n DE/EN/FR komplett live** (nicht „später")
- SEO-Fundament, Analytics-Dashboard, TypeScript, Tests + CI, zod-Validierung
- Newsletter-Produkt inkl. getrennter Einwilligung + Brevo-Vorlagen + wöchentlicher Auto-Motor (Cron)
- Affiliate-Engine (Admitad + Sovrn-Hybrid), Deal-Radar, Vergleichs-Widgets, PWA + Maskottchen
- Familien-Tools als **Keim des Checks**: `kindergeld-checker`, `familienbudget`, `was-kostet-ein-kind`, `taschengeld`, `spartyp-test`, `druckvorlagen`

**Konsequenz:** Der Kindergeld-Checker wird zum Multi-Leistungs-Familien-Check **ausgebaut**, nicht neu gebaut.

---

## 1. Produktziel

> **Lobbium Familien-Kompass — der persönliche Familien-Geld-, Leistungs- und Sparnavigator für Deutschland.**

**WOW-Moment:** Eine Familie beantwortet in ~90 Sekunden wenige Fragen und erhält einen
nachvollziehbaren, **quellenbasierten** Aktionsplan: mögliche Leistungen, seriöse €-Bandbreite,
benötigte Dokumente, Fristen und offizielle Anlaufstellen — plus konkrete nächste Schritte.

**Positionierung:** Nicht das größte Magazin/Dealportal, sondern: *„Lobbium zeigt Familien, welche
finanziellen Vorteile für ihre Situation relevant sein könnten und was sie als Nächstes tun müssen."*

---

## 2. Nicht-Ziele (bewusst gestrichen/verschoben)

**Streichen (bereits erledigt):** Auth-Loop-Fix, Resend-Entfernung, Voll-Audit, i18n-Verschiebung,
Brevo-Grundintegration, Secrets-/Session-Absicherung.

**Verschieben (nach validiertem MVP):**
- Regionale PLZ-/Kommunal-Förderdaten (eigener Datenpflege-Prozess, +3–6 Monate)
- Lobbium Plus / Paywall / B2B / Beratungsstellen-Zugang
- Vollständiger Versionierungs-CMS-Admin (Tag 1 nur schlanker Admin + Seeds)
- Native App (Web zuerst validieren; PWA existiert bereits)

**Dauerhaft raus:** KI als Anspruchs-Entscheider, automatisches Antrag-Einreichen, offener
Rechts-Chatbot, Massen-SEO-Artikel ohne Funnel, aggressive Paywall vor dem ersten Ergebnis.

---

## 3. Schlanke Roadmap (Blöcke statt 9 Phasen)

### Block 1 — Check-Kern (MVP, hinter Feature-Flag)
1. Additive Tabellen `benefit_programs` + `benefit_versions` (Quelle, gültig ab/bis, zuletzt geprüft, Prüfstatus, Regelversion, Disclaimer).
2. **6 bundesweite Leistungen** als versionierte Seeds, sauber belegt: Kindergeld, Elterngeld, Kinderzuschlag, Wohngeld, Bildung & Teilhabe (BuT), Unterhaltsvorschuss.
3. Deterministische, reine **Regel-Engine** + ≥ 20 Szenario-Tests.
4. Route `/familien-check`: 8–12 bedingte Fragen, Gastmodus, Mobile-First, Zwischenspeicherung, barrierearm — aufbauend auf `kindergeld-checker`-Code.
5. Ergebnis-Seite: Status + Bandbreite/kein Betrag + Begründung + fehlende Angaben + Quelle + Prüfdatum + offizieller Rechner/Antrag + Dokumente + nächster Schritt + Disclaimer.
6. Druckansicht. Feature-Flag `FAMILY_COMPASS_ENABLED` (Safe-Stand unberührt).

### Block 2 — Wiederkehr
- Ergebnis per **End-Nutzer-Magic-Link** (Brevo) speichern → **Familien-Dashboard** (letzte Checks, offene Aufgaben, geänderte Regeln).
- Aktionsplan mit Priorität (dringend/wichtig/später) + Status (offen/in Arbeit/erledigt).
- Getrennte Einwilligung Produktmail vs. Marketing (Newsletter existiert bereits getrennt).

### Block 3 — Messung & Beta
- Datenschutzfreundliche Events (siehe §6), keine sensiblen Payloads.
- Beta mit 30–100 echten Testfamilien, Feedback direkt am Ergebnis.

### Block 4 — Kontextuelle Monetarisierung
- Affiliate-Empfehlung **nach** dem Nutzwert, begründet, mit Konditionen + Prüfdatum + Kennzeichnung. Bestehende Affiliate-Infra nutzen.

### Block 5 — Ausbau (nach Beta)
- Änderungsalarm-Cron, weitere Leistungen, PLZ-Piloten, Lobbium Plus.

---

## 4. Datenmodell (additiv, nichts löschen/umbenennen)

Domänenkonzepte (Benennung an Supabase-Schema anpassbar): `benefit_programs`, `benefit_versions`,
`official_sources`, `jurisdictions`, `eligibility_rules`, `calculation_definitions`,
`questionnaire_questions`, `questionnaire_options`, `check_sessions`, `check_answers`,
`check_results`, `result_reasons`, `action_items`, `required_documents`, `reminder_preferences`,
`source_reviews`.

Pflichtfelder je Leistungs-Version: stabile ID, Slug, Titel, Kurzbeschreibung, Zuständigkeit,
Status, Quelle, Behördenname, gültig ab/bis, zuletzt geprüft, nächster Prüfzeitpunkt,
verifiziert von, Berechnungsmodus, Regelversion, Disclaimer, created/updated.

**Prüfstatus:** `draft → pending_review → verified → expired → archived`.
Nur `verified` **und** aktuell gültige Regeln zählen als belastbar.

**Ergebnis speichert:** referenzierte Antworten, verwendete Regelversion, Klassifikation,
Betrag/Bandbreite, Begründung, Unsicherheitsgrund, Zeitpunkt.

---

## 5. Regel-Engine — Prinzipien

- Rein & deterministisch (keine DB-Zugriffe in der Berechnung), Eingaben validiert, reproduzierbar.
- **Reason Codes** statt Freitext. Unsicherheit explizit.
- Ergebnis-Status: `likely_relevant`, `possibly_relevant`, `insufficient_data`, `unlikely_relevant`.
- Berechnungsmodi: `exact`, `range`, `official_calculator_only`, `relevance_only`.
- **Exakter Betrag NUR** bei verifizierter Formel + Eingaben + Gültigkeitszeitraum. Sonst Bandbreite/offizieller Rechner.
- ≥ 20 Tests inkl. Grenzfälle. Regeln unabhängig von der UI testbar.

---

## 6. Analytics-Events (keine sensiblen Payloads)

`family_check_started`, `family_check_step_completed`, `family_check_completed`, `result_viewed`,
`official_action_clicked`, `result_save_requested`, `magic_link_verified`, `action_marked_done`,
`reminder_enabled`, `affiliate_recommendation_viewed`, `affiliate_clicked`, `plus_waitlist_joined`.

**Nie übertragen:** Name, E-Mail, genaues Einkommen, genaue Kinderdaten, Rohantworten, Leistungsstatus.

Feature-Flags: `FAMILY_COMPASS_ENABLED`, `FAMILY_COMPASS_HOMEPAGE_CTA_ENABLED`,
`FAMILY_COMPASS_EMAILS_ENABLED`, `FAMILY_COMPASS_AFFILIATE_RECOMMENDATIONS_ENABLED`,
`LOBBIUM_PLUS_WAITLIST_ENABLED`.

---

## 7. Rechts- & Ehrlichkeits-Leitplanken (verschärft)

1. **Keine Anspruchs-Zusage.** Immer: Relevanz-Hinweis + „verbindlich entscheidet die zuständige Behörde".
2. Keine finanziellen/rechtlichen Werte erfinden — ausschließlich belegbare offizielle Quellen.
3. KI darf nur erklären/vereinfachen/strukturieren/übersetzen — **nie** über Ansprüche entscheiden.
4. Jede aktive Regel: Quelle + Gültigkeitsdatum + Prüfdatum + Status. Änderungen versioniert, nicht still überschrieben.
5. Rechtstexte/Leistungsinhalte, die menschlich/juristisch geprüft werden müssen, klar markieren.
6. Lieber **wenige, korrekte** Leistungen als viele halbgare. Veraltete Werte = Vertrauensschaden.

---

## 8. DER MASTER-PROMPT (copy-paste)

```text
DU BIST LEAD PRODUCT/SECURITY/UX ENGINEER FÜR DAS BESTEHENDE PROJEKT „LOBBIUM".

KONTEXT (WICHTIG – NICHT ERNEUT UMBAUEN):
- Next.js 14 App Router, Supabase (Postgres + RLS), Vercel, Brevo (einziger E-Mail-Transport).
- Admin-Auth = Passwort-Login + 2FA (TOTP), serverseitige HMAC-Session. FUNKTIONIERT — NICHT ANFASSEN.
- Resend ist entfernt. i18n DE/EN/FR ist live. SEO, Analytics, Tests+CI, zod, Rate-Limit, Fehler-Log: vorhanden.
- Bestehende Tools (kindergeld-checker u.a.), Affiliate-Engine, Newsletter-Auto-Motor, Deal-Radar, PWA: erhalten lassen.
- Es gibt geschützte Desktop/Mobile-„Safe"-Layouts. NICHT optisch neu gestalten.

MISSION:
Baue additiv das Produkt „LOBBIUM FAMILIEN-KOMPASS": ein 90-Sekunden-Familien-Check, der einen
nachvollziehbaren, quellenbasierten Aktionsplan liefert (relevante Leistungen, seriöse €-Bandbreite,
Dokumente, Fristen, offizielle Anlaufstellen, nächste Schritte). Baue auf dem kindergeld-checker auf.

NICHT VERHANDELBAR:
1. Erst Repo lesen, dann ändern. Bestehende Routen/APIs/Daten/Admin/Safe-Layouts bewahren.
2. Änderungen additiv, modular, rückrollbar. Neue Funktionen hinter Feature-Flag FAMILY_COMPASS_ENABLED.
3. Keine destruktive DB-Migration. Produktions-Migration + Deployment nur mit ausdrücklicher Freigabe.
4. Keine Secrets in Git. Brevo bleibt einziger E-Mail-Dienst.
5. Keine Leistungsberechtigung per KI entscheiden. KI nur erklären/vereinfachen/übersetzen.
6. Regeln deterministisch, versioniert, testbar. Ergebnis speichert die verwendete Regelversion.
7. Keine erfundenen Beträge/Rechtsinfos. Nur belegbare offizielle Quellen. Exakter Betrag nur bei
   verifizierter Formel+Eingaben+Gültigkeit; sonst Bandbreite/Relevanz/offizieller Rechner.
8. Jede aktive Regel: Quelle + gültig-ab/bis + zuletzt geprüft + Prüfstatus (draft→verified→expired).
9. Nutzer erkennen: nur die zuständige Behörde entscheidet verbindlich. Zu prüfende Rechtstexte markieren.
10. Produkt-E-Mail und Marketing getrennt einwilligen. Keine sensiblen Antworten in Analytics/Affiliate-Tracking.
11. Nur notwendige personenbezogene Daten erheben. Marketing-Einwilligung ist NIE Voraussetzung fürs Ergebnis.

ARBEITSWEISE:
- Branch feature/family-compass-v1. Baseline-Commit dokumentieren.
- Docs pflegen: docs/CODEX_PROGRESS.md, docs/DATA_GOVERNANCE.md, docs/TEST_PLAN.md, docs/ROLLBACK_PLAN.md.
- Nach jedem Block dokumentieren: erledigte Aufgaben, geänderte Dateien, Migrationen, neue Env-Vars,
  ausgeführte Tests, offene Risiken, Rollback-Schritte.
- Nur bei echtem Blocker fragen. Sonst konservativ + dokumentiert entscheiden.
- STOPP vor: Produktions-Migration, Deployment, destruktiven Änderungen, Änderungen an Safe-Layouts,
  nicht belegbaren Rechts-/Leistungsdaten.

BLOCK 1 (JETZT STARTEN):
- Additive Tabellen benefit_programs + benefit_versions (+ Quelle/Gültigkeit/Prüfstatus/Regelversion).
- 6 verifizierte Bundes-Leistungen als versionierte Seeds (Kindergeld, Elterngeld, Kinderzuschlag,
  Wohngeld, BuT, Unterhaltsvorschuss) mit offiziellen Quellen + Prüfdatum.
- Reine, deterministische Regel-Engine + ≥20 Szenario-Tests (Grenzfälle).
- Route /familien-check: 8–12 bedingte Fragen, Gastmodus, Mobile-First, Zwischenspeicherung, a11y.
- Ergebnis-Seite: Status (likely/possibly/insufficient/unlikely) + Bandbreite/kein Betrag + Begründung
  + fehlende Angaben + Quelle + Prüfdatum + offizieller Rechner/Antrag + Dokumente + nächster Schritt + Disclaimer.
- Druckansicht. Alles hinter FAMILY_COMPASS_ENABLED. Safe-Stand unverändert.

ABSCHLUSS JE BLOCK: Status, geänderte Dateien, DB-Änderungen, Env-Vars, Tests+Ergebnisse, Risiken,
manuelle Prüfschritte, Rollback-Anleitung, nächster Block.
```

---

## 9. Definition of Done (MVP)

- `/familien-check` ohne Konto vollständig nutzbar; bedingte Fragen funktionieren; Median ≤ 90 s.
- Ergebnis reproduzierbar; kein Betrag ohne verifizierte Berechnung; Quelle + Prüfdatum sichtbar.
- ≥ 6 fachlich geprüfte Bundes-Leistungen technisch eingebunden.
- Regeln im Admin versionierbar; neues Ergebnis nutzt neue Version, altes bleibt nachvollziehbar.
- Analytics ohne sensible Daten; relevante Tests grün.
- Bestehende Safe-Seiten ohne visuelle Regression; Newsletter/Affiliate intakt.
- Produktions-Migration & Deployment separat freigebbar; Rollback dokumentiert.

---

## 10. Geschäftliche Reihenfolge (Leitplanke)

Vertrauen → Nutzwert → Wiederkehr → Messbarkeit → Monetarisierung → Skalierung. **Nicht umgekehrt.**

Erster echter Erfolgsbeweis ist nicht die Artikelanzahl, sondern:
> Wie viele Familien schließen den Check ab, speichern ihr Ergebnis und führen mindestens einen
> offiziellen nächsten Schritt aus?
