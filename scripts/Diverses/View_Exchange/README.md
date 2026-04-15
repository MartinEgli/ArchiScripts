# View Exchange

This folder contains simple view export and import scripts built on top of the
shared exchange helper.

## Content

- `Export_Selected_View_To_JSON.ajs`
  exports the currently selected Archi view with all concept elements and
  relationships to a JSON package
- `Import_View_From_JSON.ajs`
  imports a JSON package into the current model and creates a new target view

## Import behavior

The import tries to reuse existing concepts before creating new ones.

Element matching order:

1. `ArchiScripts.ViewExchange.SourceConceptId`
2. same `type + name`

Relationship matching order:

1. `ArchiScripts.ViewExchange.SourceRelationshipId`
2. same `type + source + target + name`

## Notes

- Existing concepts are reused instead of being replaced.
- Existing documentation and properties are kept when already populated.
- Imported concepts receive source-tracking properties to improve matching on
  later imports.
