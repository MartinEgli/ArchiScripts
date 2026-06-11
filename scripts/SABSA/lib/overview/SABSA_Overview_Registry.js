/*
===============================================================================
SABSA Overview Registry
===============================================================================

Shared registry for SABSA script families. Generators register themselves after
successful execution. The overview renderer then shows only registered entries.
===============================================================================
*/

var SabsaOverview = (function (existing) {
    if (existing) {
        return existing;
    }

    var REGISTRY_PROPERTY = "SabsaOverviewRegistryJson";
    var VIEW_NAME = "SABSA - Overview";

    function safeString(value) {
        return value === null || typeof value === "undefined" ? "" : String(value);
    }

    function trim(value) {
        return safeString(value).replace(/^\s+|\s+$/g, "");
    }

    function normalizeFolderName(folderName) {
        return safeString(folderName)
            .toLowerCase()
            .replace(/&/g, "and")
            .replace(/[^a-z0-9]+/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function slugify(value) {
        return trim(value)
            .toLowerCase()
            .replace(/&/g, "and")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    function parseJsonArray(value) {
        try {
            var parsed = JSON.parse(safeString(value) || "[]");
            return parsed && parsed.length ? parsed : [];
        } catch (error) {
            return [];
        }
    }

    function getEntries() {
        return parseJsonArray(model.prop(REGISTRY_PROPERTY));
    }

    function writeEntries(entries) {
        model.prop(REGISTRY_PROPERTY, JSON.stringify(entries || [], null, 2));
    }

    function normalizeEntry(entry) {
        var now = new Date().toISOString();
        var key = safeString(entry && entry.key);

        if (!key) {
            key = slugify((entry && entry.level ? entry.level + ":" : "") + safeString(entry && entry.title));
        }

        return {
            key: key,
            title: safeString(entry && entry.title) || key,
            level: safeString(entry && entry.level) || "Foundation",
            family: safeString(entry && entry.family) || "General",
            area: safeString(entry && entry.area) || "General",
            description: safeString(entry && entry.description),
            viewNames: entry && entry.viewNames ? entry.viewNames : [],
            scriptPath: safeString(entry && entry.scriptPath),
            sourcePath: safeString(entry && entry.sourcePath),
            status: safeString(entry && entry.status) || "generated",
            sortKey: safeString(entry && entry.sortKey),
            firstRegisteredAt: safeString(entry && entry.firstRegisteredAt) || now,
            lastRegisteredAt: now
        };
    }

    function register(entry) {
        var entries = getEntries();
        var normalized = normalizeEntry(entry);
        var found = false;

        entries = entries.map(function (candidate) {
            if (safeString(candidate.key) !== normalized.key) {
                return candidate;
            }

            found = true;
            normalized.firstRegisteredAt = safeString(candidate.firstRegisteredAt) || normalized.firstRegisteredAt;
            return normalized;
        });

        if (!found) {
            entries.push(normalized);
        }

        entries.sort(compareEntries);
        writeEntries(entries);
        return normalized;
    }

    function compareEntries(left, right) {
        var leftSort = safeString(left.sortKey) || safeString(left.level) + ":" + safeString(left.family) + ":" + safeString(left.title);
        var rightSort = safeString(right.sortKey) || safeString(right.level) + ":" + safeString(right.family) + ":" + safeString(right.title);
        return leftSort.localeCompare(rightSort);
    }

    function getTopLevelFolder(rootName) {
        var wanted = normalizeFolderName(rootName);
        var found = null;

        $(model).children("folder").each(function (folder) {
            if (!found && normalizeFolderName(folder.name) === wanted) {
                found = folder;
            }
        });

        return found;
    }

    function ensureChildFolder(parentFolder, childName) {
        var childFolder = $(parentFolder).children("folder").filter(function (folder) {
            return safeString(folder.name) === safeString(childName);
        }).first();

        return childFolder || parentFolder.createFolder(childName);
    }

    function ensureFolderPath(rootName, pathSegments) {
        var currentFolder = getTopLevelFolder(rootName);

        if (!currentFolder) {
            throw new Error("Top-level folder not found: " + rootName);
        }

        (pathSegments || []).forEach(function (segment) {
            currentFolder = ensureChildFolder(currentFolder, segment);
        });

        return currentFolder;
    }

    function moveViewToOverviewFolder(viewObject) {
        ensureFolderPath("Views", ["SABSA"]).add(viewObject);
        return viewObject;
    }

    function buildUniqueViewName(baseName) {
        var candidate = baseName;
        var suffix = 2;

        while ($("view").filter(function (viewObject) {
            return safeString(viewObject.name) === candidate;
        }).first()) {
            candidate = baseName + " (" + suffix + ")";
            suffix++;
        }

        return candidate;
    }

    function styleShape(shape, fillColor) {
        shape.fillColor = fillColor;
        shape.lineColor = "#204456";
        shape.fontColor = "#102a36";
        shape.opacity = 255;
        shape.outlineOpacity = 255;
    }

    function addNote(container, text, x, y, width, height, fillColor) {
        var note = container.createObject("note", x, y, width, height);
        note.text = text;
        styleShape(note, fillColor);
        return note;
    }

    function addGroup(view, name, x, y, width, height, fillColor) {
        var group = view.createObject("group", x, y, width, height);
        group.name = name;
        styleShape(group, fillColor);
        return group;
    }

    function groupEntries(entries) {
        var grouped = {};

        (entries || []).forEach(function (entry) {
            var level = safeString(entry.level) || "Foundation";
            var family = safeString(entry.family) || "General";

            if (!grouped[level]) {
                grouped[level] = {};
            }
            if (!grouped[level][family]) {
                grouped[level][family] = [];
            }
            grouped[level][family].push(entry);
        });

        return grouped;
    }

    function formatEntry(entry) {
        var lines = [
            safeString(entry.title),
            safeString(entry.area)
        ];

        if (entry.viewNames && entry.viewNames.length) {
            lines.push("Views: " + entry.viewNames.join(", "));
        }
        if (entry.description) {
            lines.push(entry.description);
        }

        return lines.join("\n");
    }

    function renderOverview() {
        var entries = getEntries().sort(compareEntries);
        var grouped = groupEntries(entries);
        var view = model.createArchimateView(buildUniqueViewName(VIEW_NAME));
        var currentY = 150;
        var levelNames = Object.keys(grouped).sort();
        var layout = {
            x: 40,
            headerY: 40,
            width: 1460,
            groupInnerX: 22,
            groupInnerY: 36,
            cardWidth: 320,
            cardHeight: 118,
            gapX: 24,
            gapY: 24,
            columns: 4
        };

        view.documentation = "Generated from model property " + REGISTRY_PROPERTY + ". Shows only SABSA parts that registered themselves after successful generation.";
        moveViewToOverviewFolder(view);

        addNote(
            view,
            "SABSA Overview\nRegistered model parts only",
            layout.x,
            layout.headerY,
            760,
            86,
            "#eef7f4"
        );

        if (!entries.length) {
            addNote(view, "No SABSA parts are registered yet.", layout.x, currentY, 520, 90, "#fff7cc");
            return view;
        }

        levelNames.forEach(function (levelName) {
            var families = grouped[levelName];
            var familyNames = Object.keys(families).sort();
            var groupHeight = 0;
            var group;
            var localY;

            familyNames.forEach(function (familyName) {
                var rowCount = Math.ceil(families[familyName].length / layout.columns);
                groupHeight += 44 + (rowCount * (layout.cardHeight + layout.gapY)) + 8;
            });

            groupHeight = layout.groupInnerY + groupHeight + layout.gapY;
            group = addGroup(view, levelName, layout.x, currentY, layout.width, groupHeight, "#f3f8fb");
            localY = layout.groupInnerY;

            familyNames.forEach(function (familyName) {
                var entriesForFamily = families[familyName].sort(compareEntries);

                addNote(group, familyName, layout.groupInnerX, localY, 260, 34, "#dceef8");
                localY += 44;

                entriesForFamily.forEach(function (entry, index) {
                    var row = Math.floor(index / layout.columns);
                    var col = index % layout.columns;

                    addNote(
                        group,
                        formatEntry(entry),
                        layout.groupInnerX + (col * (layout.cardWidth + layout.gapX)),
                        localY + (row * (layout.cardHeight + layout.gapY)),
                        layout.cardWidth,
                        layout.cardHeight,
                        "#ffffff"
                    );
                });

                localY += (Math.ceil(entriesForFamily.length / layout.columns) * (layout.cardHeight + layout.gapY)) + 8;
            });

            currentY += groupHeight + layout.gapY;
        });

        return view;
    }

    return {
        propertyName: REGISTRY_PROPERTY,
        viewName: VIEW_NAME,
        getEntries: getEntries,
        register: register,
        renderOverview: renderOverview
    };
})(typeof SabsaOverview === "undefined" ? null : SabsaOverview);
