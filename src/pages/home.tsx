import { useEffect } from "react";
import Hero from "@/components/home/hero";
import Features from "@/components/home/features";
import Workflow from "@/components/home/workflow";
import Introduction from "@/components/home/introduction";
import Audience from "@/components/home/audience";
import ManifestDefinition from "@/components/home/manifestDefinition";
import CallToAction from "@/components/home/callToAction";
import Mission from "@/components/home/mission";

const VOYAGER_SCRIPT_ID = "voyager-explorer-script";
const VOYAGER_SCRIPT_SRC =
  "https://smithsonian.github.io/voyager-dev/iiif/voyager-explorer-iiif.min.js";

function ensureVoyagerScript(): void {
  if (document.getElementById(VOYAGER_SCRIPT_ID)) {
    return;
  }

  const scriptTag = document.createElement("script");
  scriptTag.id = VOYAGER_SCRIPT_ID;
  scriptTag.src = VOYAGER_SCRIPT_SRC;
  document.body.appendChild(scriptTag);
}

function HomePage() {

  useEffect(() => {
    ensureVoyagerScript();
  }, []);

  return (
    <div className="manifest-tabs-scroll h-full w-full overflow-y-auto bg-[radial-gradient(circle_at_top_left,#fce7f3_0,#f8fafc_28rem,#eaf2ff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 pb-8">
        <Hero />
        <ManifestDefinition/>
        <Introduction/>
        <Workflow />
        <Features />
        <Audience />
        <Mission />
        <CallToAction />
      </div>
    </div>
  );
}

export default HomePage;
