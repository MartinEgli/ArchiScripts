/*
===============================================================================
View Exchange Helpers
===============================================================================

Shared helpers to export a selected Archi view to JSON and import it back into
the current model while reusing matching concepts and relationships whenever
possible.
===============================================================================
*/

var ArchiViewExchange = (function (existing) {
    if (existing) {
        return existing;
    }

    var PROP = {
        SourceConceptId: "ArchiScripts.ViewExchange.SourceConceptId",
        SourceRelationshipId: "ArchiScripts.ViewExchange.SourceRelationshipId"
    };

    function safeString(value) {
        return value === null || typeof value === "undefined" ? "" : String(value);
    }

    function isNullOrEmpty(value) {
        return value === null || typeof value === "undefined" || String(value) === "";
    }

    function toKeyArray(keys) {
        if (keys === null || typeof keys === "undefined") {
            return [];
        }

        if (Object.prototype.toString.call(keys) === "[object Array]") {
            return keys;
        }

        return [keys];
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

    function readFully(path, charset) {
        var result = "";
        var imports = new JavaImporter(java.net, java.lang, java.io);

        with (imports) {
            var urlObject;
            var reader;
            var line;

            try {
                urlObject = new URL(path);
            } catch (error) {
                urlObject = new URL(new File(path).toURI().toURL());
            }

            reader = new BufferedReader(new InputStreamReader(urlObject.openStream(), charset || "UTF-8"));
            line = reader.readLine();

            while (line !== null) {
                result += line + "\n";
                line = reader.readLine();
            }

            reader.close();
        }

        return result;
    }

    function writeTextFile(path, text) {
        $.fs.writeFile(path, text, "UTF8");
    }

    function nowIso() {
        return new Date().toISOString();
    }

    function getSelectedView() {
        return $(selection).filter("archimate-diagram-model").first();
    }

    function getPropertyMap(object) {
        var keys = toKeyArray(object.prop());
        var properties = {};

        keys.forEach(function (key) {
            properties[String(key)] = object.prop(String(key));
        });

        return properties;
    }

    function applyPropertiesNonDestructive(object, properties, logger) {
        var key;
        var existingValue;

        for (key in properties) {
            if (properties.hasOwnProperty(key)) {
                existingValue = object.prop(key);

                if (isNullOrEmpty(existingValue)) {
                    object.prop(key, String(properties[key]));
                } else if (safeString(existingValue) !== safeString(properties[key]) && logger) {
                    logger.debug("Keeping existing property value.", {
                        property_name: key,
                        existing_value: safeString(existingValue),
                        imported_value: safeString(properties[key])
                    }, "view.exchange.property.kept");
                }
            }
        }
    }

    function setSpecializationIfPossible(object, specializationName, logger) {
        if (isNullOrEmpty(specializationName)) {
            return;
        }

        try {
            object.specialization = specializationName;
        } catch (error) {
            if (logger) {
                logger.warn("Could not apply specialization.", {
                    specialization: specializationName,
                    error: String(error)
                }, "view.exchange.specialization.skipped");
            }
        }
    }

    function getAbsoluteBounds(object, parentAbsoluteBounds) {
        var bounds = object.bounds;

        if (!parentAbsoluteBounds) {
            return {
                x: bounds.x,
                y: bounds.y,
                width: bounds.width,
                height: bounds.height
            };
        }

        return {
            x: parentAbsoluteBounds.x + bounds.x,
            y: parentAbsoluteBounds.y + bounds.y,
            width: bounds.width,
            height: bounds.height
        };
    }

    function buildElementRecord(visualObject, parentVisualObject, parentAbsoluteBounds) {
        var concept = visualObject.concept;
        var relativeBounds = cloneObject(visualObject.bounds);
        var absoluteBounds = getAbsoluteBounds(visualObject, parentAbsoluteBounds);

        return {
            source_view_object_id: visualObject.id,
            parent_view_object_id: parentVisualObject ? parentVisualObject.id : null,
            concept: {
                source_concept_id: concept.id,
                type: concept.type,
                name: safeString(concept.name),
                documentation: safeString(concept.documentation),
                specialization: safeString(concept.specialization),
                properties: getPropertyMap(concept)
            },
            visual: {
                relative_bounds: relativeBounds,
                absolute_bounds: absoluteBounds,
                fill_color: visualObject.fillColor,
                font_color: visualObject.fontColor,
                line_color: visualObject.lineColor,
                font_size: visualObject.fontSize,
                text_position: visualObject.textPosition
            }
        };
    }

    function exportVisualHierarchy(visualObject, parentVisualObject, parentAbsoluteBounds, result) {
        var currentRecord = buildElementRecord(visualObject, parentVisualObject, parentAbsoluteBounds);
        var currentAbsoluteBounds = currentRecord.visual.absolute_bounds;

        result.elements.push(currentRecord);

        $(visualObject).children("element").each(function (childVisualObject) {
            exportVisualHierarchy(childVisualObject, visualObject, currentAbsoluteBounds, result);
        });
    }

    function buildRelationshipRecord(connection) {
        var relationship = connection.concept;

        return {
            source_view_connection_id: connection.id,
            source_view_object_id: connection.source.id,
            target_view_object_id: connection.target.id,
            relationship: {
                source_relationship_id: relationship.id,
                type: relationship.type,
                name: safeString(relationship.name),
                documentation: safeString(relationship.documentation),
                specialization: safeString(relationship.specialization),
                access_type: relationship.type === "access-relationship" ? relationship.accessType : null,
                association_directed: relationship.type === "association-relationship" ? relationship.associationDirected : null,
                influence_strength: relationship.type === "influence-relationship" ? relationship.influenceStrength : null,
                properties: getPropertyMap(relationship)
            },
            visual: {
                line_color: connection.lineColor,
                font_color: connection.fontColor,
                line_width: connection.lineWidth,
                text_position: connection.textPosition
            }
        };
    }

    function createViewPackage(view) {
        var result = {
            schema: "archiscripts.view-exchange/1",
            exported_at: nowIso(),
            model: {
                name: safeString(model.name)
            },
            view: {
                id: view.id,
                name: safeString(view.name),
                documentation: safeString(view.documentation)
            },
            elements: [],
            relationships: []
        };

        $(view).children("element").each(function (visualObject) {
            exportVisualHierarchy(visualObject, null, null, result);
        });

        $(view).find("relationship").each(function (connection) {
            result.relationships.push(buildRelationshipRecord(connection));
        });

        return result;
    }

    function writeViewPackageToFile(viewPackage, path) {
        writeTextFile(path, JSON.stringify(viewPackage, null, 2));
    }

    function readViewPackageFromFile(path) {
        return JSON.parse(readFully(path, "UTF-8"));
    }

    function findExistingElement(elementData) {
        var bySourceId = $("concept").filter(function (concept) {
            return concept.type.indexOf("relationship") === -1 &&
                concept.prop(PROP.SourceConceptId) === elementData.source_concept_id;
        }).first();

        if (bySourceId) {
            return bySourceId;
        }

        return $("concept").filter(function (concept) {
            return concept.type === elementData.type &&
                safeString(concept.name).toLowerCase() === safeString(elementData.name).toLowerCase();
        }).first();
    }

    function findExistingRelationship(relationshipData, sourceElement, targetElement) {
        var bySourceId = $("relationship").filter(function (relationship) {
            return relationship.prop(PROP.SourceRelationshipId) === relationshipData.source_relationship_id;
        }).first();

        if (bySourceId) {
            return bySourceId;
        }

        return $("relationship").filter(function (relationship) {
            return relationship.type === relationshipData.type &&
                relationship.source.id === sourceElement.id &&
                relationship.target.id === targetElement.id &&
                safeString(relationship.name) === safeString(relationshipData.name);
        }).first();
    }

    function getOrCreateElement(record, logger) {
        var conceptData = record.concept;
        var element = findExistingElement(conceptData);

        if (element) {
            if (logger) {
                logger.info("Reusing existing element.", {
                    imported_name: conceptData.name,
                    matched_element_id: element.id,
                    matched_by: element.prop(PROP.SourceConceptId) === conceptData.source_concept_id ? "source_concept_id" : "type_and_name"
                }, "view.exchange.element.reused");
            }
        } else {
            element = model.createElement(conceptData.type, conceptData.name);
            if (logger) {
                logger.info("Created new element.", {
                    imported_name: conceptData.name,
                    created_element_id: element.id
                }, "view.exchange.element.created");
            }
        }

        if (isNullOrEmpty(element.documentation) && !isNullOrEmpty(conceptData.documentation)) {
            element.documentation = conceptData.documentation;
        }

        if (isNullOrEmpty(element.prop(PROP.SourceConceptId))) {
            element.prop(PROP.SourceConceptId, conceptData.source_concept_id);
        }

        applyPropertiesNonDestructive(element, conceptData.properties || {}, logger);
        setSpecializationIfPossible(element, conceptData.specialization, logger);

        return element;
    }

    function getOrCreateRelationship(record, sourceElement, targetElement, logger) {
        var relationshipData = record.relationship;
        var relationship = findExistingRelationship(relationshipData, sourceElement, targetElement);

        if (relationship) {
            if (logger) {
                logger.info("Reusing existing relationship.", {
                    relationship_type: relationship.type,
                    relationship_id: relationship.id,
                    matched_by: relationship.prop(PROP.SourceRelationshipId) === relationshipData.source_relationship_id ? "source_relationship_id" : "type_source_target_name"
                }, "view.exchange.relationship.reused");
            }
        } else {
            relationship = model.createRelationship(relationshipData.type, relationshipData.name, sourceElement, targetElement);

            if (logger) {
                logger.info("Created new relationship.", {
                    relationship_type: relationship.type,
                    relationship_id: relationship.id
                }, "view.exchange.relationship.created");
            }
        }

        if (isNullOrEmpty(relationship.documentation) && !isNullOrEmpty(relationshipData.documentation)) {
            relationship.documentation = relationshipData.documentation;
        }

        if (isNullOrEmpty(relationship.prop(PROP.SourceRelationshipId))) {
            relationship.prop(PROP.SourceRelationshipId, relationshipData.source_relationship_id);
        }

        if (relationship.type === "access-relationship" && !isNullOrEmpty(relationshipData.access_type)) {
            relationship.accessType = relationshipData.access_type;
        }

        if (relationship.type === "association-relationship" && relationshipData.association_directed !== null) {
            relationship.associationDirected = relationshipData.association_directed;
        }

        if (relationship.type === "influence-relationship" && !isNullOrEmpty(relationshipData.influence_strength)) {
            relationship.influenceStrength = relationshipData.influence_strength;
        }

        applyPropertiesNonDestructive(relationship, relationshipData.properties || {}, logger);
        setSpecializationIfPossible(relationship, relationshipData.specialization, logger);

        return relationship;
    }

    function applyVisualStyle(visualObject, visualData) {
        if (visualData.fill_color !== null && typeof visualData.fill_color !== "undefined") {
            visualObject.fillColor = visualData.fill_color;
        }

        if (visualData.font_color !== null && typeof visualData.font_color !== "undefined") {
            visualObject.fontColor = visualData.font_color;
        }

        if (visualData.line_color !== null && typeof visualData.line_color !== "undefined") {
            visualObject.lineColor = visualData.line_color;
        }

        if (visualData.font_size !== null && typeof visualData.font_size !== "undefined") {
            visualObject.fontSize = visualData.font_size;
        }

        if (visualData.text_position !== null && typeof visualData.text_position !== "undefined") {
            visualObject.textPosition = visualData.text_position;
        }
    }

    function applyConnectionStyle(connection, visualData) {
        if (visualData.line_color !== null && typeof visualData.line_color !== "undefined") {
            connection.lineColor = visualData.line_color;
        }

        if (visualData.font_color !== null && typeof visualData.font_color !== "undefined") {
            connection.fontColor = visualData.font_color;
        }

        if (visualData.line_width !== null && typeof visualData.line_width !== "undefined") {
            connection.lineWidth = visualData.line_width;
        }

        if (visualData.text_position !== null && typeof visualData.text_position !== "undefined") {
            connection.textPosition = visualData.text_position;
        }
    }

    function buildUniqueViewName(baseName) {
        var candidate = baseName;
        var counter = 2;

        while ($("view").filter(function (view) { return safeString(view.name) === candidate; }).first()) {
            candidate = baseName + " (" + counter + ")";
            counter++;
        }

        return candidate;
    }

    function importViewPackage(viewPackage, options) {
        var logger = options && options.logger ? options.logger : null;
        var targetViewName = options && options.targetViewName ? options.targetViewName : buildUniqueViewName(safeString(viewPackage.view.name) + " Imported");
        var targetView = model.createArchimateView(targetViewName);
        var conceptByViewObjectId = {};
        var visualByViewObjectId = {};

        targetView.documentation = safeString(viewPackage.view.documentation);

        viewPackage.elements.forEach(function (record) {
            var concept = getOrCreateElement(record, logger);
            var visual;
            var parentVisual = record.parent_view_object_id ? visualByViewObjectId[record.parent_view_object_id] : null;
            var relativeBounds = record.visual.relative_bounds;
            var absoluteBounds = record.visual.absolute_bounds;

            if (parentVisual) {
                visual = parentVisual.add(
                    concept,
                    relativeBounds.x,
                    relativeBounds.y,
                    relativeBounds.width,
                    relativeBounds.height
                );
            } else {
                visual = targetView.add(
                    concept,
                    absoluteBounds.x,
                    absoluteBounds.y,
                    absoluteBounds.width,
                    absoluteBounds.height
                );
            }

            applyVisualStyle(visual, record.visual);

            conceptByViewObjectId[record.source_view_object_id] = concept;
            visualByViewObjectId[record.source_view_object_id] = visual;
        });

        viewPackage.relationships.forEach(function (record) {
            var sourceConcept = conceptByViewObjectId[record.source_view_object_id];
            var targetConcept = conceptByViewObjectId[record.target_view_object_id];
            var sourceVisual = visualByViewObjectId[record.source_view_object_id];
            var targetVisual = visualByViewObjectId[record.target_view_object_id];
            var relationship;
            var connection;

            if (!sourceConcept || !targetConcept || !sourceVisual || !targetVisual) {
                if (logger) {
                    logger.warn("Skipping relationship because source or target is missing in the imported view.", {
                        source_view_object_id: record.source_view_object_id,
                        target_view_object_id: record.target_view_object_id
                    }, "view.exchange.relationship.skipped");
                }
                return;
            }

            relationship = getOrCreateRelationship(record, sourceConcept, targetConcept, logger);
            connection = targetView.add(relationship, sourceVisual, targetVisual);
            applyConnectionStyle(connection, record.visual);
        });

        return targetView;
    }

    return {
        PROP: PROP,
        getSelectedView: getSelectedView,
        createViewPackage: createViewPackage,
        writeViewPackageToFile: writeViewPackageToFile,
        readViewPackageFromFile: readViewPackageFromFile,
        importViewPackage: importViewPackage,
        buildUniqueViewName: buildUniqueViewName
    };
})(typeof ArchiViewExchange !== "undefined" ? ArchiViewExchange : null);
