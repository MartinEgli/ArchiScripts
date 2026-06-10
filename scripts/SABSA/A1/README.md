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

## Generate_SABSA_A1_Metamodel_Field_Catalogue_Table_Views.ajs

Runs the shared field-catalogue generator in table mode. It parses the generic metamodel field catalogue from:

- `../../../../reference/Inbox/SABSA-A1-MFC_generic_metamodel_field_catalogue.md`

It creates or reuses only source, table and table-row catalogue elements and generates:

- `SABSA A1 - Metamodel Complete Table Index`

Existing elements are matched by stable `SabsaA1CatalogueKey` values such as `catalogue:table:<table-id>` and `catalogue:table-row:<table-id>:<row-index>`.

## Generate_SABSA_A1_Metamodel_Field_Catalogue_Meta_Views.ajs

Runs the shared field-catalogue generator in meta mode. It parses the same source catalogue from:

- `../../../../reference/Inbox/SABSA-A1-MFC_generic_metamodel_field_catalogue.md`

It creates or reuses metamodel, overlay, relationship and sample elements. Existing table and table-row elements from `Generate_SABSA_A1_Metamodel_Field_Catalogue_Table_Views.ajs` are reused when present; otherwise the catalogue tables are parsed as data only and no new table catalogue elements are created.

The meta script extracts:

- field definitions as compact explicit properties on the matching metamodel core-type elements only, using one descriptor property per field: `Field_<field>` with datatype, required flag, key role, template family and description
- `Table 3-LA01 - SABSA Architecture Layer Alignment`
- `Table 6-01 - Core Type Inventory`
- `Table 6-02 - Core Type Promotion And Extension`
- `Table 6-03 - Relationship Catalogue`
- `Table 6-05 - Recommended Architecture Viewpoints`

It creates source-traced ArchiMate catalogue elements with properties such as `SabsaA1CatalogueKey`, `SourceMarkdown`, `SourceDocumentName`, `ExtractorScript`, `SourceSection`, `SabsaType`, `RecommendedArchiMateType`, cardinality, semantics, validation impact, required back-links, `VisualFillColor` and `VisualColorRole`. Meta core-type elements carry compact `Field_*` descriptor metadata; sample and applied overlay elements carry concrete field values only. FK/reference ID fields are omitted from sample and applied elements because relationships carry the traceability. The generator removes old verbose `Field_*_Datatype`, `Field_*_Description` and other redundant field metadata copies when it reuses or scans elements. Meta type elements are shown as `«SABSA A1 Overlay Type»` followed by the type name, while sample and applied overlay elements use the concrete overlay stereotype such as `«SABSA A1 Risk»`. It generates the metamodel views:

Visible Archi concept, relationship and stereotype names replace `_` with spaces across the A1 generation and apply scripts, while stable keys and technical properties such as `SabsaType`, field names and catalogue IDs keep their source values.

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

When table elements exist, the meta script reuses them to add relationships from table rows to the focused layer/type/relationship/viewpoint concepts, detailed field tables to their core or promoted support type, field rows to their type and `CoreTypeHasField` links. Even without table elements it still creates named FK-based `CoreTypeForeignKeyReference` links and direct named core-type semantic relationships from `Table 6-03`. Type-to-field relation labels use the field table `Key Role` value, for example `PK`, `FK` or `Property`. FK targets are resolved from backticked references, field names, free-text notes and catalogue aliases such as `Evidence` -> `Evidence_Item`, `Treatment` -> `Risk_Treatment`, and `Assurance Subject` -> `Assurance_Evaluation_Subject`. Relationship names carry the relationship semantics or field name, for example `risk_id -> Risk` or the relationship-catalogue semantics with cardinality. The type, FK, relationship and sample overview views render semantic and FK relationships through their actual ArchiMate relationship endpoints, and the completion dialog reports created and skipped view connections. The generator persists `SabsaA1OverlayTemplateIndexJson` and `SabsaA1OverlayRelationshipIndexJson` model properties for downstream application scripts.

The generator adds selected SABSA A1 overlay specializations where the literature or catalogue defines a stable semantic split: `Threat` and `Opportunity` specialize `Event_Attribute`; `Strength` and `Weakness` specialize `State_Attribute`; `Impact` and `Benefit` specialize `Consequence`; `Threat Risk` and `Opportunity Risk` specialize `Risk`; `Control`, `Enabler` and `Combined Treatment` specialize `Risk_Treatment`. These derived types inherit the base type field metadata and set field defaults such as `classification`, `state_effect`, `consequence_type`, `risk_direction` or `treatment_type` for samples and applied elements.

## Generate_SABSA_A1_Metamodel_Field_Catalogue_Views.ajs

Shared backwards-compatible generator core. Running it directly uses combined mode and creates both the table catalogue and the meta/overlay views. Prefer the table and meta entrypoint scripts above when the two views should be maintained separately.

## Apply_SABSA_A1_Overlay_Stereotype_From_Metamodel.ajs

Applies a SABSA A1 overlay stereotype to exactly one selected diagram element. It reads `SabsaA1OverlayTemplateIndexJson`, offers only stereotypes matching the selected ArchiMate concept type, sets the specialization and label expression, keeps existing business properties unchanged, fills only missing non-FK field values from the metamodel, uses metamodel field defaults such as `classification = Threat`, `state_effect = Strength` or `treatment_type = Enabler`, removes old `Field_*` metadata and FK/reference ID field values from the selected explicit element, leaves compact `Field_*` metadata on the meta element, and creates a trace relationship back to the selected meta element.

## Cleanup_SABSA_A1_Field_Metadata_From_Explicit_Elements.ajs

Removes existing verbose `Field_*` metadata properties from SABSA A1 explicit/generated concepts and relationships, removes redundant `Field_*_Datatype` / `Field_*_Description` style metadata from `CoreType` metamodel elements, and removes FK/reference ID field values from explicit/sample/applied elements when a linked meta element identifies those fields. Use this once after older generator runs if explicit/sample/applied elements still contain verbose metadata or FK ID properties.
