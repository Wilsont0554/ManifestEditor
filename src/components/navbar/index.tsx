import { NavLink } from "react-router";
import CreateNewManifestLink from "@/components/navbar/createNewManifestLink";

const LOGO_SRC = `${import.meta.env.BASE_URL}iiif3dlogo.png`;

function Navbar() {
  const linkActiveStyle = "bg-slate-900 text-white";
  const linkInactiveStyle =
    "text-slate-700 hover:bg-slate-200 hover:text-slate-900";

  return (
    <header className="border-b border-slate-300 bg-slate-50">
      <div className="mx-auto flex w-full flex-col gap-3 px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <NavLink
          to='/'
          aria-label="Manifest Editor home"
          className="flex w-fit items-center gap-3 text-2xl font-bold tracking-tight text-slate-900 transition hover:text-slate-700 sm:text-3xl"
        >
          <img
            src={LOGO_SRC}
            alt=""
            className="h-12 w-12 rounded-xl object-contain shadow-sm ring-1 ring-slate-200 sm:h-14 sm:w-14"
          />
          <span>Manifest Editor</span>
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
            to='/gallery'
            className={({ isActive }) =>
              `rounded-md px-3 py-1 text-sm font-medium transition ${isActive ? linkActiveStyle : linkInactiveStyle}`
            }          
          >
            Gallery
          </NavLink>
          <CreateNewManifestLink linkActiveStyle={linkActiveStyle} linkInactiveStyle={linkInactiveStyle}/>
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
