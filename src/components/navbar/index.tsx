export type ActiveView = "home" | "manifest-creator";

export interface NavLink {
  label: string;
  href: string;
  type: "internal" | "external";
}

interface NavbarProps {
  activeView: ActiveView;
  links: readonly NavLink[];
}

function isActiveInternalLink(href: string, activeView: ActiveView): boolean {
  if (href === "#manifest-creator") {
    return activeView === "manifest-creator";
  }

  if (href === "#home") {
    return activeView === "home";
  }

  return false;
}

function Navbar({ activeView, links }: NavbarProps) {
  return (
    <header className="border-b border-slate-300 bg-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <p className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Manifest Editor</p>

        <nav className="flex flex-wrap items-center gap-2">
          {links.map((link) => {
            const isExternal = link.type === "external";
            const isActive = !isExternal && isActiveInternalLink(link.href, activeView);

            return (
              <a
                key={link.href}
                href={link.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
                className={`rounded-md px-3 py-1 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
