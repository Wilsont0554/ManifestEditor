import React from "react";

function ContentResourceMetadataElement(props) {
    const { manifestObj, contentResourceIndex, setcount, count, setIsEditingMetadata } = props;

    // Grab the specific resource from the class instance
    const resource = manifestObj
        .getContainerObj()
        .getAnnotationPage()
        .getAnnotation(0)
        .getContentResource(contentResourceIndex);

    if (!resource) return <p>No resource found.</p>;

    const metadata = resource.getMetadata();
    const metadataEntries = metadata.getAllEntries();

    const handleAddMetadataEntry = () => {
        metadata.addEntry('', '', 'en');
        setcount(count + 1);
    };

    const handleUpdateMetadata = (index, field, value) => {
        const entry = metadata.getEntry(index);
        if (entry) {
            if (field === 'label') {
                entry.setLabel(value);
            } else if (field === 'value') {
                entry.setValue(value);
            } else if (field === 'language') {
                // For language changes, we need to update both label and value
                entry.setLabel(entry.getLabelText(), value);
                entry.setValue(entry.getValueText(), value);
            }
            setcount(count + 1);
        }
    };

    const handleRemoveMetadata = (index) => {
        metadata.removeEntry(index);
        setcount(count + 1);
    };

    return (
        <div className="sidebar-editor-container">
            <h4>Metadata for Content Resource</h4>

            {metadataEntries.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '20px' }}>
                    No metadata entries yet. Click "Add Metadata Entry" to create your first entry.
                </p>
            ) : (
                <div style={{ marginBottom: '20px' }}>
                    {metadataEntries.map((entry, index) => (
                        <div key={index} className="metadata-entry" style={{
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            padding: '12px',
                            marginBottom: '12px',
                            backgroundColor: '#f9f9f9'
                        }}>
                            <div className="field-group" style={{ marginBottom: '8px' }}>
                                <label style={{ fontSize: '0.9em', fontWeight: 'bold', color: '#333' }}>
                                    Label:
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Title, Creator, Description"
                                    value={entry.getLabelText() || ""}
                                    onChange={(e) => handleUpdateMetadata(index, 'label', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '6px 8px',
                                        border: '1px solid #ccc',
                                        borderRadius: '3px',
                                        fontSize: '0.9em'
                                    }}
                                />
                            </div>

                            <div className="field-group" style={{ marginBottom: '8px' }}>
                                <label style={{ fontSize: '0.9em', fontWeight: 'bold', color: '#333' }}>
                                    Value:
                                </label>
                                <textarea
                                    placeholder="Enter the metadata value"
                                    value={entry.getValueText() || ""}
                                    onChange={(e) => handleUpdateMetadata(index, 'value', e.target.value)}
                                    rows="2"
                                    style={{
                                        width: '100%',
                                        padding: '6px 8px',
                                        border: '1px solid #ccc',
                                        borderRadius: '3px',
                                        fontSize: '0.9em',
                                        resize: 'vertical',
                                        fontFamily: 'inherit'
                                    }}
                                />
                            </div>

                            <div className="field-group" style={{ marginBottom: '8px' }}>
                                <label style={{ fontSize: '0.9em', fontWeight: 'bold', color: '#333' }}>
                                    Language:
                                </label>
                                <select
                                    value={entry.label.getLanguage() || 'en'}
                                    onChange={(e) => handleUpdateMetadata(index, 'language', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '6px 8px',
                                        border: '1px solid #ccc',
                                        borderRadius: '3px',
                                        fontSize: '0.9em'
                                    }}
                                >
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                    <option value="it">Italian</option>
                                    <option value="pt">Portuguese</option>
                                    <option value="ja">Japanese</option>
                                    <option value="zh">Chinese</option>
                                    <option value="ru">Russian</option>
                                    <option value="ar">Arabic</option>
                                    <option value="hi">Hindi</option>
                                </select>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleRemoveMetadata(index)}
                                style={{
                                    padding: '4px 8px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    fontSize: '0.8em'
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <button
                type="button"
                onClick={handleAddMetadataEntry}
                style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9em',
                    fontWeight: 'bold'
                }}
            >
                + Add Metadata Entry
            </button>

            <button
                type="button"
                onClick={() => setIsEditingMetadata(false)}
                style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9em',
                    fontWeight: 'bold',
                    marginTop: '10px'
                }}
            >
                ← Back to Content Resource
            </button>
        </div>
    );
}

export default ContentResourceMetadataElement;