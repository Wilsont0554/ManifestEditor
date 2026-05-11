const VOYAGER_SCRIPT_ID = "voyager-explorer-script";
const VOYAGER_SCRIPT_SRC =
  "https://smithsonian.github.io/voyager-dev/iiif/voyager-explorer-iiif.min.js";

export function setupVoyagerScript(): void {
    if (document.getElementById(VOYAGER_SCRIPT_ID)) return;
    const tag = document.createElement("script");
    tag.id = VOYAGER_SCRIPT_ID;
    tag.src = VOYAGER_SCRIPT_SRC;
    document.body.appendChild(tag);
}