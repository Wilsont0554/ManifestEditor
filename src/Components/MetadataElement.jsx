import React, { useState } from "react";

function MetadataElement(props) {
    const [labelText, setLabelText] = useState('');
    const [valueText, setValueText] = useState('');

    const metadata = props.manifestObj.getMetadata();
    const entry = metadata.getEntry(props.metadataIndex);

    return (
        <>
            <li>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                        placeholder="Metadata Label (e.g., Creator)"
                        type="text"
                        value={labelText}
                        onChange={e => {
                            setLabelText(e.target.value);
                            metadata.updateEntry(
                                props.metadataIndex,
                                e.target.value,
                                valueText,
                                'en'
                            );
                            props.setcount(props.count + 1);
                        }}
                        style={{ padding: '5px', minWidth: '200px' }}
                    />
                    <input
                        placeholder="Metadata Value (e.g., Anne Artist (1776-1824))"
                        type="text"
                        value={valueText}
                        onChange={e => {
                            setValueText(e.target.value);
                            metadata.updateEntry(
                                props.metadataIndex,
                                labelText,
                                e.target.value,
                                'en'
                            );
                            props.setcount(props.count + 1);
                        }}
                        style={{ padding: '5px', minWidth: '300px', flex: 1 }}
                    />
                    <button
                        type="button"
                        onClick={() => {
                            metadata.removeEntry(props.metadataIndex);
                            props.setcount(props.count + 1);
                        }}
                        style={{ padding: '5px 10px', backgroundColor: '#ff4444', color: 'white', border: 'none', cursor: 'pointer' }}
                    >
                        Remove
                    </button>
                </div>
            </li>
        </>
    );
}

export default MetadataElement;
