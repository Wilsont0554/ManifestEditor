import { NavLink } from "react-router";
import Icon from "@/components/icon";

export default function Hero() {
    const HERO_IMAGE_SRC = `${import.meta.env.BASE_URL}iiif3dlogo.png`;
    return (
        <section className="overflow-hidden rounded-[1.25rem] border border-white/80 bg-slate-950 text-white shadow-[0_20px_70px_rgba(15,23,42,0.24)]">
          <div className="grid min-h-[34rem] items-center gap-8 p-8 sm:p-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(20rem,0.8fr)] lg:p-14">
            <div>
              <div className="inline-flex rounded-lg border border-pink-400/50 bg-pink-500/10 px-4 py-2 text-xs font-bold text-pink-100">
                Supports IIIF Presentation 4 and 3D Scenes
              </div>
              <h1 className="mt-6 max-w-3xl text-5xl font-black leading-none tracking-tight sm:text-6xl lg:text-7xl">
                Create IIIF manifests with structure you can understand.
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Build manifests for images, audio, video, and 3D scenes in a
                visual workspace. Add metadata, organize content, preview
                results live, and export ready-to-share manifests.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <NavLink
                  to='/editor'
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-pink-100"
                >
                  <Icon name="clipboard" className="h-4 w-4" />
                  Open Manifest Editor
                </NavLink>
                <a
                  href="https://preview.iiif.io/api/full_manifests/presentation/4.0/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:border-white/50 hover:bg-white/10"
                >
                  <Icon name="cube" className="h-4 w-4" />
                  Read IIIF Rules
                </a>
              </div>
              <p className="mt-6 text-sm font-semibold text-slate-300">
                What is a IIIF Manifest?
              </p>
            </div>

            <div className="flex justify-center lg:justify-end">
              <img
                src={HERO_IMAGE_SRC}
                alt="IIIF 3D Manifest Editor and Viewer"
                className="max-h-96 w-full max-w-md object-contain"
              />
            </div>
          </div>
        </section>
    )
}