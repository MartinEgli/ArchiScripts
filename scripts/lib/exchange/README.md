# View Exchange Helpers

This folder contains shared helpers to export an Archi view to JSON and import
it back into the current model.

## Entry point

- `ViewExchange.js`

## Purpose

The helper supports:

- exporting a selected Archi view with all concept elements and relationships
- importing the JSON package into the current model
- reusing existing elements and relationships where possible
- rebuilding a target view from the imported package

## Reuse strategy

Imported elements are matched in this order:

1. `ArchiScripts.ViewExchange.SourceConceptId`
2. same `type + name`

Imported relationships are matched in this order:

1. `ArchiScripts.ViewExchange.SourceRelationshipId`
2. same `type + source + target + name`
