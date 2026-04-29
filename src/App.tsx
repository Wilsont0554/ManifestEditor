import Navbar from "./components/navbar";
import { Route, Routes } from "react-router";
import HomePage from "@/pages/home";
import ManifestEditorPage from "@/pages/manifest-editor";
import NotFound from "@/pages/404";
import GalleryPage from "@/pages/gallery";

export default function App() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100 text-slate-900">
      <Navbar />
      <main className="flex min-h-0 w-full flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={ <HomePage /> } />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="editor/:id" element={<ManifestEditorPage/>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </main>
      <footer className="shrink-0 border-t border-slate-300 bg-slate-50 py-3 text-center text-sm text-slate-600">
        {"\u00A9"} manifest editor
      </footer>
    </div>
  );
}

