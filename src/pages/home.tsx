import { NavLink } from "react-router";

const EDITOR_ROUTE = "/ManifestEditor/manifest-editor/editor";

function HomePage() {
  return (
    <div className="w-full overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Manifest Editor
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Build IIIF 4.0 manifests, edit annotation details, and export the
          result as a JSON file.
        </p>

        <NavLink
          to={EDITOR_ROUTE}
          className="mt-6 inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Open Manifest Editor
        </NavLink>
      </section>
    </div>
  );
}

export default HomePage;
