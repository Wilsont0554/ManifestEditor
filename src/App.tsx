import Navbar from "./components/navbar";
import {Routes, Route} from "react-router";
import HomePage from "@/pages/home";
import ManifestEditorPage from "@/pages/manifest-editor";
import { useVault } from "react-iiif-vault";
import { useEffect } from "react";
import ManifestObject from "@/ManifestClasses/ManifestObject";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      <Navbar />
      <main className="w-full h-full flex-1">
        <Routes>
          <Route path="/manifest-editor/home" element={<HomePage />} />
          <Route path="/manifest-editor/editor" element={<ManifestEditorPage />} />
        </Routes>
      </main>
      <footer className="border-t border-slate-300 bg-slate-50 py-3 text-center text-sm text-slate-600">
        {"\u00A9"} manifest editor
      </footer>
    </div>
  );
}

