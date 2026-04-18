import { downloadJsonFile } from "@/utils/file";
import { useState, useEffect, ChangeEvent } from "react";
import ImportMenu from "./import";
import ExportMenu from "./export";
import ManifestObject from "@/ManifestClasses/ManifestObject";

function ImportExportHandler({
    gistId, isAutoUpdateEnabled, setGistId, setIsAutoUpdateEnabled, 
    createManifestObjectFromUpload, setManifestObj, serializedManifest, manifestObj, 
    importExportType, setImportExportType
}) {

    const [isCreatingGist, setIsCreatingGist] = useState(false);
    const [gistBaseName, setGistBaseName] = useState("manifest");
    const [gistUrl, setGistUrl] = useState<string | null>(null);
    const [gistRawUrl, setGistRawUrl] = useState<string | null>(null);
    const [githubToken, setGithubToken] = useState<string>(
        localStorage.getItem("githubToken") || ""
    );
    const [showTokenWarning, setShowTokenWarning] = useState(githubToken.length === 0);
    const [gistImportUrl, setGistImportUrl] = useState("");
    const [isImportingGist, setIsImportingGist] = useState(false);
    const gistFilename = `${gistBaseName}.json`;
    
    let menu;

    function handleDownloadManifest(): void {
        downloadJsonFile(serializedManifest, "manifest");
    }

    async function handleUpdateGist(): Promise<void> {
    if (!githubToken) {
      alert("Please enter your GitHub token to update the gist.");
      setShowTokenWarning(true);
      return;
    }

    if (!gistId) {
      alert("No existing gist to update. Create one first.");
      return;
    }

    if (isCreatingGist) {
      return;
    }

    setIsCreatingGist(true);

    try {
      const response = await fetch(`https://api.github.com/gists/${gistId}`, {
        method: "PATCH",
        headers: {
          Authorization: `token ${githubToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: {
            [gistFilename]: {
              content: JSON.stringify(serializedManifest, null, 2),
            },
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `GitHub API error: ${response.status}`
        );
      }

      const data = await response.json();
      setGistUrl(data.html_url);
      setGistRawUrl(data.files[gistFilename].raw_url);
    } catch (error) {
      console.error("Failed to update gist:", error);
      alert(
        error instanceof Error
          ? `Failed to update gist: ${error.message}`
          : "Failed to update gist. Check your token and try again."
      );
    } finally {
      setIsCreatingGist(false);
    }
  }

  useEffect(() => {
    if (!isAutoUpdateEnabled || !gistId) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      void handleUpdateGist();
    }, 30000);

    return () => {
      window.clearInterval(intervalId);
    };
  });

  function handleClearToken(): void {
    setGithubToken("");
    localStorage.removeItem("githubToken");
    setGistUrl(null);
    setGistRawUrl(null);
    setGistId(null);
    setIsAutoUpdateEnabled(false);
    setShowTokenWarning(true);
  }

  /*
  function handleExportButtonClick(): void {
    setIsExportModalOpen(true);

    if (isAutoUpdateEnabled && gistId) {
      void handleUpdateGist();
    }
  }*/

  async function handleUploadManifestFromGist(): Promise<void> {
    const gistIdentifier = extractGistId(gistImportUrl);

    if (!gistIdentifier) {
      alert("Enter a valid GitHub gist URL, raw gist URL, or gist ID.");
      return;
    }

    setIsImportingGist(true);

    try {
      const gistResponse = await fetch(`https://api.github.com/gists/${gistIdentifier}`);

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
          (entry.filename ?? "").toLowerCase().endsWith(".json")
        ) ?? fileEntries[0];

      let manifestText = manifestFile.content;

      if (!manifestText && manifestFile.raw_url) {
        const rawResponse = await fetch(manifestFile.raw_url);

        if (!rawResponse.ok) {
          throw new Error(`Unable to fetch gist file content (${rawResponse.status}).`);
        }

        manifestText = await rawResponse.text();
      }

      if (!manifestText) {
        throw new Error("Unable to load gist file content.");
      }

      const nextManifest = JSON.parse(manifestText);
      applyUploadedManifest(nextManifest);

      setGistId(gistData.id ?? gistIdentifier);
      setGistUrl(gistData.html_url ?? null);
      setGistRawUrl(manifestFile.raw_url ?? null);
      setGistImportUrl("");
      setIsImportModalOpen(false);
    } catch (error) {
      console.error("Failed to import gist:", error);
      alert(
        error instanceof Error
          ? `Failed to import gist: ${error.message}`
          : "Failed to import gist. Check the link and try again."
      );
    } finally {
      setIsImportingGist(false);
    }
  }

  async function handleUploadManifest(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const uploadedManifest = event.target.files?.[0] ?? null;

    if (!uploadedManifest) {
      return;
    }

    try {
      const stringManifest = await uploadedManifest.text();
      const nextManifest = JSON.parse(stringManifest);
      applyUploadedManifest(nextManifest);
      setIsImportModalOpen(false);
    } catch (error) {
      console.error("Failed to upload manifest:", error);
      alert("Failed to upload manifest. Please upload a valid JSON file.");
    } finally {
      event.target.value = "";
    }
  }

  async function handleCreateGist(): Promise<void> {
    if (!githubToken) {
      alert("Please enter your GitHub token to create a gist.");
      setShowTokenWarning(true);
      return;
    }

    setIsCreatingGist(true);
    setGistUrl(null);

    try {
      const response = await fetch("https://api.github.com/gists", {
        method: "POST",
        headers: {
          Authorization: `token ${githubToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: "IIIF Manifest exported from Manifest Editor",
          public: true,
          files: {
            [gistFilename]: {
              content: JSON.stringify(serializedManifest, null, 2),
            },
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `GitHub API error: ${response.status}`
        );
      }

      const data = await response.json();
      setGistId(data.id);
      setGistUrl(data.html_url);
      setGistRawUrl(data.files[gistFilename].raw_url);
    } catch (error) {
      console.error("Failed to create gist:", error);
      alert(
        error instanceof Error
          ? `Failed to create gist: ${error.message}`
          : "Failed to create gist. Check your token and try again."
      );
    } finally {
      setIsCreatingGist(false);
    }
  }

  function applyUploadedManifest(nextManifest: ManifestObject): void {
    const parsedManifest = createManifestObjectFromUpload(nextManifest);

    if (parsedManifest.getLabelValue().trim() === "Blank Manifest") {
      parsedManifest.setLabel("");
    }

    setManifestObj(parsedManifest);
  }

  function extractGistId(inputValue: string): string | null {
    const value = inputValue.trim();

    if (!value) {
      return null;
    }

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

  if (importExportType == "import"){
    menu = <ImportMenu
            setImportExportType={setImportExportType}
            handleUploadManifest={handleUploadManifest}
            gistImportUrl={gistImportUrl}
            setGistImportUrl={setGistImportUrl}
            handleUploadManifestFromGist={handleUploadManifestFromGist}
            isImportingGist={isImportingGist}
          />
  }
  else if (importExportType == "export"){
    menu = <ExportMenu
        setImportExportType={setImportExportType}
        handleDownloadManifest={handleDownloadManifest}
        githubToken={githubToken}
        setGithubToken={setGithubToken}
        setShowTokenWarning={setShowTokenWarning}
        gistBaseName={gistBaseName}
        setGistBaseName={setGistBaseName}
        handleCreateGist={handleCreateGist}
        isCreatingGist={isCreatingGist}
        isAutoUpdateEnabled={isAutoUpdateEnabled}
        handleClearToken={handleClearToken}
        gistId={gistId}
        gistRawUrl={gistRawUrl}
        setIsAutoUpdateEnabled={setIsAutoUpdateEnabled}
        gistUrl={gistUrl}
        />
  }

    return(<>
        {menu}
    </>)
} export default ImportExportHandler