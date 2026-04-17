# NIST

Beispiel- und Hilfsskripte fuer NIST-bezogene View-Generierung.

## Enthalten

- `Generate_Detailed_NIST_800_53_View.ajs`
  Erzeugt eine neue Detail-View fuer NIST SP 800-53 mit Standard-Container, Familiencontainern, Control Objectives und Child-Elementen.
- `Generate_NIST_800_53_Objectives_View.ajs`
  Erzeugt eine kompaktere NIST-SP-800-53-View, die pro Familie nur bis zu den Control Objectives geht.
- `Test_Generate_Detailed_NIST_800_53_View.ajs`
  Ruft die Generierung auf und prueft anschliessend die erzeugte View auf erwartete Container, Elemente und Verbindungen.

## Erwartete Modellkonventionen

- Das Standard-Element enthaelt `NIST` und `800-53` im Namen.
- Familien sind `grouping`-Elemente mit Namen wie `AC: Access Control`.
- Control Objectives sind Elemente mit Namen wie `AC-1: Policy and Procedures`.
- Child-Elemente sind Elemente mit Namen wie `AC-1a: ...`, `AC-1b: ...` oder aehnlichen Suffixen.
- Wenn bereits passende Beziehungen zwischen Objective und Child im Modell existieren, werden sie in die neue View uebernommen.

## Hinweis

Das Skript kann bei leerem Modell zusaetzlich den lokalen Datensatz `data/nist/nist-sp-800-53r5-controls.json` verwenden.
Dieser Datensatz ist aus [NIST.SP.800-53r5.pdf](/c:/Reops/Archi/reference/Standards/NIST.SP.800-53r5.pdf) abgeleitet und wird genutzt, um echte Control Objectives und Child-Elemente zu erzeugen.
