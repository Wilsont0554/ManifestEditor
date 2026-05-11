function ImportMenu({setImportExportType, handleUploadManifest, gistImportUrl,
  setGistImportUrl, handleUploadManifestFromGist, isImportingGist}) {

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 px-4 py-6 backdrop-blur-md"
      onMouseDown={() => setImportExportType("none")}
    >
      <div
        className="w-full max-w-xl rounded-[24px] border border-white/70 bg-white/95 p-6 shadow-[0_28px_80px_rgba(15,23,42,0.28)] ring-1 ring-slate-900/5 backdrop-blur-xl sm:p-8"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-950">
            Import Manifest
          </h2>
          <button
            type="button"
            onClick={() => setImportExportType("none")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-2xl leading-none text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
            title="Close"
            aria-label="Close import dialog"
          >
            &times;
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-800">
              Upload Manifest File
            </p>
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 shadow-inner">
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleUploadManifest}
                className="w-full text-sm text-slate-700 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-800 file:shadow-sm hover:file:bg-slate-100"
              />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-5">
            <label
              htmlFor="gist-import-url"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Import from GitHub Gist
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <input
                id="gist-import-url"
                type="text"
                placeholder="Paste gist URL or gist ID"
                value={gistImportUrl}
                onChange={(event) => setGistImportUrl(event.target.value)}
                className="min-w-65 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-300 focus:shadow-[0_0_0_3px_rgba(251,113,133,0.18)]"
              />
              <button
                type="button"
                className="cursor-pointer rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-950 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
                onClick={() => void handleUploadManifestFromGist()}
                disabled={isImportingGist || !gistImportUrl.trim()}
              >
                {isImportingGist ? "Importing..." : "Import Gist"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} export default ImportMenu
