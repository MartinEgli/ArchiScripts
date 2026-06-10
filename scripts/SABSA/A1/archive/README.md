# Archived SABSA A1 Scripts

This folder contains deprecated compatibility entry points that were replaced by clearer focused scripts.

Current replacements:

- `Generate_SABSA_A1_Metamodel_Field_Catalogue_Meta_Views.ajs` -> `../Generate_SABSA_A1_Metamodel_Architecture_Views.ajs`
- `Generate_SABSA_A1_Metamodel_Field_Catalogue_Table_Views.ajs` -> `../Generate_SABSA_A1_Field_Catalogue_Table_Index_View.ajs`
- `Generate_SABSA_A1_Metamodel_Field_Catalogue_Views.ajs` -> focused field-catalogue scripts or `../core/Generate_SABSA_A1_Field_Catalogue_Core.ajs`
- `Generate_SABSA_A1_Generic_Risk_Model_View.ajs` -> `../Generate_SABSA_A1_Generic_Risk_Management_Model_View.ajs`
- `Generate_SABSA_A1_Exchange_Schema_Metamodel_Views.ajs` -> `../Generate_SABSA_A1_Exchange_Schema_Type_Relationship_Mapping_Views.ajs`
- `Generate_SABSA_A1_MD_Extracted_Q003_Q004_Model_View.ajs` -> `../Generate_SABSA_A1_Q003_Q004_JSON_Extracted_Model_Views.ajs`

The archived wrappers are kept for traceability and can still load the shared field-catalogue generator from the parent A1 core folder.
