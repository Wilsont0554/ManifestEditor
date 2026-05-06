import { downloadJsonFile } from "@/utils/file";
import { useState, useEffect, ChangeEvent } from "react";
import ImportMenu from "./import";
import ExportMenu from "./export";
import { useNavigate } from "react-router";
import { importManifestFromGist, importManifestFromFile } from "@/utils/import";

function ImportExportHandler({
    gistId, isAutoUpdateEnabled, setGistId, setIsAutoUpdateEnabled,
    serializedManifest, importExportType, setImportExportType
}) {
    const reRoute = useNavigate();
    const [isCreatingGist, setIsCreatingGist] = useState(false);
    const [gistBaseName, setGistBaseName] = useState("manifest");
    const [gistUrl, setGistUrl] = useState<string | null>(null);
    const [gistRawUrl, setGistRawUrl] = useState<string | null>(null);
    const [githubToken, setGithubToken] = useState<string>(
        localStorage.getItem("githubToken") || ""
    );
    const [, setShowTokenWarning] = useState(githubToken.length === 0);
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

  /**
   * Handle when user upload a manifest using a github gist url
   */
  async function handleUploadManifestFromGist(): Promise<void> {
    setIsImportingGist(true);

    try {
      const { manifestId, gistId: importedGistId } = await importManifestFromGist(gistImportUrl);
      setGistId(importedGistId ?? null);
      setGistUrl(null);
      setGistRawUrl(null);
      setGistImportUrl("");
      reRoute('/editor/' + manifestId, { replace: true });
    } catch (error) {
      console.error("Failed to import gist:", error);
      alert(
        error instanceof Error
          ? `Failed to import gist: ${error.message}`
          : "Failed to import gist. Check the link and try again."
      );
    } finally {
      setIsImportingGist(false);
      setImportExportType("none");
    }
  }

  /**
   * Handle when user upload a manifest file from their local machine.
   * @param event - button click event when user select a file to upload
   */
  async function handleUploadManifest(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const uploadedManifest = event.target.files?.[0] ?? null;
    if (!uploadedManifest) {
      return;
    }

    try {
      const { manifestId } = await importManifestFromFile(uploadedManifest);
      setImportExportType("none");
      reRoute('/editor/' + manifestId, { replace: true });
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