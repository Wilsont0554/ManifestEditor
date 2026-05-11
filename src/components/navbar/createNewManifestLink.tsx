import { useLocation, useNavigate } from "react-router";
import ManifestObject from "@/ManifestClasses/ManifestObject";
import { IndexedDB } from "@/utils/indexdb";
type Props = {
    linkActiveStyle?: string;
    linkInactiveStyle?: string;
    children?: React.ReactNode;
}

export default function CreateNewManifestLink(props: Props) {
  const { linkActiveStyle, linkInactiveStyle, children } = props;
  const reRoute = useNavigate();
  const location = useLocation();

  async function handleCreateNewManifest() {
    const newManifest = new ManifestObject("scene");
    const newId = newManifest.getUniqueIdCode();
    try {
          const db = new IndexedDB();
          await db.open();
          await db.saveProject(newManifest, newId);
          reRoute(`/editor/${newId}`);
    } catch (error) {
      reRoute("/error", { state: { message: "Failed to create new manifest." } });
    }
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
