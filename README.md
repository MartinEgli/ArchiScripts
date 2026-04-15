# ArchiScripts

Deliverables-Repo fuer eigene Archi- und jArchi-Ergebnisse.

## Ziel

Dieses Repository soll nur die wirklich ausgelieferten Artefakte enthalten, zum Beispiel:

- eigene `.ajs`-Skripte
- wiederverwendbare Deliverables
- exportierbare Ergebnisse
- produktionsnahe Hilfsskripte

## Abgrenzung

Externe Quellen, Community-Packs und Referenzdokumentation liegen bewusst nicht mehr hier, sondern im Superrepo:

- `../sources/` fuer externe jArchi-Quellen
- `../docs/jarchi/` fuer Notizen, Referenzen und Arbeitsdokumentation

## Struktur

- `scripts/`
  Bereich fuer eigene auslieferbare Skripte und spaetere Deliverables
- `scripts/SABSA/`
  SABSA- und Security-Overlay-Skripte, inklusive zentralem `Security_Overlay_Toolkit.ajs`
- `scripts/lib/logging/`
  gemeinsamer Logger fuer wiederverwendbare Konsolen-, Dialog- und strukturierte Log-Ausgaben
- `scripts/lib/exchange/`
  gemeinsame Exchange-Helfer fuer View-Export und View-Import als JSON
- `scripts/lib/ui/`
  gemeinsame Dialog-Helfer fuer Confirm-, Prompt-, Auswahl- und Datei-Dialoge
- `scripts/Diverses/`
  Kleine allgemeine Hilfs- und Beispielskripte
- `scripts/Diverses/Logging/`
  Basisbeispiele fuer Konsolen-, Dialog- und strukturierte Log-Ausgaben
- `scripts/Diverses/Dialogs/`
  Basisbeispiele fuer Dialoge und Benutzerinteraktion
- `scripts/Diverses/View_Exchange/`
  Export- und Import-Beispiele fuer Archi-Views mit Wiederverwendung bestehender Elemente

