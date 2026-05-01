import type { ReactNode } from 'react';

export default function Icon({
  name,
  className = "h-6 w-6",
}: {
  name: string;
  className?: string;
}) {
  const commonProps = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  const paths: Record<string, ReactNode> = {
    "file-text": (
      <>
        <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
        <path d="M14 2v5h5" />
        <path d="M9 13h6" />
        <path d="M9 17h6" />
        <path d="M9 9h1" />
      </>
    ),
    file: (
      <>
        <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
        <path d="M14 2v5h5" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    message: (
      <>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        <path d="M8 9h8" />
        <path d="M8 13h5" />
      </>
    ),
    cube: (
      <>
        <path d="m12 2 8 4.5v9L12 20l-8-4.5v-9z" />
        <path d="M12 11 4 6.5" />
        <path d="m12 11 8-4.5" />
        <path d="M12 11v9" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    "cloud-upload": (
      <>
        <path d="M16 16 12 12l-4 4" />
        <path d="M12 12v9" />
        <path d="M20.4 18.6A5 5 0 0 0 18 9h-1.3A8 8 0 1 0 4 16.3" />
      </>
    ),
    clipboard: (
      <>
        <path d="M9 2h6l1 3h3v17H5V5h3z" />
        <path d="M9 5h6" />
        <path d="M8 11h8" />
        <path d="M8 15h8" />
      </>
    ),
    layout: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 10h18" />
        <path d="M9 10v10" />
      </>
    ),
    monitor: (
      <>
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </>
    ),
    museum: (
      <>
        <path d="M3 10h18" />
        <path d="m12 3 9 5H3z" />
        <path d="M5 10v8" />
        <path d="M9 10v8" />
        <path d="M15 10v8" />
        <path d="M19 10v8" />
        <path d="M3 21h18" />
      </>
    ),
    book: (
      <>
        <path d="M4 5a3 3 0 0 1 3-3h13v17H7a3 3 0 0 0-3 3z" />
        <path d="M4 5v17" />
        <path d="M8 6h8" />
      </>
    ),
    flask: (
      <>
        <path d="M9 2h6" />
        <path d="M10 2v6l-5 9a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17l-5-9V2" />
        <path d="M8 14h8" />
      </>
    ),
    graduation: (
      <>
        <path d="m22 10-10-5-10 5 10 5z" />
        <path d="M6 12v5c3 2 9 2 12 0v-5" />
      </>
    ),
    code: (
      <>
        <path d="m8 16-4-4 4-4" />
        <path d="m16 8 4 4-4 4" />
        <path d="m14 4-4 16" />
      </>
    ),
    braces: (
      <>
        <path d="M8 4H7a3 3 0 0 0-3 3v2a3 3 0 0 1-2 3 3 3 0 0 1 2 3v2a3 3 0 0 0 3 3h1" />
        <path d="M16 4h1a3 3 0 0 1 3 3v2a3 3 0 0 0 2 3 3 3 0 0 0-2 3v2a3 3 0 0 1-3 3h-1" />
      </>
    ),
    check: (
      <>
        <path d="m20 6-11 11-5-5" />
      </>
    ),
    github: (
      <>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3c3 0 6-2 6-6a5 5 0 0 0-1.4-3.7A4.6 4.6 0 0 0 18.5 2S17.3 1.7 15 3.5a12.3 12.3 0 0 0-6 0C6.7 1.7 5.5 2 5.5 2a4.6 4.6 0 0 0-.1 3.3A5 5 0 0 0 4 9c0 4 3 6 6 6a4.8 4.8 0 0 0-1 3v4" />
        <path d="M9 18c-4.5 2-5-2-7-2" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
  };

  return <svg {...commonProps}>{paths[name]}</svg>;
}