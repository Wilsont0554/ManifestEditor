import { createContext } from "react";
import ManifestObject from "@ManifestClasses/ManifestObject";

const manifestObjContext = createContext(new ManifestObject("scene"));
