function HomePage() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Manifest Editor</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Build IIIF manifests, edit annotation details, and export the result as a JSON file.
      </p>

      <a
        href="#manifest-creator"
        className="mt-6 inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
      >
        Open Manifest Creator
      </a>
    </section>
  );
}

export default HomePage;
