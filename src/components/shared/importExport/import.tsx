
function ImportMenu({setImportExportType, handleUploadManifest, gistImportUrl, 
  setGistImportUrl, handleUploadManifestFromGist, isImportingGist}) {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-lg max-w-md w-full mx-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Import Manifest
                </h2>
                <button
                  type="button"
                  onClick={() => setImportExportType("none")}
                  className="text-2xl leading-none text-slate-500 hover:text-slate-700"
                  title="Close"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-xs font-medium text-slate-700">
                    Upload Manifest File
                  </p>
                  <div className="rounded-md border border-slate-300 bg-white px-3 py-2">
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={handleUploadManifest}
                      className="w-full text-sm text-slate-700"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <label
                    htmlFor="gist-import-url"
                    className="mb-2 block text-xs font-medium text-slate-700"
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
                      className="min-w-65 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:shadow-[0_0_0_3px_rgba(148,163,184,0.25)]"
                    />
                    <button
                      type="button"
                      className="cursor-pointer rounded-md bg-slate-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
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