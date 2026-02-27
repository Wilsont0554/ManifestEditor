import { ManifestEditor } from "manifest-editor";
import "manifest-editor/dist/index.css";
import "manifest-editor/reset.css";
import { IIIFBuilder } from 'iiif-builder';
import { JsonEditor } from 'json-edit-react'
import React, { useState } from "react";
import Manifest from './manifest.js'
import AnnotationPage from './ManifestClasses/AnnotationPage.js'
import Annotation from './ManifestClasses/Annotation.js'
import Container from './ManifestClasses/Container.js'
import ManifestObject from "./ManifestClasses/ManifestObject.js";
import ContentResourceElement from "./Components/ContentResourceElement.jsx";
import Label from './ManifestClasses/Label.js'
import ContentResource from './ManifestClasses/ContentResource.js'

function App() {
  const [count, setcount] = useState(0);
  const [containerType, setContainerType] = useState('Scene'); // Declare a state variable...
  const [manifestObj, setManifestObj] = useState(new ManifestObject(containerType))

  const JSONToFile = (obj, filename) => {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  function createAnnotation(){
    manifestObj.getContainerObj().getAnnotationPage().getAnnotation().addContentResource(new ContentResource("", "Model", "model/gltf-binary"));
    setcount(count + 1);
    console.log(manifestObj.getContainerObj().getAnnotationPage().getAnnotation(0).getAllContentResource())
  }

  return (
    <div style={{ width: "100vw", height: "100vh"}}>
      <p onClick={() => JSONToFile(manifestObj, 'testManifest')}>Download JSON</p>
      <select value={containerType} onChange={e => {manifestObj.getContainerObj().setType(e.target.value); setContainerType(e.target.value)}}>
        <option>Canvas</option>
        <option>Scene</option>
      </select>

      <button onClick={createAnnotation}>Add Content Resource</button>

      <ol>
        {/*For each annotation*/}
        {manifestObj.getContainerObj().getAnnotationPage().getAnnotation(0).getAllContentResource().map((annotation, contentResourceIndex) => (
          <ContentResourceElement key={contentResourceIndex} count={count} setcount={setcount} index={contentResourceIndex} manifestObj={manifestObj}></ContentResourceElement>
        ))}
      </ol>
      
      <JsonEditor data={ manifestObj }></JsonEditor>

    </div>
  );

}

/*

http://iiif.io/api/presentation/2.1/example/fixtures/resources/page1-full.png
      <button onClick={() => {testFunction()}}>Test</button>
      <JsonEditor data={ manifest }></JsonEditor>
      <p>{JSON.stringify(manifest)}</p>

 id: "https://raw.githubusercontent.com/IIIF/3d/main/assets/astronaut/astronaut.glb",
    type: "Model",
    format: "model/gltf-binary"
*/
export default App;