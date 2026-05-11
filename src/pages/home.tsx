import Hero from "@/components/home/hero";
import Features from "@/components/home/features";
import Workflow from "@/components/home/workflow";
import Introduction from "@/components/home/introduction";
import ManifestDefinition from "@/components/home/manifestDefinition";
import CallToAction from "@/components/home/callToAction";

function HomePage() {
  return (
    <div className="manifest-tabs-scroll h-full w-full overflow-y-auto bg-[radial-gradient(circle_at_top_left,#fce7f3_0,#f8fafc_28rem,#eaf2ff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 pb-8">
        <Hero />
        <ManifestDefinition/>
        <Introduction/>
        <Workflow />
        <Features />
        <CallToAction />
      </div>
    </div>
  );
}

export default HomePage;
