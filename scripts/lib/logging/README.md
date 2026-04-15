# Shared Logging Helpers

Dieser Ordner enthaelt die gemeinsame Logging-Utility fuer jArchi-Skripte.

## Einstiegspunkt

- `Logger.js`

## Ziel

Der Logger stellt eine einheitliche API fuer:

- Konsolenlogs
- strukturierte Log-Daten
- Dialoge fuer sichtbare Benutzerhinweise
- konsistente Loglevel und `run_id`

bereit.

## Verwendung

Beispiel aus einem `.ajs`-Skript:

```javascript
var File = Java.type("java.io.File");
load(new File(__DIR__ + "../../lib/logging/Logger.js").getCanonicalPath());

var logger = ArchiLogging.createLogger("MyScript", {
    clearConsole: true,
    minimumLevel: "DEBUG"
});

logger.start("Script started.");
logger.info("Doing work.", { step: 1 }, "script.step");
logger.finish("Script finished.");
```
