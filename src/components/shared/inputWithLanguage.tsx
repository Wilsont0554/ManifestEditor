import { useState } from "react";

interface InputWithLanguageProps {
  label: string;
  languageCode: string;
  value: string;
  onChange: (newValue: string) => void;
  onLanguageChange: (newLanguageCode: string) => void;
}

export default function InputWithLanguage({
  languageCode,
  value,
  onChange,
  onLanguageChange,
  label
}: InputWithLanguageProps) {
  const [isLanguageSelecting, setLanguageSelecting] = useState(false);
  
  return (
    <section className="flex flex-col w-full">
      <label className="block text-md font-bold mb-2">
        {label}
      </label>
      <div
        className={`
          w-full overflow-hidden transition-all duration-300 ease-in-out
          ${isLanguageSelecting ? "max-h-20 opacity-100 mb-2" : "max-h-0 opacity-0 mb-0"}
        `}
      >
        <select
          className="w-full focus:outline-none bg-white border rounded p-2"
          value={languageCode}
          onChange={(e) => onLanguageChange(e.target.value)}
        >
          <option value="en">English</option>
          <option value="sp">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
          <option value="none">None</option>
        </select>
      </div>

      <div className="w-full bg-gray-100 p-2 pr-0 gap-2 flex border-b-2 border-pink-500">
        <input
          className="flex-1 focus:outline-none bg-transparent"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        <button
          onClick={() => setLanguageSelecting(!isLanguageSelecting)}
          className="bg-gray-200 rounded-sm px-2 py-1 text-sm"
          type="button"
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
            languageCode
          )}
        </button>
      </div>
    </section>
  );
}