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
    jp: "Japanese",
    pt: "Portuguese",
    ar: "Arabic",
    hi: "Hindi",
    sv: "Swedish",
    nl: "Dutch",
    ko: "Korean",
    tr: "Turkish",
    vi: "Vietnamese",
    none: "None",
  };
  
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
          <option value="none">None</option>
        </select>
      </div>

      <div className="relative w-full border-b-2 border-pink-500 bg-slate-100">
        <textarea
          className={`w-full resize-none bg-transparent px-4 py-3 pr-16 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none ${textareaClassName}`}
          value={value}
          rows={rows}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />

        <button
          onClick={() => setLanguageSelecting(!isLanguageSelecting)}
          className="absolute right-2 top-2 rounded-sm bg-slate-200 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:bg-slate-300"
          type="button"
          aria-label={`Select language for ${label}`}
        >
          {languageCode === "none" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M5 17v2h14v-2H5zm4.5-4.2h5l.9 2.2h2.1L12.75 4h-1.5L6.5 15h2.1l.9-2.2zM12 5.98 13.87 11h-3.74L12 5.98z" />
            </svg>
          ) : (
            languageCode.toUpperCase()
          )}
        </button>
      </div>
    </ManifestField>
  );
}
