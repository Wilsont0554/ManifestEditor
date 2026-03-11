import { NavLink } from "react-router";

function Navbar() {
  const linkActiveStyle = "bg-slate-900 text-white";
  const linkInactiveStyle = "text-slate-700 hover:bg-slate-200 hover:text-slate-900";

  return (
    <header className="border-b border-slate-300 bg-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <p className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Manifest Editor
        </p>
        <nav className="flex flex-wrap items-center gap-2">
          <NavLink
            to="/manifest-editor/home"
            className={({ isActive }) =>
              `rounded-md px-3 py-1 text-sm font-medium transition ${isActive ? linkActiveStyle : linkInactiveStyle}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/manifest-editor/editor"
            className={({ isActive }) =>
              `rounded-md px-3 py-1 text-sm font-medium transition ${isActive ? linkActiveStyle : linkInactiveStyle}`
            }
          >
            Manifest Editor
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
