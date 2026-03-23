import { useState } from "react";
import type { MetadataElementProps } from "./types.ts";

function MetadataElement({
  manifestObj,
  metadataIndex,
  count,
  setcount,
}: MetadataElementProps) {
  const metadata = manifestObj.getMetadata();
  const entry = metadata.getEntry(metadataIndex);
  const [labelText, setLabelText] = useState(entry?.getLabelText() ?? "");
  const [valueText, setValueText] = useState(entry?.getValueText() ?? "");

  return (
    <li>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <input
          placeholder="Metadata Label (e.g., Creator)"
          type="text"
          value={labelText}
          onChange={(event) => {
            const nextLabel = event.target.value;
            setLabelText(nextLabel);
            metadata.updateEntry(metadataIndex, nextLabel, valueText, "en");
            setcount(count + 1);
          }}
          style={{ padding: "5px", minWidth: "200px" }}
        />
        <input
          placeholder="Metadata Value (e.g., Anne Artist (1776-1824))"
          type="text"
          value={valueText}
          onChange={(event) => {
            const nextValue = event.target.value;
            setValueText(nextValue);
            metadata.updateEntry(metadataIndex, labelText, nextValue, "en");
            setcount(count + 1);
          }}
          style={{ padding: "5px", minWidth: "300px", flex: 1 }}
        />
        <button
          type="button"
          onClick={() => {
            metadata.removeEntry(metadataIndex);
            setcount(count + 1);
          }}
          style={{
            padding: "5px 10px",
            backgroundColor: "#ff4444",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Remove
        </button>
      </div>
    </li>
  );
}

export default MetadataElement;
