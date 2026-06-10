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
  Die Generatoren ordnen Views unter `Views/SABSA/Matrices/...` ein und legen Gruppierungen unter `Other/SABSA/Matrices/...` sowie fachliche Elemente unter `Business/SABSA/Matrices/...` ab
- `scripts/SABSA/A1/`
  Generatoren fuer SABSA-A1-nahe Modelle. `Generate_SABSA_A1_Generic_Risk_Model_View.ajs` erzeugt ein generisches A1-Risikomanagementmodell mit NIBOCJ-Overlay aus `data/sabsa/sabsa-a1-generic-risk-model-data.json`. `Generate_SABSA_A1_Exchange_Schema_Metamodel_Views.ajs` erzeugt Metamodell-Views aus `../reference/Inbox/09_generic_sabsa_a1_archimate_exchange_schema.json`. `Generate_SABSA_A1_MD_Extracted_Q003_Q004_Model_View.ajs` extrahiert das Q003/Q004-Gesamtmodell aus `../reference/Inbox/08_q003_q004_end_to_end_gesamtmodell.md` und erzeugt ArchiMate-Elemente mit MD-Source-Properties. `Generate_SABSA_A1_Metamodel_Field_Catalogue_Views.ajs` extrahiert Layer, Core Types, Relationships und Viewpoints aus `../reference/Inbox/SABSA-A1-MFC_generic_metamodel_field_catalogue.md`
- `scripts/SABSA/Processes/`
  Generatoren fuer fokussierte SABSA-Prozess-Views, zum Beispiel fuer `Develop Conceptual Security Architecture` auf Basis der Analyse unter `../analyse/sabsa/develop-conceptual-security-architecture/`
  Der Generator fuer `Develop Conceptual Security Architecture` liest den JSON-Extrakt `data/sabsa/sabsa-develop-conceptual-security-architecture-data.json`
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
- `data/sabsa/sabsa-develop-conceptual-security-architecture-data.json`
- `data/sabsa/sabsa-a1-generic-risk-model-data.json`

