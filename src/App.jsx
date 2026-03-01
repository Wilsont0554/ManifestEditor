import "./App.css";
import React, { useEffect, useMemo, useState } from "react";
import ManifestObject from "./ManifestClasses/ManifestObject.js";
import ContentResource from "./ManifestClasses/ContentResource.js";

const CANVAS_TABS = [
  "Overview",
  "Descriptive",
  "Metadata",
  "Technical",
  "Linking",
  "Structure",
  "Nav place",
];

function createDefaultCanvasTemplate(index = 1) {
  const canvasId = `https://example.org/iiif/canvas/c${index}`;

  return {
    canvasId,
    label: "Untitled canvas item",
    summary: "",
    mediaId: "https://example.org/iiif/images/item-1/full/max/0/default.jpg",
    mediaType: "Image",
    mediaFormat: "image/jpeg",
    width: 1200,
    height: 1600,
    duration: 0,
    paintingAnnotationPageId: `${canvasId}/page/p1/1`,
    annotationPageId: `${canvasId}/annopage/p1`,
    annotationCount: 0,
    rights: "",
    metadataItems: [],
    seeAlsoItems: [],
    renderingItems: [],
    behaviorValue: "",
    thumbnailId: "",
    thumbnailType: "Image",
    thumbnailFormat: "image/jpeg",
    navPlaceLabel: "",
    navPlaceLatitude: "",
    navPlaceLongitude: "",
  };
}

function deriveIiifImageServiceId(imageUrl) {
  if (!imageUrl) {
    return "";
  }

  const match = imageUrl.match(/^(.*)\/full\/[^/]+\/[^/]+\/default\.[a-zA-Z0-9]+$/);
  return match ? match[1] : "";
}

function getViewFromHash() {
  return window.location.hash === "#manifest-creator" ? "manifest-creator" : "home";
}

function getLocalizedString(value) {
  if (!value || typeof value !== "object") {
    return "";
  }

  const firstLanguageKey = Object.keys(value)[0];
  const localizedValue = value[firstLanguageKey];
  return Array.isArray(localizedValue) && localizedValue.length > 0 ? localizedValue[0] : "";
}

function mapMetadataItems(metadata = []) {
  return metadata
    .map((item) => ({
      label: getLocalizedString(item?.label),
      value: getLocalizedString(item?.value),
    }))
    .filter((item) => item.label || item.value);
}

function mapLinkItems(items = []) {
  return items
    .map((item) => ({
      id: item?.id || "",
      type: item?.type || "",
      format: item?.format || "",
    }))
    .filter((item) => item.id || item.type || item.format);
}

function buildTemplateFromContainer(container, canvasIndex) {
  if (!container) {
    return createDefaultCanvasTemplate(canvasIndex + 1);
  }

  const annotationPage = container.getAnnotationPage?.(0);
  const primaryAnnotation = annotationPage?.getAnnotation?.(0);
  const firstMedia = primaryAnnotation?.getContentResource?.(0);
  const firstThumbnail = Array.isArray(container.thumbnail) ? container.thumbnail[0] : null;
  const annotationRef = Array.isArray(container.annotations) ? container.annotations[0] : null;
  const navFeature = container.navPlace?.features?.[0];
  const navCoordinates = Array.isArray(navFeature?.geometry?.coordinates)
    ? navFeature.geometry.coordinates
    : [];

  return {
    canvasId: container.id || createDefaultCanvasTemplate(canvasIndex + 1).canvasId,
    label: getLocalizedString(container.label) || "Untitled canvas item",
    summary: getLocalizedString(container.summary),
    mediaId: firstMedia?.id || "",
    mediaType: firstMedia?.type || "Image",
    mediaFormat: firstMedia?.format || "image/jpeg",
    width: container.width || 1200,
    height: container.height || 1600,
    duration: container.duration || 0,
    paintingAnnotationPageId: annotationPage?.id || `${container.id}/page/p1/1`,
    annotationPageId: annotationRef?.id || `${container.id}/annopage/p1`,
    annotationCount: Array.isArray(annotationRef?.items) ? annotationRef.items.length : 0,
    rights: container.rights || "",
    metadataItems: mapMetadataItems(container.metadata),
    seeAlsoItems: mapLinkItems(container.seeAlso),
    renderingItems: mapLinkItems(container.rendering),
    behaviorValue: Array.isArray(container.behavior) ? container.behavior.join(", ") : "",
    thumbnailId: firstThumbnail?.id || "",
    thumbnailType: firstThumbnail?.type || "Image",
    thumbnailFormat: firstThumbnail?.format || "image/jpeg",
    navPlaceLabel: getLocalizedString(navFeature?.properties?.label),
    navPlaceLatitude: navCoordinates.length > 1 ? String(navCoordinates[1]) : "",
    navPlaceLongitude: navCoordinates.length > 0 ? String(navCoordinates[0]) : "",
  };
}

function App() {
  const [activeView, setActiveView] = useState(getViewFromHash);
  const [count, setCount] = useState(0);
  const [manifestObj] = useState(() => new ManifestObject("Canvas"));
  const [activeCanvasIndex, setActiveCanvasIndex] = useState(0);
  const [containerType, setContainerType] = useState("Canvas");
  const [canvasTemplate, setCanvasTemplate] = useState(() => createDefaultCanvasTemplate(1));
  const [activeCanvasTab, setActiveCanvasTab] = useState("Overview");

  useEffect(() => {
    const onHashChange = () => {
      setActiveView(getViewFromHash());
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const activeContainer = manifestObj.getContainerObj(activeCanvasIndex);
    if (!activeContainer) {
      return;
    }

    setContainerType(activeContainer.getType());
    setCanvasTemplate(buildTemplateFromContainer(activeContainer, activeCanvasIndex));
  }, [activeCanvasIndex, manifestObj, count]);

  const canvasOptions = useMemo(() => manifestObj.getAllContainers(), [manifestObj, count]);

  const updateTemplateField = (field, value) => {
    setCanvasTemplate((prev) => ({ ...prev, [field]: value }));
  };

  const updateListItem = (listName, index, field, value) => {
    setCanvasTemplate((prev) => ({
      ...prev,
      [listName]: prev[listName].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addListItem = (listName, template) => {
    setCanvasTemplate((prev) => ({
      ...prev,
      [listName]: [...prev[listName], template],
    }));
  };

  const removeListItem = (listName, index) => {
    setCanvasTemplate((prev) => ({
      ...prev,
      [listName]: prev[listName].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const JSONToFile = (obj, filename) => {
    const blob = new Blob([JSON.stringify(obj, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  function applyCanvasTemplateToContainer(container, template) {
    if (!container) {
      return;
    }

    const fallbackId = createDefaultCanvasTemplate(activeCanvasIndex + 1).canvasId;
    const canvasId = template.canvasId.trim() || fallbackId;
    const annotationRefId = template.annotationPageId.trim() || `${canvasId}/annopage/p1`;
    const paintingAnnotationPageId =
      template.paintingAnnotationPageId.trim() || `${canvasId}/page/p1/1`;

    container.setType(containerType || "Canvas");
    container.setId(canvasId);
    container.setLabel(template.label.trim() || "Untitled canvas item");
    container.setSummary(template.summary.trim());
    container.setDimensions(Number(template.width), Number(template.height));
    container.setDuration(Number(template.duration));
    container.setRights(template.rights.trim());

    container.metadata = template.metadataItems
      .filter((item) => item.label.trim() || item.value.trim())
      .map((item) => ({
        label: { en: [item.label.trim()] },
        value: { en: [item.value.trim()] },
      }));

    container.seeAlso = template.seeAlsoItems
      .filter((item) => item.id.trim())
      .map((item) => ({
        id: item.id.trim(),
        type: item.type.trim() || "Dataset",
        format: item.format.trim() || undefined,
      }));

    container.rendering = template.renderingItems
      .filter((item) => item.id.trim())
      .map((item) => ({
        id: item.id.trim(),
        type: item.type.trim() || "Text",
        format: item.format.trim() || undefined,
      }));

    container.behavior = template.behaviorValue
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    container.setAnnotationPageReference(annotationRefId);
    container.setPaintingAnnotationPageId(paintingAnnotationPageId);

    const parsedAnnotationCount = Math.max(0, Number(template.annotationCount) || 0);
    if (container.annotations[0]) {
      container.annotations[0].items = Array.from({ length: parsedAnnotationCount }, (_, index) => ({
        id: `${annotationRefId}/a${index + 1}`,
        type: "Annotation",
      }));
    }

    const annotationPage = container.getAnnotationPage(0);
    annotationPage.setCanvasId(canvasId);
    annotationPage.setId(paintingAnnotationPageId);

    const annotation = annotationPage.getAnnotation(0);
    annotation.setId(`${canvasId}/annotation/p0001-image`);
    annotation.setTarget(canvasId);
    annotation.setMotivation("painting");
    annotation.clearContentResources();

    const primaryResource = new ContentResource(
      template.mediaId.trim(),
      template.mediaType.trim() || "Image",
      template.mediaFormat.trim() || "image/jpeg",
    );

    const serviceId = deriveIiifImageServiceId(template.mediaId.trim());
    if (serviceId) {
      primaryResource.setImageService(serviceId);
    }

    annotation.addContentResource(primaryResource);

    if (template.thumbnailId.trim()) {
      container.thumbnail = [
        {
          id: template.thumbnailId.trim(),
          type: template.thumbnailType.trim() || "Image",
          format: template.thumbnailFormat.trim() || "image/jpeg",
        },
      ];
    } else {
      container.setThumbnailFromMedia(primaryResource);
    }

    const navLatitude = Number(template.navPlaceLatitude);
    const navLongitude = Number(template.navPlaceLongitude);

    if (Number.isFinite(navLatitude) && Number.isFinite(navLongitude)) {
      const navProperties = template.navPlaceLabel.trim()
        ? {
            label: {
              en: [template.navPlaceLabel.trim()],
            },
          }
        : {};

      container.navPlace = {
        id: `${canvasId}/navplace`,
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: navProperties,
            geometry: {
              type: "Point",
              coordinates: [navLongitude, navLatitude],
            },
          },
        ],
      };
    } else {
      container.navPlace = null;
    }
  }

  function createAnnotation() {
    const activeContainer = manifestObj.getContainerObj(activeCanvasIndex);
    if (!activeContainer) {
      return;
    }

    const nextResource =
      containerType === "Canvas"
        ? new ContentResource("", "Image", "image/jpeg")
        : new ContentResource("", "Model", "model/gltf-binary");

    activeContainer.getAnnotationPage().getAnnotation().addContentResource(nextResource);
    setCount((value) => value + 1);
  }

  function addCanvasItem() {
    const nextIndex = manifestObj.getAllContainers().length + 1;
    const defaultTemplate = createDefaultCanvasTemplate(nextIndex);
    const nextTemplate = {
      ...defaultTemplate,
      mediaId: canvasTemplate.mediaId,
      mediaType: canvasTemplate.mediaType,
      mediaFormat: canvasTemplate.mediaFormat,
      width: canvasTemplate.width,
      height: canvasTemplate.height,
      duration: canvasTemplate.duration,
    };

    const nextContainer = manifestObj.addContainerFromTemplate(nextTemplate);
    applyCanvasTemplateToContainer(nextContainer, nextTemplate);
    setActiveCanvasIndex(nextIndex - 1);
    setCanvasTemplate(nextTemplate);
    setCount((value) => value + 1);
  }

  function applyCanvasTemplate() {
    const container = manifestObj.getContainerObj(activeCanvasIndex);
    applyCanvasTemplateToContainer(container, canvasTemplate);
    setCount((value) => value + 1);
  }

  const activeContainer = manifestObj.getContainerObj(activeCanvasIndex);
  const contentResources = activeContainer
    ? activeContainer.getAnnotationPage().getAnnotation(0).getAllContentResource()
    : [];

  return (
    <div className="app-shell">
      <header className="app-nav">
        <p className="app-nav__brand">Manifest Editor</p>
        <nav className="app-nav__links">
          <a href="#home">Home</a>
          <a href="#manifest-creator">Manifest Creator</a>
          <a href="https://github.com/Wilsont0554/ManifestEditor" target="_blank" rel="noreferrer">
            Github
          </a>
          <a
            href="https://preview.iiif.io/api/full_manifests/presentation/4.0/#scene"
            target="_blank"
            rel="noreferrer"
          >
            Documentation
          </a>
        </nav>
      </header>

      <main className="app-main">
        {activeView === "manifest-creator" ? (
          <section className="manifest-creator">
            <div className="manifest-toolbar">
              <button
                type="button"
                className="manifest-toolbar__download"
                onClick={() => JSONToFile(manifestObj, "manifest")}
              >
                Download JSON
              </button>

              <div className="manifest-toolbar__controls">
                <select
                  value={activeCanvasIndex}
                  onChange={(event) => {
                    setActiveCanvasIndex(Number(event.target.value));
                    setCount((value) => value + 1);
                  }}
                >
                  {canvasOptions.map((container, index) => (
                    <option key={container.id} value={index}>
                      Canvas {index + 1}
                    </option>
                  ))}
                </select>

                <select
                  value={containerType}
                  onChange={(event) => {
                    manifestObj.getContainerObj(activeCanvasIndex).setType(event.target.value);
                    setContainerType(event.target.value);
                    setCount((value) => value + 1);
                  }}
                >
                  <option>Canvas</option>
                  <option>Scene</option>
                </select>

                <button type="button" onClick={addCanvasItem}>
                  Add Canvas Item
                </button>
              </div>
            </div>

            <section className="canvas-panel" aria-label="Canvas editor">
              <div className="canvas-panel__header">
                <h2>Canvas</h2>
                <button
                  type="button"
                  className="canvas-panel__close"
                  aria-label="Close canvas panel"
                  onClick={() => setActiveView("home")}
                >
                  x
                </button>
              </div>

              <div className="canvas-tabs" role="tablist" aria-label="Canvas sections">
                {CANVAS_TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={activeCanvasTab === tab}
                    className={`canvas-tab${activeCanvasTab === tab ? " canvas-tab--active" : ""}`}
                    onClick={() => setActiveCanvasTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="canvas-panel__body">
                {activeCanvasTab === "Overview" ? (
                  <div className="canvas-section">
                    <label className="canvas-field__label" htmlFor="overview-label">
                      Label
                    </label>
                    <input
                      id="overview-label"
                      className="canvas-input"
                      type="text"
                      value={canvasTemplate.label}
                      onChange={(event) => updateTemplateField("label", event.target.value)}
                    />

                    <h3>Media</h3>
                    <div className="canvas-card-grid">
                      <input
                        className="canvas-input"
                        type="text"
                        placeholder="Media id"
                        value={canvasTemplate.mediaId}
                        onChange={(event) => updateTemplateField("mediaId", event.target.value)}
                      />
                      <input
                        className="canvas-input"
                        type="text"
                        placeholder="Media type"
                        value={canvasTemplate.mediaType}
                        onChange={(event) => updateTemplateField("mediaType", event.target.value)}
                      />
                      <input
                        className="canvas-input"
                        type="text"
                        placeholder="Media format"
                        value={canvasTemplate.mediaFormat}
                        onChange={(event) => updateTemplateField("mediaFormat", event.target.value)}
                      />
                    </div>
                    <p className="canvas-inline-note">
                      Current painting body count: {contentResources.length}
                    </p>
                    <button type="button" className="canvas-secondary" onClick={createAnnotation}>
                      + Add media
                    </button>

                    <h3>Annotations</h3>
                    <div className="canvas-card-grid">
                      <input
                        className="canvas-input"
                        type="text"
                        placeholder="Annotation page id"
                        value={canvasTemplate.annotationPageId}
                        onChange={(event) => updateTemplateField("annotationPageId", event.target.value)}
                      />
                      <input
                        className="canvas-input"
                        type="number"
                        min="0"
                        placeholder="Annotation count"
                        value={canvasTemplate.annotationCount}
                        onChange={(event) => updateTemplateField("annotationCount", event.target.value)}
                      />
                    </div>
                  </div>
                ) : null}

                {activeCanvasTab === "Descriptive" ? (
                  <div className="canvas-section">
                    <label className="canvas-field__label" htmlFor="descriptive-label">
                      Label
                    </label>
                    <input
                      id="descriptive-label"
                      className="canvas-input"
                      type="text"
                      value={canvasTemplate.label}
                      onChange={(event) => updateTemplateField("label", event.target.value)}
                    />

                    <label className="canvas-field__label" htmlFor="descriptive-summary">
                      Summary
                    </label>
                    <textarea
                      id="descriptive-summary"
                      className="canvas-textarea"
                      value={canvasTemplate.summary}
                      onChange={(event) => updateTemplateField("summary", event.target.value)}
                    />

                    <h3>Thumbnail</h3>
                    <div className="canvas-card-grid">
                      <input
                        className="canvas-input"
                        type="text"
                        placeholder="Thumbnail id"
                        value={canvasTemplate.thumbnailId}
                        onChange={(event) => updateTemplateField("thumbnailId", event.target.value)}
                      />
                      <input
                        className="canvas-input"
                        type="text"
                        placeholder="Thumbnail type"
                        value={canvasTemplate.thumbnailType}
                        onChange={(event) => updateTemplateField("thumbnailType", event.target.value)}
                      />
                      <input
                        className="canvas-input"
                        type="text"
                        placeholder="Thumbnail format"
                        value={canvasTemplate.thumbnailFormat}
                        onChange={(event) => updateTemplateField("thumbnailFormat", event.target.value)}
                      />
                    </div>

                    <label className="canvas-field__label" htmlFor="descriptive-rights">
                      Rights
                    </label>
                    <input
                      id="descriptive-rights"
                      className="canvas-input"
                      type="text"
                      placeholder="https://creativecommons.org/licenses/..."
                      value={canvasTemplate.rights}
                      onChange={(event) => updateTemplateField("rights", event.target.value)}
                    />
                  </div>
                ) : null}

                {activeCanvasTab === "Metadata" ? (
                  <div className="canvas-section">
                    {canvasTemplate.metadataItems.length === 0 ? (
                      <div className="canvas-empty">No metadata items</div>
                    ) : (
                      canvasTemplate.metadataItems.map((item, index) => (
                        <div className="canvas-list-row" key={`metadata-${index}`}>
                          <input
                            className="canvas-input"
                            type="text"
                            placeholder="Label"
                            value={item.label}
                            onChange={(event) =>
                              updateListItem("metadataItems", index, "label", event.target.value)
                            }
                          />
                          <input
                            className="canvas-input"
                            type="text"
                            placeholder="Value"
                            value={item.value}
                            onChange={(event) =>
                              updateListItem("metadataItems", index, "value", event.target.value)
                            }
                          />
                          <button
                            type="button"
                            className="canvas-remove"
                            onClick={() => removeListItem("metadataItems", index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}

                    <button
                      type="button"
                      className="canvas-secondary"
                      onClick={() => addListItem("metadataItems", { label: "", value: "" })}
                    >
                      + Add metadata item
                    </button>
                  </div>
                ) : null}

                {activeCanvasTab === "Technical" ? (
                  <div className="canvas-section">
                    <label className="canvas-field__label" htmlFor="technical-id">
                      Identifier
                    </label>
                    <input
                      id="technical-id"
                      className="canvas-input"
                      type="text"
                      value={canvasTemplate.canvasId}
                      onChange={(event) => updateTemplateField("canvasId", event.target.value)}
                    />

                    <div className="canvas-columns">
                      <div>
                        <label className="canvas-field__label" htmlFor="technical-height">
                          Height
                        </label>
                        <input
                          id="technical-height"
                          className="canvas-input"
                          type="number"
                          min="1"
                          value={canvasTemplate.height}
                          onChange={(event) => updateTemplateField("height", event.target.value)}
                        />
                      </div>

                      <div>
                        <label className="canvas-field__label" htmlFor="technical-width">
                          Width
                        </label>
                        <input
                          id="technical-width"
                          className="canvas-input"
                          type="number"
                          min="1"
                          value={canvasTemplate.width}
                          onChange={(event) => updateTemplateField("width", event.target.value)}
                        />
                      </div>

                      <div>
                        <label className="canvas-field__label" htmlFor="technical-duration">
                          Duration
                        </label>
                        <input
                          id="technical-duration"
                          className="canvas-input"
                          type="number"
                          min="0"
                          step="any"
                          value={canvasTemplate.duration}
                          onChange={(event) => updateTemplateField("duration", event.target.value)}
                        />
                      </div>
                    </div>

                    <label className="canvas-field__label" htmlFor="technical-behaviors">
                      Behaviors (comma-separated)
                    </label>
                    <input
                      id="technical-behaviors"
                      className="canvas-input"
                      type="text"
                      placeholder="auto-advance, no-nav"
                      value={canvasTemplate.behaviorValue}
                      onChange={(event) => updateTemplateField("behaviorValue", event.target.value)}
                    />
                  </div>
                ) : null}

                {activeCanvasTab === "Linking" ? (
                  <div className="canvas-section">
                    <h3>See also</h3>
                    {canvasTemplate.seeAlsoItems.length === 0 ? (
                      <div className="canvas-empty">No see also</div>
                    ) : (
                      canvasTemplate.seeAlsoItems.map((item, index) => (
                        <div className="canvas-list-row" key={`see-also-${index}`}>
                          <input
                            className="canvas-input"
                            type="text"
                            placeholder="id"
                            value={item.id}
                            onChange={(event) =>
                              updateListItem("seeAlsoItems", index, "id", event.target.value)
                            }
                          />
                          <input
                            className="canvas-input"
                            type="text"
                            placeholder="type"
                            value={item.type}
                            onChange={(event) =>
                              updateListItem("seeAlsoItems", index, "type", event.target.value)
                            }
                          />
                          <input
                            className="canvas-input"
                            type="text"
                            placeholder="format"
                            value={item.format}
                            onChange={(event) =>
                              updateListItem("seeAlsoItems", index, "format", event.target.value)
                            }
                          />
                          <button
                            type="button"
                            className="canvas-remove"
                            onClick={() => removeListItem("seeAlsoItems", index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}

                    <button
                      type="button"
                      className="canvas-secondary"
                      onClick={() => addListItem("seeAlsoItems", { id: "", type: "Dataset", format: "" })}
                    >
                      + Add See also
                    </button>

                    <h3>Rendering</h3>
                    {canvasTemplate.renderingItems.length === 0 ? (
                      <div className="canvas-empty">No rendering</div>
                    ) : (
                      canvasTemplate.renderingItems.map((item, index) => (
                        <div className="canvas-list-row" key={`rendering-${index}`}>
                          <input
                            className="canvas-input"
                            type="text"
                            placeholder="id"
                            value={item.id}
                            onChange={(event) =>
                              updateListItem("renderingItems", index, "id", event.target.value)
                            }
                          />
                          <input
                            className="canvas-input"
                            type="text"
                            placeholder="type"
                            value={item.type}
                            onChange={(event) =>
                              updateListItem("renderingItems", index, "type", event.target.value)
                            }
                          />
                          <input
                            className="canvas-input"
                            type="text"
                            placeholder="format"
                            value={item.format}
                            onChange={(event) =>
                              updateListItem("renderingItems", index, "format", event.target.value)
                            }
                          />
                          <button
                            type="button"
                            className="canvas-remove"
                            onClick={() => removeListItem("renderingItems", index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}

                    <button
                      type="button"
                      className="canvas-secondary"
                      onClick={() => addListItem("renderingItems", { id: "", type: "Text", format: "" })}
                    >
                      + Add Rendering
                    </button>
                  </div>
                ) : null}

                {activeCanvasTab === "Structure" ? (
                  <div className="canvas-section">
                    <h3>Media</h3>
                    <input
                      className="canvas-input"
                      type="text"
                      placeholder="Painting annotation page id"
                      value={canvasTemplate.paintingAnnotationPageId}
                      onChange={(event) =>
                        updateTemplateField("paintingAnnotationPageId", event.target.value)
                      }
                    />

                    <h3>Annotations</h3>
                    <input
                      className="canvas-input"
                      type="text"
                      placeholder="Supplementary annotation page id"
                      value={canvasTemplate.annotationPageId}
                      onChange={(event) => updateTemplateField("annotationPageId", event.target.value)}
                    />
                    <div className="canvas-columns canvas-columns--two">
                      <input
                        className="canvas-input"
                        type="number"
                        min="0"
                        placeholder="Supplementary annotation count"
                        value={canvasTemplate.annotationCount}
                        onChange={(event) => updateTemplateField("annotationCount", event.target.value)}
                      />
                      <button type="button" className="canvas-secondary" onClick={createAnnotation}>
                        + Add painting media item
                      </button>
                    </div>
                  </div>
                ) : null}

                {activeCanvasTab === "Nav place" ? (
                  <div className="canvas-section">
                    <h3>Nav place</h3>
                    <label className="canvas-field__label" htmlFor="nav-label">
                      Place label
                    </label>
                    <input
                      id="nav-label"
                      className="canvas-input"
                      type="text"
                      value={canvasTemplate.navPlaceLabel}
                      onChange={(event) => updateTemplateField("navPlaceLabel", event.target.value)}
                    />

                    <div className="canvas-columns canvas-columns--two">
                      <div>
                        <label className="canvas-field__label" htmlFor="nav-latitude">
                          Latitude
                        </label>
                        <input
                          id="nav-latitude"
                          className="canvas-input"
                          type="number"
                          step="any"
                          value={canvasTemplate.navPlaceLatitude}
                          onChange={(event) => updateTemplateField("navPlaceLatitude", event.target.value)}
                        />
                      </div>

                      <div>
                        <label className="canvas-field__label" htmlFor="nav-longitude">
                          Longitude
                        </label>
                        <input
                          id="nav-longitude"
                          className="canvas-input"
                          type="number"
                          step="any"
                          value={canvasTemplate.navPlaceLongitude}
                          onChange={(event) => updateTemplateField("navPlaceLongitude", event.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="canvas-panel__actions">
                <button type="button" onClick={applyCanvasTemplate}>
                  Save Canvas
                </button>
                <button
                  type="button"
                  className="canvas-secondary"
                  onClick={() => setCanvasTemplate(createDefaultCanvasTemplate(activeCanvasIndex + 1))}
                >
                  Reset Canvas Values
                </button>
              </div>
            </section>

            <details className="manifest-json-preview">
              <summary>Preview JSON</summary>
              <pre>{JSON.stringify(manifestObj, null, 2)}</pre>
            </details>
          </section>
        ) : (
          <section className="home-panel">
            <h2>Home</h2>
            <p>Open Manifest Creator from the navigation to start building your IIIF manifest.</p>
          </section>
        )}
      </main>

      <footer className="app-footer">{"\u00A9"} manifest editor</footer>
    </div>
  );
}

export default App;
