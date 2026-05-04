import { useLocation, useNavigate } from "react-router";
import ManifestObject from "@/ManifestClasses/ManifestObject";

type Props = {
    linkActiveStyle?: string;
    linkInactiveStyle?: string;
    children?: React.ReactNode;
}

export default function CreateNewManifestLink(props: Props) {
  const { linkActiveStyle, linkInactiveStyle, children } = props;
  const reRoute = useNavigate();
  const location = useLocation();

  function handleCreateNewManifest() {
    const newManifest = new ManifestObject("scene");
    const newId = newManifest.getUniqueIdCode();
    reRoute(`/editor/${newId}`, {
      state: { isExample: false, manifest: newManifest },
    });
  }

  const isActive = location.pathname.startsWith("/editor/");

  return (
    <button
      type="button"
      onClick={handleCreateNewManifest}
      className={
        `rounded-md px-3 py-1 
         text-sm font-medium transition 
         flex gap-2 items-center justify-center
         ${isActive ? linkActiveStyle : linkInactiveStyle}`
      }
    >
      {children ? children : "Manifest Editor"}
    </button>
  );
}
