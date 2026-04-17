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
- `../docs/jarchi/` fuer Konzepte und Arbeitsdokumentation
- `../reference/` fuer PDFs, Whitepaper, Standards und weitere Referenzunterlagen

## Struktur

- `scripts/`
  Bereich fuer eigene auslieferbare Skripte und spaetere Deliverables
- `scripts/SABSA/`
  SABSA- und Security-Overlay-Skripte, inklusive zentralem `Security_Overlay_Toolkit.ajs`
- `scripts/SABSA/Matrices/`
  Generatoren fuer die SABSA Architecture Matrix und die SABSA Management Matrix
- `scripts/lib/logging/`
  gemeinsamer Logger fuer wiederverwendbare Konsolen-, Dialog- und strukturierte Log-Ausgaben
- `scripts/lib/exchange/`
  gemeinsame Exchange-Helfer fuer View-Export und View-Import als JSON
- `scripts/lib/ui/`
  gemeinsame Dialog-Helfer fuer Confirm-, Prompt-, Auswahl- und Datei-Dialoge
- `data/nist/`
  aus dem NIST-PDF abgeleitete Datensaetze fuer die automatische Generierung detaillierter NIST-Control-Strukturen
- `data/sabsa/`
  gespiegelte JSON-Daten aus `../analyse/sabsa/` fuer die Weiterverarbeitung in Deliverables
- `scripts/Diverses/`
  Kleine allgemeine Hilfs- und Beispielskripte
- `scripts/Diverses/NIST/`
  NIST-bezogene Skripte zur View-Generierung fuer Standards, Familien und Controls, inklusive Detail- und Objective-only-Views
- `scripts/Diverses/Logging/`
  Basisbeispiele fuer Konsolen-, Dialog- und strukturierte Log-Ausgaben
- `scripts/Diverses/Dialogs/`
  Basisbeispiele fuer Dialoge und Benutzerinteraktion
- `scripts/Diverses/View_Exchange/`
  Export- und Import-Beispiele fuer Archi-Views mit Wiederverwendung bestehender Elemente

## Datenabgleich

Der vollstaendige Analyse-Ordner liegt bewusst im Superrepo unter `../analyse/`, aktuell mit SABSA-Daten unter `../analyse/sabsa/`.

Nur JSON-Dateien werden nach `data/sabsa/` gespiegelt. Fuer den Abgleich steht im Superrepo das Skript `../scripts/update-archiscripts-data.ps1` bereit. Wenn beim Kopieren bereits eine Zieldatei vorhanden ist, wird sie zuerst mit Zeitstempel nach `data/sabsa/archive/` verschoben.

Aktuell werden dort insbesondere diese Dateien gespiegelt:

- `data/sabsa/sabsa-architecture-matrix-data.json`
- `data/sabsa/sabsa-management-matrix-data.json`

