import ManifestObject from "@/ManifestClasses/ManifestObject";
import { NavLink, useNavigate } from "react-router";

function Navbar() {
  const linkActiveStyle = "bg-slate-900 text-white";
  const linkInactiveStyle =
    "text-slate-700 hover:bg-slate-200 hover:text-slate-900";
  const reRoute = useNavigate();

  function handleCreateNewManifest(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const newManifest = new ManifestObject("scene");
    const newId = newManifest.getUniqueIdCode();
    reRoute(`/editor/${newId}`, {state: {isExample: false, manifest: newManifest}});
  }

  return (
    <header className="border-b border-slate-300 bg-slate-50">
      <div className="mx-auto flex w-full flex-col gap-3 px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <NavLink
          to='/'
          className="w-fit text-2xl font-bold tracking-tight text-slate-900 transition hover:text-slate-700 sm:text-3xl"
        >
          Manifest Editor
        </NavLink>
        <nav className="flex flex-wrap items-center gap-10">
          <NavLink
            to='/'
            className={({ isActive }) =>
              `rounded-md px-3 py-1 text-sm font-medium transition ${isActive ? linkActiveStyle : linkInactiveStyle}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to='/editor'
            onClick={handleCreateNewManifest}
            className={({ isActive }) =>
              `rounded-md px-3 py-1 text-sm font-medium transition ${isActive ? linkActiveStyle : linkInactiveStyle}`
            }
          >
            Manifest Editor
          </NavLink>
          <a href="https://github.com/Wilsont0554/ManifestEditor" target="_blank" rel="noreferrer" className={linkInactiveStyle}>
            Github
          </a>
          <a
            href="https://preview.iiif.io/api/full_manifests/presentation/4.0/"
            target="_blank"
            rel="noreferrer"
            >
            Documentation
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
