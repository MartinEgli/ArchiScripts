# SABSA Scripts

This folder is organized by SABSA modelling level and script family.

- `Foundation/` contains general SABSA/security overlay scripts that are not specific to A1.
- `Foundation/overview/Generate_SABSA_Overview_View.ajs` creates the registry-driven `SABSA - Overview` view.
- `A1/` contains SABSA Advanced Module A1 scripts.
- `Matrices/` contains SABSA matrix view generators.
- `Processes/` contains SABSA process view generators.

Active scripts should live in the most specific folder. Older variants belong in the matching `archive/` folder. Generated SABSA parts can register themselves in `SabsaOverviewRegistryJson`; the overview renderer shows only registered parts.
