import InputWithLanguage from "@components/shared/inputWithLanguage";
import { type ChangeEvent, useEffect, useRef, useState } from "react";

function DescriptiveTab() {
  const [labelLanguageCode, setLabelLanguageCode] = useState("en");
  const [labelValue, setLabelValue] = useState("Blank Manifest");
  const [summaryLanguageCode, setSummaryLanguageCode] = useState("en");
  const [summaryValue, setSummaryValue] = useState("");
  const [rightsValue, setRightsValue] = useState("");
  const [navDate, setNavDate] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!thumbnailFile) {
      setThumbnailPreviewUrl(null);
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(thumbnailFile);
    setThumbnailPreviewUrl(nextPreviewUrl);

    return () => {
      URL.revokeObjectURL(nextPreviewUrl);
    };
  }, [thumbnailFile]);

  function handleThumbnailChange(event: ChangeEvent<HTMLInputElement>): void {
    const nextFile = event.target.files?.[0] ?? null;
    setThumbnailFile(nextFile);
  }

  return (
    <div className="min-h-40 space-y-8">
      <InputWithLanguage
        label="Label"
        languageCode={labelLanguageCode}
        value={labelValue}
        onChange={setLabelValue}
        onLanguageChange={setLabelLanguageCode}
      />

      <InputWithLanguage
        label="Summary"
        languageCode={summaryLanguageCode}
        value={summaryValue}
        onChange={setSummaryValue}
        onLanguageChange={setSummaryLanguageCode}
        rows={3}
        textareaClassName="min-h-28"
      />

      <section className="space-y-3">
        <label className="block text-md font-bold text-slate-950">
          Thumbnail
        </label>
        <div className="overflow-hidden rounded-md border border-slate-200 bg-slate-50">
          {thumbnailPreviewUrl ? (
            <img
              src={thumbnailPreviewUrl}
              alt="Manifest thumbnail preview"
              className="h-48 w-full object-cover"
            />
          ) : (
            <div className="flex h-32 items-center justify-center text-2xl font-medium text-slate-400">
              No thumbnail
            </div>
          )}
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md bg-rose-50 px-4 py-2 text-xl font-medium text-rose-600 transition hover:bg-rose-100"
          onClick={() => fileInputRef.current?.click()}
        >
          <span className="text-2xl leading-none">+</span>
          <span className="text-base">Add Thumbnail</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleThumbnailChange}
        />
      </section>

      <section className="space-y-2">
        <label
          htmlFor="manifest-rights"
          className="block text-md font-bold text-slate-950"
        >
          Rights
        </label>
        <input
          id="manifest-rights"
          type="text"
          value={rightsValue}
          onChange={(event) => setRightsValue(event.target.value)}
          className="w-full border-b border-slate-300 bg-slate-100 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-pink-500 focus:outline-none"
        />
      </section>

      <section className="space-y-2">
        <label
          htmlFor="manifest-nav-date"
          className="block text-md font-bold text-slate-950"
        >
          Nav Date
        </label>
        <input
          id="manifest-nav-date"
          type="datetime-local"
          value={navDate}
          onChange={(event) => setNavDate(event.target.value)}
          className="w-full border border-slate-400 bg-white px-3 py-2 text-base text-slate-900 focus:border-pink-500 focus:outline-none"
        />
      </section>

      <section className="space-y-3">
        <label className="block text-md font-bold text-slate-950">
          Required statement
        </label>
        <div className="rounded-md bg-slate-200 px-6 py-8">
          <div className="flex min-h-36 flex-col items-center justify-center gap-6 text-center">
            <p className="text-2xl font-medium text-slate-950">
              No required statement
            </p>
            <button
              type="button"
              className="rounded-md bg-white px-6 py-3 text-xl font-medium text-rose-600 transition hover:bg-rose-50"
            >
              Add new
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <label className="block text-md font-bold text-slate-950">
          Provider
        </label>
        <div className="rounded-md border border-slate-200 bg-slate-50 px-6 py-5">
          <p className="max-w-3xl text-2xl leading-relaxed text-slate-400">
            Add a provider to attach your institution name and logo to this
            Manifest.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md bg-rose-50 px-4 py-2 text-xl font-medium text-rose-600 transition hover:bg-rose-100"
        >
          <span className="text-2xl leading-none">+</span>
          <span className="text-base">Add Provider</span>
        </button>
      </section>
    </div>
  );
}

export default DescriptiveTab;
