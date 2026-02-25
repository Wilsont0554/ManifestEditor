import { ManifestEditor } from "manifest-editor";
import "manifest-editor/dist/index.css";
import "manifest-editor/reset.css";
import { IIIFBuilder } from 'iiif-builder';
import { JsonEditor } from 'json-edit-react'
import React, { useState } from "react";


function App() {

  function testFunction(){
    //console.log(myObj.items[0].items[0].items[0].body);
    //myObj.items[0].items[0].items[0].body.id = "https://raw.githubusercontent.com/IIIF/3d/main/assets/astronaut/astronaut.glb"
    //myObj.items[0].type = "Scene";
    var tempManifest = manifest;
    tempManifest.items[0].items[0].items[0].body.id = "https://raw.githubusercontent.com/IIIF/3d/main/assets/astronaut/astronaut.glb"
    tempManifest.items[0].type = "Scene";
    setManifest('')
    setManifest({...manifest, tempManifest})
    console.log(manifest.items[0].type);
  }

  //const [count, setCount] = useState(0); // State variable

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

  const builder = new IIIFBuilder();
    const newManifest = builder.createManifest(
    'https://iiif.io/api/cookbook/recipe/0001-mvm-image/manifest.json',
    manifest => {
      manifest.addLabel('Test', 'en');
      manifest.createCanvas('https://iiif.io/api/cookbook/recipe/0001-mvm-image/canvas/p1', canvas => {
        canvas.createAnnotation(
          'https://iiif.io/api/cookbook/recipe/0001-mvm-image/annotation/p0001-image',
          {
            id: 'https://iiif.io/api/cookbook/recipe/0001-mvm-image/annotation/p0001-image',
            type: 'Annotation',
            motivation: 'painting',
            body: {
              
            }
          }
        );
      })
    
    }
  );
  const jsonManifest = builder.toPresentation3({id: newManifest.id, type: 'Manifest'});
  const temp = JSON.stringify(jsonManifest);
  const [manifest, setManifest] = useState(JSON.parse(temp)); // State variable
  
  return (
    <div style={{ width: "100vw", height: "100vh"}}>
      <p onClick={() => JSONToFile(manifest, 'testManifest')}>Download JSON</p>
      <button onClick={() => {testFunction()}}>Test</button>
      <JsonEditor data={ manifest }></JsonEditor>

    </div>
  );

}

/*
      <p>{JSON.stringify(manifest)}</p>

 id: "https://raw.githubusercontent.com/IIIF/3d/main/assets/astronaut/astronaut.glb",
    type: "Model",
    format: "model/gltf-binary"
*/
export default App;