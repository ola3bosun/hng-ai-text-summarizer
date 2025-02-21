import React, { useState,useEffect } from 'react'


const Translation = ({text, translatedText, rawLang,setTranslatedText, setMessages, setError}) => {
    const [transLang, setTransLang] = useState("en")
    const handleTranslate = async(e) =>{
        e.preventDefault()
        setError(null);
        if ('ai' in self && 'translator' in self.ai) {
            console.log('Translation API is available');
      
            try {
              const translatorCapabilities = await self.ai.translator.capabilities();
              const available = translatorCapabilities.languagePairAvailable(rawLang, transLang);
      
              if (available === 'no') {
                console.log(`Translation from ${rawLang} to ${transLang} is not supported.`);
                return;
              }

              const translator = await self.ai.translator.create({
                sourceLanguage: rawLang,
                targetLanguage: transLang,
                monitor(m) {
                  m.addEventListener('downloadprogress', (e) => {
                    console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
                  });
                },
              });
      
              const translated = await translator.translate(text);
              setTranslatedText(translated); 

              setMessages(prev => [
                ...prev,
                { type: 'bot', text: translated }
            ]);
            } catch (error) {
              console.error('Translation failed:', error);
              setError('Translation failed. Please try again.');
            }
          }
        };
    
    
      return (
        <>
        <form className="translation-form">
            <label>Select Language:</label>
            <select value={transLang} onChange={(e) => setTransLang(e.target.value)}>
                <option value="en">English</option>
                <option value="pt">Portuguese</option>
                <option value="es">Spanish</option>
                <option value="ru">Russian</option>
                <option value="tr">Turkish</option>
                <option value="fr">French</option>
            </select>
            <button onClick={handleTranslate} disabled={rawLang === transLang}>
                Translate
            </button>
        </form>
    </>
      );
    };

export default Translation