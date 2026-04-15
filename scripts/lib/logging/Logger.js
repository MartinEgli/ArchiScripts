/*
===============================================================================
Central jArchi Logging Helpers
===============================================================================

Shared logging helpers for ArchiScripts.

Provides:
- standardized log levels
- structured log records
- consistent console output
- optional dialogs for important user-facing messages
- a simple createLogger(scriptName, options) API
===============================================================================
*/

var ArchiLogging = (function (existing) {
    if (existing) {
        return existing;
    }

    var LEVELS = {
        DEBUG: { text: "DEBUG", severityNumber: 5, color: [100, 100, 100] },
        INFO: { text: "INFO", severityNumber: 9, color: [0, 100, 0] },
        WARN: { text: "WARN", severityNumber: 13, color: [255, 165, 0] },
        ERROR: { text: "ERROR", severityNumber: 17, color: [255, 0, 0] },
        FATAL: { text: "FATAL", severityNumber: 21, color: [180, 0, 0] }
    };

    function nowIso() {
        return new Date().toISOString();
    }

    function createRunId() {
        return "run-" + new Date().getTime();
    }

    function getModelName() {
        try {
            if (typeof model !== "undefined" && model && model.name) {
                return String(model.name);
            }
        } catch (error) {
            // Ignore model lookup issues and fall back to null.
        }

        return null;
    }

    function cloneObject(source) {
        var result = {};
        var key;

        if (!source) {
            return result;
        }

        for (key in source) {
            if (source.hasOwnProperty(key)) {
                result[key] = source[key];
            }
        }

        return result;
    }

    function safeStringify(value) {
        try {
            return JSON.stringify(value, null, 2);
        } catch (error) {
            return String(value);
        }
    }

    function normalizeLevel(levelName) {
        var upper = String(levelName || "INFO").toUpperCase();
        return LEVELS[upper] || LEVELS.INFO;
    }

    function consoleEnsure(options) {
        if (options.autoShowConsole !== false) {
            console.show();
        }

        if (options.clearConsole === true) {
            console.clear();
        }
    }

    function buildRecord(scriptName, levelName, eventName, message, attributes, state) {
        var level = normalizeLevel(levelName);
        var data = cloneObject(attributes);

        return {
            timestamp: nowIso(),
            severity_text: level.text,
            severity_number: level.severityNumber,
            event_name: eventName || "script.log",
            script_name: scriptName,
            run_id: state.runId,
            model_name: getModelName(),
            message: String(message),
            attributes: data
        };
    }

    function formatPrimaryLine(record) {
        return "[" + record.timestamp + "] " +
            record.severity_text +
            " " +
            record.script_name +
            " " +
            record.event_name +
            " - " +
            record.message;
    }

    function writeRecordToConsole(record) {
        var level = normalizeLevel(record.severity_text);
        var attributeKeys = Object.keys(record.attributes || {});

        console.setTextColor(level.color[0], level.color[1], level.color[2]);
        console.log(formatPrimaryLine(record));
        console.setDefaultTextColor();

        console.log("  run_id=" + record.run_id);

        if (record.model_name) {
            console.log("  model_name=" + record.model_name);
        }

        if (attributeKeys.length > 0) {
            console.log("  attributes=" + safeStringify(record.attributes));
        }
    }

    function showDialog(title, message, dialogKind) {
        try {
            var JOptionPane = Java.type("javax.swing.JOptionPane");
            var kind = JOptionPane.INFORMATION_MESSAGE;

            if (dialogKind === "WARN") {
                kind = JOptionPane.WARNING_MESSAGE;
            } else if (dialogKind === "ERROR" || dialogKind === "FATAL") {
                kind = JOptionPane.ERROR_MESSAGE;
            }

            JOptionPane.showMessageDialog(null, String(message), String(title), kind);
        } catch (error) {
            console.error("Dialog output failed: " + error);
        }
    }

    function shouldLog(currentLevelName, minimumLevelName) {
        return normalizeLevel(currentLevelName).severityNumber >= normalizeLevel(minimumLevelName).severityNumber;
    }

    function createLogger(scriptName, options) {
        var state = {
            runId: options && options.runId ? options.runId : createRunId(),
            options: options || {}
        };
        var script = scriptName || "UnnamedScript";

        consoleEnsure(state.options);

        function emit(levelName, message, attributes, eventName) {
            var minimum = state.options.minimumLevel || "DEBUG";
            var record;

            if (!shouldLog(levelName, minimum)) {
                return null;
            }

            record = buildRecord(script, levelName, eventName, message, attributes, state);
            writeRecordToConsole(record);
            return record;
        }

        function emitDialog(levelName, title, message) {
            emit(levelName, message, { dialog: true }, "ui.dialog");
            showDialog(title || script, message, levelName);
        }

        function errorToAttributes(error, extraAttributes) {
            var attributes = cloneObject(extraAttributes);

            if (error) {
                attributes.error = error.message ? String(error.message) : String(error);

                if (error.stack) {
                    attributes.stacktrace = String(error.stack);
                }
            }

            return attributes;
        }

        return {
            getRunId: function () {
                return state.runId;
            },

            debug: function (message, attributes, eventName) {
                return emit("DEBUG", message, attributes, eventName || "script.debug");
            },

            info: function (message, attributes, eventName) {
                return emit("INFO", message, attributes, eventName || "script.info");
            },

            warn: function (message, attributes, eventName) {
                return emit("WARN", message, attributes, eventName || "script.warn");
            },

            error: function (message, attributes, eventName) {
                return emit("ERROR", message, attributes, eventName || "script.error");
            },

            fatal: function (message, attributes, eventName) {
                return emit("FATAL", message, attributes, eventName || "script.fatal");
            },

            start: function (message, attributes) {
                return emit("INFO", message || "Script started.", attributes, "script.lifecycle.start");
            },

            finish: function (message, attributes) {
                return emit("INFO", message || "Script finished.", attributes, "script.lifecycle.finish");
            },

            fail: function (message, error, attributes) {
                return emit("ERROR", message || "Script failed.", errorToAttributes(error, attributes), "script.lifecycle.fail");
            },

            infoDialog: function (title, message) {
                emitDialog("INFO", title, message);
            },

            warnDialog: function (title, message) {
                emitDialog("WARN", title, message);
            },

            errorDialog: function (title, message) {
                emitDialog("ERROR", title, message);
            }
        };
    }

    return {
        LEVELS: LEVELS,
        nowIso: nowIso,
        createRunId: createRunId,
        createLogger: createLogger,
        showDialog: showDialog
    };
})(typeof ArchiLogging !== "undefined" ? ArchiLogging : null);
