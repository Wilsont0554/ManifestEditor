import Navbar from "./components/navbar";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "@/pages/home";
import ManifestEditorPage from "@/pages/manifest-editor";

const HOME_ROUTE = "/ManifestEditor/manifest-editor/home";
const EDITOR_ROUTE = "/ManifestEditor/manifest-editor/editor";

export default function App() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100 text-slate-900">
      <Navbar />
      <main className="flex min-h-0 w-full flex-1 overflow-hidden">
        <Routes>
          <Route path="/ManifestEditor/" element={<Navigate to={HOME_ROUTE} replace />} />
          <Route path="/ManifestEditor/manifest-editor" element={<Navigate to={HOME_ROUTE} replace />} />
          <Route path={HOME_ROUTE} element={<HomePage />} />
          <Route path={EDITOR_ROUTE} element={<ManifestEditorPage />} />
          <Route path="*" element={<Navigate to={HOME_ROUTE} replace />} />
        </Routes>
      </main>
      <footer className="shrink-0 border-t border-slate-300 bg-slate-50 py-3 text-center text-sm text-slate-600">
        {"\u00A9"} manifest editor
      </footer>
    </div>
  );
}

