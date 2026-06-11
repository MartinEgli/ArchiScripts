# SABSA Overview Registry Library

This folder contains the shared SABSA overview registry helper.

- `SABSA_Overview_Registry.js` stores registered SABSA parts in the model property `SabsaOverviewRegistryJson`.
- Registered entries are keyed and updated on rerun instead of duplicated.
- The overview renderer reads the registry and creates a view with only the registered parts.
