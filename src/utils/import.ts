import ManifestObject from "@/ManifestClasses/ManifestObject";
import { createManifestObjectFromUpload } from "@/utils/file";

export type ImportResult = {
  manifestId: string;
  manifestData: object;
  gistId?: string;
};

/**
 * Parse a user-provided string and extract a GitHub gist identifier.
 * Accepts a raw 20+ char hex gist id, a gist.github.com URL, or a
 * gist.githubusercontent.com raw URL.
 * @param inputValue raw user input (URL or id) to parse
 * @returns the gist id if one can be derived, otherwise null
 */
export function extractGistId(inputValue: string): string | null {
  const value = inputValue.trim();
  if (!value) return null;

  if (/^[a-f0-9]{20,}$/i.test(value)) {
    return value;
  }

  try {
    const parsed = new URL(value);
    const pathParts = parsed.pathname.split("/").filter(Boolean);

    if (parsed.hostname === "gist.github.com" && pathParts.length >= 2) {
      return pathParts[1];
    }

    if (
      parsed.hostname === "gist.githubusercontent.com" &&
      pathParts.length >= 2
    ) {
      return pathParts[1];
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Fetch a manifest from a GitHub gist and convert it into a ManifestObject.
 * Picks the first .json file in the gist (or the first file if none match),
 * falls back to fetching raw_url when inline content is unavailable, and
 * runs the result through createManifestObjectFromUpload to assign a fresh
 * unique id.
 * @param rawInput user-provided gist URL or id
 * @returns the new manifest id, the parsed manifest data, and the gist id
 * @throws if the input is unparseable, the gist API call fails, the gist
 * has no files, or the file content cannot be loaded
 */
export async function importManifestFromGist(rawInput: string): Promise<ImportResult> {
  const gistIdentifier = extractGistId(rawInput);
  if (!gistIdentifier) {
    throw new Error("Enter a valid GitHub gist URL, raw gist URL, or gist ID.");
  }

  const gistResponse = await fetch(
    `https://api.github.com/gists/${gistIdentifier}`,
  );
  if (!gistResponse.ok) {
    throw new Error(`GitHub API error: ${gistResponse.status}`);
  }

  const gistData = await gistResponse.json();
  const fileEntries = Object.values(gistData.files ?? {}) as Array<{
    filename?: string;
    raw_url?: string;
    content?: string;
  }>;

  if (!fileEntries.length) {
    throw new Error("This gist has no files.");
  }

  const manifestFile =
    fileEntries.find((entry) =>
      (entry.filename ?? "").toLowerCase().endsWith(".json"),
    ) ?? fileEntries[0];

  let manifestText = manifestFile.content;
  if (!manifestText && manifestFile.raw_url) {
    const rawResponse = await fetch(manifestFile.raw_url);
    if (!rawResponse.ok) {
      throw new Error(
        `Unable to fetch gist file content (${rawResponse.status}).`,
      );
    }
    manifestText = await rawResponse.text();
  }

  if (!manifestText) {
    throw new Error("Unable to load gist file content.");
  }

  const manifestData = JSON.parse(manifestText);
  const parsed = createManifestObjectFromUpload(manifestData) as ManifestObject;
  const manifestId = parsed.getUniqueIdCode();

  return {
    manifestId,
    manifestData,
    gistId: gistData.id ?? gistIdentifier,
  };
}

/**
 * Read a manifest JSON file selected by the user and convert it into a
 * ManifestObject with a fresh unique id.
 * @param file the File object obtained from a file input or drag-and-drop
 * @returns the new manifest id and the parsed manifest data
 * @throws if the file is not valid JSON or cannot be parsed as a manifest
 */
export async function importManifestFromFile(file: File): Promise<ImportResult> {
  const text = await file.text();
  const manifestData = JSON.parse(text);
  const parsed = createManifestObjectFromUpload(manifestData) as ManifestObject;
  const manifestId = parsed.getUniqueIdCode();

  return { manifestId, manifestData };
}
