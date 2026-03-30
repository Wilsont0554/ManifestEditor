import { useState } from "react";
import { supportedLanguageCodes } from "@/types/iiif";
import ManifestField from "@/components/editors/manifest/shared/manifest-field";

interface InputWithLanguageProps {
  label: string;
  languageCode: string;
  value: string;
  onChange: (newValue: string) => void;
  onLanguageChange: (newLanguageCode: string) => void;
  placeholder?: string;
  rows?: number;
  appearance?: "underline" | "outline";
  textareaClassName?: string;
}

export default function InputWithLanguage({
  languageCode,
  value,
  onChange,
  onLanguageChange,
  label,
  placeholder = "",
  rows = 1,
  appearance = "underline",
  textareaClassName = "",
}: InputWithLanguageProps) {
  const [isLanguageSelecting, setLanguageSelecting] = useState(false);
  const languageLabels: Record<string, string> = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    ru: "Russian",
    zh: "Chinese",
    ja: "Japanese",
    pt: "Portuguese",
    ar: "Arabic",
    hi: "Hindi",
    sv: "Swedish",
    nl: "Dutch",
    ko: "Korean",
    tr: "Turkish",
    vi: "Vietnamese",
  };
  const fieldSurfaceClassName =
    appearance === "outline"
      ? "rounded-xl border border-slate-300 bg-white shadow-sm"
      : "border-b-2 border-pink-500 bg-slate-100";
  const languageButtonClassName =
    appearance === "outline"
      ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
      : "bg-slate-200 text-slate-500 hover:bg-slate-300";
  
  return (
    <ManifestField label={label} className="flex w-full flex-col gap-2">
      <div
        className={`
          w-full overflow-hidden transition-all duration-300 ease-in-out
          ${isLanguageSelecting ? "mb-2 max-h-20 opacity-100" : "mb-0 max-h-0 opacity-0"}
        `}
      >
        <select
          className="w-full rounded border border-slate-200 bg-white p-2 text-sm text-slate-700 focus:border-pink-400 focus:outline-none"
          value={languageCode}
          onChange={(e) => onLanguageChange(e.target.value)}
        >
          {supportedLanguageCodes.map((code) => (
            <option key={code} value={code}>
              {languageLabels[code]}
            </option>
          ))}
        </select>
      </div>

      <div className={`relative w-full overflow-hidden ${fieldSurfaceClassName}`}>
        <textarea
          className={`w-full resize-none bg-transparent px-4 py-3 pr-16 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none ${textareaClassName}`}
          value={value}
          rows={rows}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />

        <button
          onClick={() => setLanguageSelecting(!isLanguageSelecting)}
          className={`absolute right-2 top-2 rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition ${languageButtonClassName}`}
          type="button"
          aria-label={`Select language for ${label}`}
        >
          {languageCode.toUpperCase()}
        </button>
      </div>
    </ManifestField>
  );
}
