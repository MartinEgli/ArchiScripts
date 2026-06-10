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

Imports the Q003/Q004 model from the JSON extract:

- `../../../../reference/Inbox/10_q003_q004_usecase_archimate_exchange_model.json`

The script imports:

- JSON `elements` as ArchiMate concepts
- JSON `relationships` as ArchiMate relationships
- JSON `views` as generated Archi views using the stored node positions and relationship IDs

It creates ArchiMate elements with source properties such as `SabsaA1MdKey`, `SourceJson`, `SourceDocumentName`, `ExtractorScript`, `SourceSection`, `SabsaType`, `JsonElementId`, `VisualFillColor`, `VisualColorRole`, and `JsonProperty_*` properties from the extract. It also creates generated views from the JSON view specifications.

- `SABSA A1 - JSON Extracted Model`
- JSON-defined use-case, Q3 and Q4 views

## Generate_SABSA_A1_Metamodel_Field_Catalogue_Views.ajs

Parses the generic metamodel field catalogue from:

- `../../../../reference/Inbox/SABSA-A1-MFC_generic_metamodel_field_catalogue.md`

The script extracts:

- all Markdown tables in the standalone chapter-numbered catalogue as table elements
- every extracted table row as a row element with `Table_*` properties
- field definitions as explicit properties on the matching metamodel core-type elements only, using `Field_<field>`, `Field_<field>_Datatype`, `Field_<field>_Required`, `Field_<field>_KeyRole`, `Field_<field>_TemplateFamily`, `Field_<field>_Description`, and `Field_<field>_SourceTable`
- `Table 3-LA01 - SABSA Architecture Layer Alignment`
- `Table 6-01 - Core Type Inventory`
- `Table 6-02 - Core Type Promotion And Extension`
- `Table 6-03 - Relationship Catalogue`
- `Table 6-05 - Recommended Architecture Viewpoints`

It creates source-traced ArchiMate catalogue elements with properties such as `SabsaA1CatalogueKey`, `SourceMarkdown`, `SourceDocumentName`, `ExtractorScript`, `SourceSection`, `SabsaType`, `RecommendedArchiMateType`, cardinality, semantics, validation impact, required back-links, `VisualFillColor`, `VisualColorRole`, and `Table_*` properties for every extracted catalogue row. Meta core-type elements carry the `Field_*` field metadata; sample and applied overlay elements carry concrete field values only. The generator removes old `Field_*` metadata copies from SABSA A1 non-meta elements when it reuses or scans them. Meta type elements are shown as `«SABSA A1 Overlay Type»` followed by the type name, while sample and applied overlay elements use the concrete overlay stereotype such as `«SABSA A1 Risk»`. It generates seven views:

Visible Archi concept, relationship and stereotype names replace `_` with spaces across the A1 generation and apply scripts, while stable keys and technical properties such as `SabsaType`, field names and catalogue IDs keep their source values.

- `SABSA A1 - Metamodel Complete Table Index`
- `SABSA A1 - SABSA Architecture Layer Alignment`
- `SABSA A1 - Metamodel Core Type Inventory`
- `SABSA A1 - Metamodel Field FK Relations`
- `SABSA A1 - Metamodel Relationship Catalogue`
- `SABSA A1 - Metamodel Viewpoint Catalogue`
- `SABSA A1 - Overlay Sample Relationship Overview`

Following `Build_Security_Overlay_Library_With_Overlay_Model_Folder.ajs`, the generated concepts and views are placed below an `Overlay Model/SABSA/A1/...` structure and the generator also creates overlay-library views:

- `SABSA A1 Overlay - Overview`
- `SABSA A1 Overlay - Type Model`
- `SABSA A1 Overlay - Template Library`

The complete table model also creates relationships from source to table, table to row, table rows to the focused layer/type/relationship/viewpoint concepts, detailed field tables to their core or promoted support type, field rows to their type, `CoreTypeHasField` links, named FK-based `CoreTypeForeignKeyReference` links, and direct named core-type semantic relationships from `Table 6-03`. Type-to-field relation labels use the field table `Key Role` value, for example `PK`, `FK` or `Property`. FK targets are resolved from backticked references, field names, free-text notes and catalogue aliases such as `Evidence` -> `Evidence_Item`, `Treatment` -> `Risk_Treatment`, and `Assurance Subject` -> `Assurance_Evaluation_Subject`. Relationship names carry the relationship semantics or field name, for example `risk_id -> Risk` or the relationship-catalogue semantics with cardinality. The type, FK, relationship and sample overview views render semantic and FK relationships through their actual ArchiMate relationship endpoints, and the completion dialog reports created and skipped view connections. The generator persists `SabsaA1OverlayTemplateIndexJson` and `SabsaA1OverlayRelationshipIndexJson` model properties for downstream application scripts.

`Threat` and `Opportunity` are generated as SABSA A1 overlay specializations of `Event_Attribute`. They inherit the `Event_Attribute` field metadata, keep `Event_Attribute` as the neutral base classification pattern, and set the `classification` field default to `Threat` or `Opportunity` for samples and applied elements.

## Apply_SABSA_A1_Overlay_Stereotype_From_Metamodel.ajs

Applies a SABSA A1 overlay stereotype to exactly one selected diagram element. It reads `SabsaA1OverlayTemplateIndexJson`, offers only stereotypes matching the selected ArchiMate concept type, sets the specialization and label expression, keeps existing business properties unchanged, fills only missing field values from the metamodel, uses metamodel field defaults such as `classification = Threat` or `classification = Opportunity`, removes old `Field_*` metadata copies from the selected explicit element, leaves `Field_*` metadata on the meta element, and creates a trace relationship back to the selected meta element.

## Cleanup_SABSA_A1_Field_Metadata_From_Explicit_Elements.ajs

Removes existing `Field_*` metadata properties from SABSA A1 explicit/generated concepts and relationships while leaving them on `CoreType` metamodel elements. Use this once after older generator runs if explicit/sample/applied elements still contain `Field_*` metadata copies.
