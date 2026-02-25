import React, { useState } from "react";
import Label from '../ManifestClasses/Label.js'
import LabelElement from "./LabelElement.jsx";

function ContentResourceElement(props){

    const [annotationURL, setAnnotationURL] = useState('');

    return(
    <>
        <li>
            <input placeholder="URL" type="text" value={annotationURL} onChange={e => 
                {
                    setAnnotationURL(e.target.value); 
                    props.manifestObj.getContainerObj().getAnnotationPage().getAnnotation().getContentResource(props.index).changeID(e.target.value);
                    props.setcount(props.count + 1);
                }}>
            </input>
            
            <button onClick={() => {
                props.manifestObj.getContainerObj().getAnnotationPage().getAnnotation().getContentResource(props.contentResourceIndex).createLabelTest();
                props.setcount(props.count + 1);
            }}>Create Label</button>
            <ol>
                {props.manifestObj.getContainerObj().getAnnotationPage().getAnnotation().getContentResource(props.contentResourceIndex).getAllLabels().map((label, labelIndex) => (
                    <LabelElement key={labelIndex} labelIndex={labelIndex} {...props}></LabelElement>
                ))}
            </ol>
        </li>
    </>
    )
/*
    <li key={index}>
        <input placeholder={index} type="text" value={annotationURL} onChange={e => manifestObj.getContainerObj().getAnnotationPage().getAnnotation(index).changeID(e.target.value)}></input>
    </li>
*/
} export default ContentResourceElement