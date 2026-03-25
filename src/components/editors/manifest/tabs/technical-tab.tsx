import ManifestTabBody from "../shared/manifest-tab-body";
import ManifestInput from "../shared/manifest-input";
import { useState } from "react";
import { manifestObjContext } from "@/context/manifest";
import { useContext } from "react";
import ManifestField from "../shared/manifest-field";
import SoftActionButton from "../shared/soft-action-button";
import DataSelection from "@/components/shared/dataSelection";
import DropDownField from "@/components/shared/dropdownField";

const VIEWINGDIRECTIONS = [
  "Left to Right",
  "Right to Left",
  "Top to Bottom",
  "Bottom to Top",
];

const MANIFESTORDERING = [
  "None",
  "Unordered",
  "Individuals",
  "Continuous",
  "Paged",
];

const REPEAT = ["none", "repeat", "no-repeat"];

const AUTOADVANCE = ["none", "auto-advance", "no-auto-advance"];

function TechnicalTab() {
  const { manifestObj } = useContext(manifestObjContext);
  const [identifier] = useState(manifestObj.id);
  const [viewingDirection, setViewingDirection] = useState("Left to Right");
  const [manifestOrdering, setManifestOrdering] = useState("None");
  const [repeat, setRepeat] = useState("none");
  const [autoAdvance, setAutoAdvance] = useState("none");

  const handleManifestOrderingSelect = (value: string | number) => {
    setManifestOrdering(value as string);
  };

  const handleViewingDirectionSelect = (value: string | number) => {
    setViewingDirection(value as string);
  };

  const handleRepeatSelect = (value: string | number) => {
    setRepeat(value as string);
  };

  const handleAutoAdvanceSelect = (value: string | number) => {
    setAutoAdvance(value as string);
  };

  return (
    <ManifestTabBody>
      <ManifestInput
        label="Identifier"
        value={identifier}
        inputClassName="cursor-not-allowed"
        onChange={() => {}}
        disabled
      />
      <ManifestField label="Viewing Direction">
        <DataSelection
          label="Viewing Direction"
          data={VIEWINGDIRECTIONS}
          selected={viewingDirection}
          onSelect={handleViewingDirectionSelect}
        />
      </ManifestField>
      <ManifestField label="Built-in behaviors" labelClassName="mb-3">
        <hr className="my-2 border-t border-slate-300" />
        <DropDownField label="MANIFEST ORDERING">
          <DataSelection
            label="Manifest Ordering"
            data={MANIFESTORDERING}
            selected={manifestOrdering}
            onSelect={handleManifestOrderingSelect}
          />
        </DropDownField>
        <hr className="my-2 border-t border-slate-300" />
        <DropDownField label="REPEAT">
          <DataSelection
            label="Repeat"
            data={REPEAT}
            selected={repeat}
            onSelect={handleRepeatSelect}
            isHorizontal={true}
          />
        </DropDownField>
        <hr className="my-2 border-t border-slate-300" />
        <DropDownField label="AUTO-ADVANCE">
          <DataSelection
            label="Auto Advance"
            data={AUTOADVANCE}
            selected={autoAdvance}
            onSelect={handleAutoAdvanceSelect}
            isHorizontal={true}
          />
        </DropDownField>
        <hr className="my-2 border-t border-slate-300" />
        <ManifestField label="Behaviors">
          <SoftActionButton onClick={() => {}} className="px-4 py-2 my-3">
            + Add custom behavior
          </SoftActionButton>
        </ManifestField>
      </ManifestField>
    </ManifestTabBody>
  );
}

export default TechnicalTab;
