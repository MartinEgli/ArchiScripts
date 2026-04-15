/*
===============================================================================
Central jArchi Dialog Helpers
===============================================================================

Shared dialog helpers for ArchiScripts.

Uses:
- window.* for standard jArchi dialogs where suitable
- JOptionPane for titled info/warn/error dialogs
- optional logger integration for dialog lifecycle events
===============================================================================
*/

var ArchiDialogs = (function (existing) {
    if (existing) {
        return existing;
    }

    function safeString(value) {
        return value === null || typeof value === "undefined" ? "" : String(value);
    }

    function toArray(values) {
        var result = [];
        var i;

        if (!values || !values.length) {
            return result;
        }

        for (i = 0; i < values.length; i++) {
            result.push(String(values[i]));
        }

        return result;
    }

    function logDialog(logger, level, message, attributes, eventName) {
        if (!logger) {
            return;
        }

        if (level === "debug" && logger.debug) {
            logger.debug(message, attributes, eventName);
        } else if (level === "warn" && logger.warn) {
            logger.warn(message, attributes, eventName);
        } else if (level === "error" && logger.error) {
            logger.error(message, attributes, eventName);
        } else if (logger.info) {
            logger.info(message, attributes, eventName);
        }
    }

    function createDialogService(logger, options) {
        var settings = options || {};
        var defaultTitle = settings.title || "ArchiScripts";

        function showMessage(title, message, kind) {
            var resolvedTitle = title || defaultTitle;
            var resolvedMessage = safeString(message);

            logDialog(logger, "info", "Showing dialog.", {
                dialog_kind: kind,
                dialog_title: resolvedTitle
            }, "ui.dialog.open");

            try {
                var JOptionPane = Java.type("javax.swing.JOptionPane");
                var iconType = JOptionPane.INFORMATION_MESSAGE;

                if (kind === "WARN") {
                    iconType = JOptionPane.WARNING_MESSAGE;
                } else if (kind === "ERROR") {
                    iconType = JOptionPane.ERROR_MESSAGE;
                }

                JOptionPane.showMessageDialog(null, resolvedMessage, resolvedTitle, iconType);
            } catch (error) {
                logDialog(logger, "warn", "Falling back to window alert after dialog failure.", {
                    dialog_kind: kind,
                    error: String(error)
                }, "ui.dialog.fallback");
                window.alert(resolvedMessage);
            }
        }

        function confirm(message, title) {
            var resolvedTitle = title || defaultTitle;
            var resolvedMessage = safeString(message);
            var result;

            logDialog(logger, "info", "Opening confirmation dialog.", {
                dialog_title: resolvedTitle
            }, "ui.confirm.open");

            result = window.confirm(resolvedMessage);

            logDialog(logger, "info", "Confirmation dialog closed.", {
                dialog_title: resolvedTitle,
                accepted: !!result
            }, result ? "ui.confirm.accepted" : "ui.confirm.cancelled");

            return !!result;
        }

        function promptText(message, defaultValue, title) {
            var resolvedTitle = title || defaultTitle;
            var resolvedMessage = safeString(message);
            var value;

            logDialog(logger, "info", "Opening text prompt.", {
                dialog_title: resolvedTitle,
                has_default: defaultValue !== null && typeof defaultValue !== "undefined"
            }, "ui.prompt.open");

            value = window.prompt(resolvedMessage, defaultValue === null || typeof defaultValue === "undefined" ? "" : String(defaultValue));

            logDialog(logger, "info", "Text prompt closed.", {
                dialog_title: resolvedTitle,
                cancelled: value === null,
                has_value: value !== null && String(value) !== ""
            }, value === null ? "ui.prompt.cancelled" : "ui.prompt.submitted");

            return value === null ? null : String(value);
        }

        function promptNumber(message, defaultValue, title) {
            var raw = promptText(message, defaultValue, title);
            var parsed;

            if (raw === null) {
                return null;
            }

            parsed = Number(raw);

            if (isNaN(parsed)) {
                logDialog(logger, "warn", "Prompt value is not a valid number.", {
                    entered_value: raw
                }, "ui.prompt.invalid_number");
                return null;
            }

            return parsed;
        }

        function selectFromList(message, values, title) {
            var resolvedTitle = title || defaultTitle;
            var optionsList = toArray(values);
            var result;

            logDialog(logger, "info", "Opening selection dialog.", {
                dialog_title: resolvedTitle,
                options_count: optionsList.length
            }, "ui.selection.open");

            result = window.promptSelection(safeString(message), optionsList);

            logDialog(logger, "info", "Selection dialog closed.", {
                dialog_title: resolvedTitle,
                cancelled: result === null,
                selected_value: result === null ? null : String(result)
            }, result === null ? "ui.selection.cancelled" : "ui.selection.submitted");

            return result === null ? null : String(result);
        }

        function chooseOpenFile(dialogOptions) {
            var optionsWithDefaults = dialogOptions || {};
            var result = window.promptOpenFile(optionsWithDefaults);

            logDialog(logger, "info", "Open file dialog closed.", {
                selected_path: result === null ? null : String(result)
            }, result === null ? "ui.file.open.cancelled" : "ui.file.open.selected");

            return result === null ? null : String(result);
        }

        function chooseOpenDirectory(dialogOptions) {
            var optionsWithDefaults = dialogOptions || {};
            var result = window.promptOpenDirectory(optionsWithDefaults);

            logDialog(logger, "info", "Open directory dialog closed.", {
                selected_path: result === null ? null : String(result)
            }, result === null ? "ui.directory.open.cancelled" : "ui.directory.open.selected");

            return result === null ? null : String(result);
        }

        function chooseSaveFile(dialogOptions) {
            var optionsWithDefaults = dialogOptions || {};
            var result = window.promptSaveFile(optionsWithDefaults);

            logDialog(logger, "info", "Save file dialog closed.", {
                selected_path: result === null ? null : String(result)
            }, result === null ? "ui.file.save.cancelled" : "ui.file.save.selected");

            return result === null ? null : String(result);
        }

        return {
            showInfo: function (message, title) {
                showMessage(title, message, "INFO");
            },

            showWarning: function (message, title) {
                showMessage(title, message, "WARN");
            },

            showError: function (message, title) {
                showMessage(title, message, "ERROR");
            },

            confirmInfo: function (message, title) {
                return confirm(message, title);
            },

            confirmWarning: function (message, title) {
                return confirm(message, title);
            },

            promptText: function (message, defaultValue, title) {
                return promptText(message, defaultValue, title);
            },

            promptNumber: function (message, defaultValue, title) {
                return promptNumber(message, defaultValue, title);
            },

            selectFromList: function (message, values, title) {
                return selectFromList(message, values, title);
            },

            chooseOpenFile: function (dialogOptions) {
                return chooseOpenFile(dialogOptions);
            },

            chooseOpenDirectory: function (dialogOptions) {
                return chooseOpenDirectory(dialogOptions);
            },

            chooseSaveFile: function (dialogOptions) {
                return chooseSaveFile(dialogOptions);
            }
        };
    }

    return {
        createDialogService: createDialogService
    };
})(typeof ArchiDialogs !== "undefined" ? ArchiDialogs : null);
