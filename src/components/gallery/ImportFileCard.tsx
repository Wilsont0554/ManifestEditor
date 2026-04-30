import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import Icon from "@/components/icon";
import { importManifestFromFile } from "@/utils/import";

/**
 * Card component for importing a manifest from a local file
 * @returns card component to import a manifest from a local file
 */
export default function ImportFileCard() {
  const reRoute = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setisProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /**
   * Run the chosen file through importManifestFromFile and navigate to the
   * editor on success.
   * @param file the user-selected JSON manifest file
   */
  async function processFile(file: File) {
    setisProcessing(true);
    setErrorMsg(null);
    try {
      const { manifestId, manifestData } = await importManifestFromFile(file);
      reRoute(`/editor/${manifestId}`, {
        replace: true,
        state: { manifest: manifestData },
      });
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to upload manifest. Please upload a valid JSON file.";
      console.error("Failed to upload manifest:", err);
      setErrorMsg(msg);
    } finally {
      setisProcessing(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  /**
   * Open the native file picker by forwarding the click to the hidden input.
   * No-ops while a file is already being processed.
   */
  function handleClickArea() {
    if (isProcessing) return;
    inputRef.current?.click();
  }

  /**
   * Forward a file picked from the hidden input to processFile.
   * @param e change event from the hidden file input
   */
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void processFile(file);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClickArea}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClickArea();
        }
      }}
      className="group relative flex h-full cursor-pointer flex-col gap-4 overflow-hidden rounded-xl border border-slate-200 bg-white p-6 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-900 hover:shadow-[0_24px_60px_-30px_rgba(15,23,42,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
    >
      <input
        ref={inputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleChange}
        className="hidden"
      />

      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 transition-colors duration-300 group-hover:bg-slate-900">
        <Icon
          name="cloud-upload"
          className="h-5 w-5 text-slate-700 transition-colors duration-300 group-hover:text-white"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-black tracking-tight text-slate-950">
          Upload a file
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">
          Click to browse a manifest JSON file from your device.
        </p>
      </div>

      <span className="mt-auto inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700 transition-colors duration-300 group-hover:text-slate-950">
        {isProcessing ? (
          <>
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
            Loading
          </>
        ) : (
          <>
            Choose file
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </>
        )}
      </span>

      {errorMsg && (
        <p className="text-xs text-rose-600">{errorMsg}</p>
      )}
    </div>
  );
}
