import React, { useState } from "react";
import Label from '../ManifestClasses/Label.js'
import LabelElement from "./LabelElement.jsx";

function ContentResourceElement(props){

    const [annotationURL, setAnnotationURL] = useState('');
    const [selectedType, setType] = useState('');

    const types = {
        "Image": "image/jpeg",
        "Model" : "model/gltf-binary"
    }

    return(
    <>
        <li>
            
            <select 
                    value={selectedType} 
                    onChange={(e) => {
                        setType(e.target.value);
                        props.manifestObj.getContainerObj().getAnnotationPage().getAnnotation(0).getContentResource(props.contentResourceIndex).setType(e.target.value);
                        props.manifestObj.getContainerObj().getAnnotationPage().getAnnotation(0).getContentResource(props.contentResourceIndex).setFormat(types[e.target.value]);
                        props.setcount(props.count + 1);
                    }}
                    style={{ padding: '5px' }}
                >

                {Object.keys(types).map(type => (
                    <option key={type} value={type}>{type}</option>
                ))}
            </select>

            <input placeholder="URL" type="text" value={annotationURL} onChange={e => 
                {
                    setAnnotationURL(e.target.value); 
                    props.manifestObj.getContainerObj().getAnnotationPage().getAnnotation().getContentResource(props.index).setID(e.target.value);
                    props.setcount(props.count + 1);
                }}>
            </input>
            
            <LabelElement {...props}></LabelElement>

        </li>
    </>
    )
/*

<ol>
                {props.manifestObj.getContainerObj().getAnnotationPage().getAnnotation().getContentResource(props.contentResourceIndex).getAllLabels().map((label, labelIndex) => (
                    <LabelElement key={labelIndex} labelIndex={labelIndex} {...props}></LabelElement>
                ))}
            </ol>
    <li key={index}>
        <input placeholder={index} type="text" value={annotationURL} onChange={e => manifestObj.getContainerObj().getAnnotationPage().getAnnotation(index).changeID(e.target.value)}></input>
    </li>
*/
} export default ContentResourceElement