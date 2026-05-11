function ExportMenu({setImportExportType, handleDownloadManifest,
    githubToken, setGithubToken, setShowTokenWarning,gistBaseName, setGistBaseName,
    handleCreateGist, isCreatingGist, isAutoUpdateEnabled, handleClearToken,gistId,
    gistRawUrl, setIsAutoUpdateEnabled, gistUrl}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 px-4 py-6 backdrop-blur-md"
      onMouseDown={() => setImportExportType("none")}
    >
      <div
        className="max-h-[calc(100vh-3rem)] w-full max-w-xl overflow-y-auto rounded-[24px] border border-white/70 bg-white/95 p-6 shadow-[0_28px_80px_rgba(15,23,42,0.28)] ring-1 ring-slate-900/5 backdrop-blur-xl sm:p-8"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-950">
            Export Manifest
          </h2>
          <button
            type="button"
            onClick={() => setImportExportType("none")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-2xl leading-none text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
            title="Close"
            aria-label="Close export dialog"
          >
            &times;
          </button>
        </div>

        <div className="space-y-5">
          <button
            className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
            type="button"
            onClick={handleDownloadManifest}
            title="Download manifest as JSON"
          >
            Download JSON
          </button>

          <div className="border-t border-slate-200 pt-5">
            <p className="mb-3 text-sm font-semibold text-slate-800">
              Export to GitHub Gist
            </p>

            <div>
              <label htmlFor="export-token" className="mb-2 block text-sm font-semibold text-slate-800">
                GitHub Token
              </label>
              <input
                id="export-token"
                type="password"
                placeholder="Enter your GitHub token"
                value={githubToken}
                onChange={(e) => {
                  setGithubToken(e.target.value);
                  localStorage.setItem("githubToken", e.target.value);
                  setShowTokenWarning(false);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-300 focus:shadow-[0_0_0_3px_rgba(251,113,133,0.18)]"
                title="Your GitHub personal access token (not saved permanently)"
              />
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs font-medium text-rose-600 underline hover:text-rose-800"
                title="Open GitHub token settings page"
              >
                Get Token
              </a>
            </div>

            <div className="mt-4">
              <label htmlFor="export-filename" className="mb-2 block text-sm font-semibold text-slate-800">
                Filename
              </label>
              <div className="flex">
                <input
                  id="export-filename"
                  type="text"
                  placeholder="manifest"
                  value={gistBaseName}
                  onChange={(e) => setGistBaseName(e.target.value)}
                  className="min-w-0 flex-1 rounded-l-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-300 focus:shadow-[0_0_0_3px_rgba(251,113,133,0.18)]"
                  title="Name of the file in the gist"
                />
                <span className="inline-flex items-center rounded-r-xl border border-l-0 border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500">
                  .json
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                className="min-w-40 flex-1 cursor-pointer rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300 disabled:shadow-none"
                type="button"
                onClick={handleCreateGist}
                disabled={!githubToken || isCreatingGist || isAutoUpdateEnabled}
                title="Create and share manifest as a GitHub gist"
              >
                {isCreatingGist ? "Creating..." : "Create Gist"}
              </button>
              {githubToken && (
                <button
                  className="cursor-pointer rounded-xl bg-slate-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                  type="button"
                  onClick={handleClearToken}
                  title="Clear stored token from browser"
                >
                  Clear
                </button>
              )}
            </div>

            {gistId && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                <input
                  id="auto-update"
                  type="checkbox"
                  checked={isAutoUpdateEnabled}
                  onChange={(e) => setIsAutoUpdateEnabled(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="auto-update" className="text-sm leading-5 text-slate-700">
                  Auto-update every 30 seconds and when Export is clicked again
                </label>
              </div>
            )}

            {gistRawUrl && (
              <div className="mt-5 space-y-3 border-t border-slate-200 pt-5">
                <div>
                  <a
                    href={gistUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full rounded-xl bg-slate-700 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                    title="View gist on GitHub"
                  >
                    View Gist
                  </a>
                  <p className="mt-1 break-all text-xs text-slate-500">{gistUrl}</p>
                </div>
                <div>
                  <a
                    href={gistRawUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full rounded-xl bg-slate-700 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                    title="View raw manifest JSON"
                  >
                    View RAW
                  </a>
                  <p className="mt-1 break-all text-xs text-slate-500">{gistRawUrl}</p>
                </div>
                <div>
                  <a
                    href={`https://smithsonian.github.io/voyager-dev/iiif/iiif_demo?document=${encodeURIComponent(gistRawUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full rounded-xl bg-slate-700 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                    title="View manifest in Voyager"
                  >
                    View in Voyager
                  </a>
                  <p className="mt-1 break-all text-xs text-slate-500">{`https://smithsonian.github.io/voyager-dev/iiif/iiif_demo?document=${encodeURIComponent(gistRawUrl)}`}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} export default ExportMenu
