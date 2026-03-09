import { useState } from "react";
import { MANIFEST_TABS } from "./manifest-inspector-constants.js";
import DescriptiveTab from "./tabs/descriptive-tab.jsx";
import LinkingTab from "./tabs/linking-tab.jsx";
import MetadataTab from "./tabs/metadata-tab.jsx";
import NavPlaceTab from "./tabs/nav-place-tab.jsx";
import OverviewTab from "./tabs/overview-tab.jsx";
import StructureTab from "./tabs/structure-tab.jsx";
import TechnicalTab from "./tabs/technical-tab.jsx";

function ManifestInspector({ manifestObj, setCount }) {
  const [activeTab, setActiveTab] = useState("overview");

  let tabContent = <OverviewTab manifestObj={manifestObj} />;

  if (activeTab === "descriptive") {
    tabContent = <DescriptiveTab manifestObj={manifestObj} setCount={setCount} />;
  }

  if (activeTab === "metadata") {
    tabContent = <MetadataTab manifestObj={manifestObj} setCount={setCount} />;
  }

  if (activeTab === "technical") {
    tabContent = <TechnicalTab manifestObj={manifestObj} setCount={setCount} />;
  }

  if (activeTab === "linking") {
    tabContent = <LinkingTab manifestObj={manifestObj} setCount={setCount} />;
  }

  if (activeTab === "structure") {
    tabContent = <StructureTab manifestObj={manifestObj} />;
  }

  if (activeTab === "nav-place") {
    tabContent = <NavPlaceTab manifestObj={manifestObj} setCount={setCount} />;
  }

  return (
    <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:sticky xl:top-6">
      <div className="border-b border-slate-200 px-5 py-4">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Manifest</p>
      </div>

      <div className="overflow-x-auto border-b border-slate-200">
        <div className="flex min-w-max gap-1 px-3 py-2">
          {MANIFEST_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={
                activeTab === tab.id
                  ? "rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white"
                  : "rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              }
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[70vh] overflow-y-auto px-5 py-5">{tabContent}</div>
    </aside>
  );
}

export default ManifestInspector;
