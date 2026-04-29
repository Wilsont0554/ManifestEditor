import { NavLink, useNavigate } from "react-router";
import ManifestObject from "@/ManifestClasses/ManifestObject";

type Props = {
    linkActiveStyle?: string;
    linkInactiveStyle?: string;
    children?: React.ReactNode;
}

export default function CreateNewManifestLink(props: Props) {
  const { linkActiveStyle, linkInactiveStyle, children } = props;
  const reRoute = useNavigate();
  function handleCreateNewManifest(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const newManifest = new ManifestObject("scene");
    const newId = newManifest.getUniqueIdCode();
    reRoute(`/editor/${newId}`, {
      state: { isExample: false, manifest: newManifest },
    });
  }

  return (
    <NavLink
      to="/editor"
      onClick={handleCreateNewManifest}
      className={({ isActive }) =>
        `rounded-md px-3 py-1 
         text-sm font-medium transition 
         flex gap-2 items-center justify-center
         ${isActive ? linkActiveStyle : linkInactiveStyle}`
      }
    >
      {children ? children : "Manifest Editor"}
    </NavLink>
  );
}
