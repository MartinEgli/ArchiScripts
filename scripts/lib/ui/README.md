# Shared UI Helpers

Dieser Ordner enthaelt gemeinsame UI-Helfer fuer jArchi-Skripte.

## Einstiegspunkt

- `DialogHelpers.js`

## Zweck

Die Utility kapselt wiederkehrende Dialogmuster fuer:

- Info-, Warn- und Fehlerdialoge
- Confirm-Dialoge
- Text- und Zahlenprompts
- Auswahllisten
- Datei- und Verzeichnisdialoge

## Verwendung

```javascript
var File = Java.type("java.io.File");
load(new File(__DIR__ + "../../lib/logging/Logger.js").getCanonicalPath());
load(new File(__DIR__ + "../../lib/ui/DialogHelpers.js").getCanonicalPath());

var logger = ArchiLogging.createLogger("MyScript", {
    clearConsole: true,
    minimumLevel: "DEBUG"
});
var dialogs = ArchiDialogs.createDialogService(logger, {
    title: "My Script"
});

dialogs.showInfo("Hello World");
```
