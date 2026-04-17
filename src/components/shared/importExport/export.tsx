function ExportMenu({setIsExportModalOpen, handleDownloadManifest,
    githubToken, setGithubToken, setShowTokenWarning,gistBaseName, setGistBaseName, 
    handleCreateGist, isCreatingGist, isAutoUpdateEnabled, handleClearToken,gistId, 
    gistRawUrl, setIsAutoUpdateEnabled, gistUrl} : any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-lg max-w-sm w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Export Manifest
                </h2>
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  className="text-slate-500 hover:text-slate-700 text-2xl leading-none"
                  title="Close"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <button
                  className="w-full cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
                  type="button"
                  onClick={handleDownloadManifest}
                  title="Download manifest as JSON"
                >
                  Download JSON
                </button>

                <div className="border-t border-slate-200 pt-4">
                  <p className="text-xs font-medium text-slate-700 mb-2">
                    Export to GitHub Gist
                  </p>

                <div>
                  <label htmlFor="export-token" className="block text-xs font-medium text-slate-700 mb-2">
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
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:shadow-[0_0_0_3px_rgba(148,163,184,0.25)]"
                    title="Your GitHub personal access token (not saved permanently)"
                  />
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-rose-600 underline hover:text-rose-800 mt-1 inline-block"
                    title="Open GitHub token settings page"
                  >
                    Get Token
                  </a>
                </div>

                <div>
                  <label htmlFor="export-filename" className="block text-xs font-medium text-slate-700 mb-2">
                    Filename
                  </label>
                  <div className="flex">
                    <input
                      id="export-filename"
                      type="text"
                      placeholder="manifest"
                      value={gistBaseName}
                      onChange={(e) => setGistBaseName(e.target.value)}
                      className="flex-1 rounded-l-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:shadow-[0_0_0_3px_rgba(148,163,184,0.25)]"
                      title="Name of the file in the gist"
                    />
                    <span className="inline-flex items-center rounded-r-md border border-l-0 border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                      .json
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    className="flex-1 cursor-pointer rounded-md bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                    onClick={handleCreateGist}
                    disabled={!githubToken || isCreatingGist || isAutoUpdateEnabled}
                    title="Create and share manifest as a GitHub gist"
                  >
                    {isCreatingGist ? "Creating..." : "Create Gist"}
                  </button>
                  {githubToken && (
                    <button
                      className="cursor-pointer rounded-md bg-slate-600 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                      type="button"
                      onClick={handleClearToken}
                      title="Clear stored token from browser"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {gistId && (
                  <div className="flex items-center gap-2">
                    <input
                      id="auto-update"
                      type="checkbox"
                      checked={isAutoUpdateEnabled}
                      onChange={(e) => setIsAutoUpdateEnabled(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                    />
                    <label htmlFor="auto-update" className="text-sm text-slate-700">
                      Auto-update every 30 seconds and when Export is clicked again
                    </label>
                  </div>
                )}

                {gistRawUrl && (
                  <div className="border-t border-slate-200 pt-4 space-y-3">
                    <div>
                      <a
                        href={gistUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full block text-center rounded-md bg-slate-600 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        title="View gist on GitHub"
                      >
                        View Gist
                      </a>
                      <p className="text-xs text-slate-500 mt-1 break-all">{gistUrl}</p>
                    </div>
                    <div>
                      <a
                        href={gistRawUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full block text-center rounded-md bg-slate-600 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        title="View raw manifest JSON"
                      >
                        View RAW
                      </a>
                      <p className="text-xs text-slate-500 mt-1 break-all">{gistRawUrl}</p>
                    </div>
                    <div>
                      <a
                        href={`https://smithsonian.github.io/voyager-dev/iiif/iiif_demo?document=${encodeURIComponent(gistRawUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full block text-center rounded-md bg-slate-600 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        title="View manifest in Voyager"
                      >
                        View in Voyager
                      </a>
                      <p className="text-xs text-slate-500 mt-1 break-all">{`https://smithsonian.github.io/voyager-dev/iiif/iiif_demo?document=${encodeURIComponent(gistRawUrl)}`}</p>
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
  );
} export default ExportMenu