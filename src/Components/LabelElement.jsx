import React, { useState } from "react";
import Label from '../ManifestClasses/Label.js'

function LabelElement(props){

    const [labelValue, setlabelValue] = useState('');

    return(
    <>
        <li>
            <input placeholder="A brief description" type="text" value={labelValue} onChange={e => 
                {
                    setlabelValue(e.target.value); 
                    props.manifestObj.getContainerObj().getAnnotationPage().getAnnotation(0).getContentResource(props.contentResourceIndex).changeLabel(props.labelIndex, e.target.value);
                    props.setcount(props.count + 1);
                }}></input>
        </li>
    </>
    )

} export default LabelElement