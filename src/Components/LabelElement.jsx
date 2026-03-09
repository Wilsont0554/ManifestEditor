import React, { useState } from "react";
import Label from '../ManifestClasses/TypeScript/Label.ts'

function LabelElement(props){

    const [labelValue, setlabelValue] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    
    // Create a temporary Label instance to get supported languages
    const tempLabel = new Label('');
    const supportedLanguages = tempLabel.getSupportedLanguages();
    
    // Map language codes to language names
    const languageNames = {
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'ru': 'Russian',
        'zh': 'Chinese',
        'jp': 'Japanese',
        'pt': 'Portuguese',
        'ar': 'Arabic',
        'hi': 'Hindi',
        'sv': 'Swedish',
        'nl': 'Dutch',
        'ko': 'Korean',
        'tr': 'Turkish',
        'vi': 'Vietnamese'
    };

    return(
    <>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select 
                    value={selectedLanguage} 
                    onChange={(e) => {
                        setSelectedLanguage(e.target.value);
                        props.currentObject.changeLabel(props.labelIndex, labelValue, e.target.value);
                        props.setcount(props.count + 1);
                    }}
                    style={{ padding: '5px' }}
                >
                    {supportedLanguages.map(lang => (
                        <option key={lang} value={lang}>{languageNames[lang]}</option>
                    ))}
                </select>
                <input 
                    placeholder="A brief description" 
                    type="text" 
                    value={labelValue} 
                    onChange={e => 
                    {
                        setlabelValue(e.target.value); 
                        props.currentObject.changeLabel(props.labelIndex, e.target.value, selectedLanguage);
                        props.setcount(props.count + 1);
                    }}
                />
            </div>
    </>
    )

} export default LabelElement