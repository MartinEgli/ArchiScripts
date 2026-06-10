# SABSA A1 Scripts

Deliverable scripts for SABSA Advanced Module A1 oriented modelling.

## Generate_SABSA_A1_Generic_Risk_Model_View.ajs

Generates a generic SABSA A1 risk management model view from the source-of-truth data file:

- `data/sabsa/sabsa-a1-generic-risk-model-data.json`

The JSON file carries the source references used for the generated model, including the staged A1 training/exam documents and Q003/Q004 applied/metamodel files under `reference/Inbox/`.

The script creates or reuses:

- generic risk management objects such as business context, attributes, appetite, risk view, objectives, treatment architecture, performance evidence, and vitality backlog
- SABSA A1 process phases from strategy and planning through design, implementation, manage and measure, governance, and assurance
- an NIBOCJ framework overlay
- traceability and mapping relationships
- folders under `Views/SABSA/A1`, `Business/SABSA/A1/...`, `Other/SABSA/A1/...`, and `Relations/SABSA/A1/...`

## NIBOCJ Assumption

`NIBOCJ` is currently interpreted as a working cross-reference mnemonic:

- `NIST`
- `ISO`
- `BSI`
- `OCTAVE`
- `COBIT`
- `jArchi`

If the project later defines NIBOCJ differently, update the JSON data file first. The script reads the framework list from that data file instead of hard-coding the framework entries.

## Generate_SABSA_A1_Exchange_Schema_Metamodel_Views.ajs

Generates metamodel views from:

- `../../../../reference/Inbox/09_generic_sabsa_a1_archimate_exchange_schema.json`

The script creates or reuses:

- `SABSA A1 - Exchange Schema Type Mapping`
- `SABSA A1 - Exchange Schema Relationship Mapping`
- source-reference concepts from the schema header
- SABSA type concepts from `archimate_type_mapping` and `relationship_definitions`
- ArchiMate type and relationship-type concepts
- SABSA relationship verb concepts
- concrete relationship-definition concepts
- mapping and traceability relationships

The script deliberately keeps schema concepts as metamodel objects instead of trying to instantiate a full applied risk model.

## Generate_SABSA_A1_MD_Extracted_Q003_Q004_Model_View.ajs

Parses the markdown Gesamtmodell directly from:

- `../../../../reference/Inbox/08_q003_q004_end_to_end_gesamtmodell.md`

The script extracts:

- Mermaid nodes and edges from the embedded diagrams
- `Table 16.8.8-03 - Q3 Risk To Q4 Governance Map`
- `Table 16.8.8-04 - Source And Assumption Control`
- `Table 16.8.8-05 - Anonymised Use Case Capsule Mapping`
- `Table 16.8.8-06 - v1.8 Taxonomy Governance Thread`

It creates ArchiMate elements with source properties such as `SabsaA1MdKey`, `SourceMarkdown`, `SourceDocumentName`, `ExtractorScript`, `SourceSection`, `SabsaType`, `RiskThreadId`, `RowIndex`, Mermaid aliases, `VisualFillColor`, `VisualColorRole`, and `Table_*` properties for extracted table cells. It also creates two generated views:

- `SABSA A1 - MD Extracted Mermaid Model`
- `SABSA A1 - MD Extracted Risk Governance Map`

## Generate_SABSA_A1_Metamodel_Field_Catalogue_Views.ajs

Parses the generic metamodel field catalogue from:

- `../../../../reference/Inbox/SABSA-A1-MFC_generic_metamodel_field_catalogue.md`

The script extracts:

- all Markdown tables in the `1-*` catalogue as table elements
- every extracted table row as a row element with `Table_*` properties
- field definitions as explicit properties on the matching table and core-type elements, using `Field_<field>`, `Field_<field>_Datatype`, `Field_<field>_Required`, `Field_<field>_KeyRole`, `Field_<field>_TemplateFamily`, `Field_<field>_Description`, and `Field_<field>_SourceTable`
- `Table 1-LA01 - Metamodel Layer Architecture`
- `Table 1-03 - Core Type Inventory`
- `Table 1-03A - Core Type Promotion And Extension`
- `Table 1-03B - Relationship Catalogue`
- `Table 1-03D - Recommended Architecture Viewpoints`

It creates source-traced ArchiMate catalogue elements with properties such as `SabsaA1CatalogueKey`, `SourceMarkdown`, `SourceDocumentName`, `ExtractorScript`, `SourceSection`, `SabsaType`, `RecommendedArchiMateType`, cardinality, semantics, validation impact, required back-links, `VisualFillColor`, `VisualColorRole`, and `Table_*` properties for every extracted catalogue row. Meta elements and sample elements are typed as `SabsaA1Overlay` stereotypes and use the label form `«SABSA A1 ${specialization}»` followed by the element name. It generates seven views:

- `SABSA A1 - Metamodel Complete Table Index`
- `SABSA A1 - Metamodel Layer Architecture`
- `SABSA A1 - Metamodel Core Type Inventory`
- `SABSA A1 - Metamodel Field FK Relations`
- `SABSA A1 - Metamodel Relationship Catalogue`
- `SABSA A1 - Metamodel Viewpoint Catalogue`
- `SABSA A1 - Overlay Sample Relationship Overview`

The complete table model also creates relationships from source to table, table to row, table rows to the focused layer/type/relationship/viewpoint concepts, detailed field tables to their core or promoted support type, field rows to their type, `CoreTypeHasField` links, named FK-based `CoreTypeForeignKeyReference` links, and direct named core-type semantic relationships from `Table 1-03B`. FK targets are resolved from backticked references, field names, free-text notes and catalogue aliases such as `Evidence` -> `Evidence_Item`, `Treatment` -> `Risk_Treatment`, and `Assurance Subject` -> `Assurance_Evaluation_Subject`. Relationship names carry the relationship semantics or field name, for example `risk_id -> Risk` or the relationship-catalogue semantics with cardinality. The type, FK, relationship and sample overview views render semantic and FK relationships through their actual ArchiMate relationship endpoints, and the completion dialog reports created and skipped view connections. The generator persists `SabsaA1OverlayTemplateIndexJson` and `SabsaA1OverlayRelationshipIndexJson` model properties for downstream application scripts.

## Apply_SABSA_A1_Overlay_Stereotype_From_Metamodel.ajs

Applies a SABSA A1 overlay stereotype to exactly one selected diagram element. It reads `SabsaA1OverlayTemplateIndexJson`, offers only stereotypes matching the selected ArchiMate concept type, sets the specialization and label expression, keeps existing business properties unchanged, fills only missing field values and field metadata from the metamodel, and creates a trace relationship back to the selected meta element.
