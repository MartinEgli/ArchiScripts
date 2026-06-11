# SABSA Foundation Overlay Scripts

This folder contains the active foundation-level security overlay scripts.

- `Security_Overlay_Toolkit.ajs` is the preferred bundled entry point for daily use. Its build action keeps original Archi concept colors and creates Overlay Model folders.
- `Build_Security_Overlay_Library_With_Overlay_Model_Folder.ajs` builds the general Security Overlay library with the Overlay Model folder structure and keeps original Archi concept colors.
- `Apply_Stereotype_From_Template.ajs` applies a template stereotype without a separate UI wrapper.
- `UI Apply_Stereotype_From_Template.ajs` is the UI entry point for applying a template stereotype.
- `Refresh_Security_Overlay_Template_Cache.ajs` refreshes the overlay template cache summary.
- `Dump_Security_Overlay_Template_Cache.ajs` dumps the overlay template cache for inspection.

The library build entry points register the generated Security Overlay Library in `SabsaOverviewRegistryJson` after successful generation.
