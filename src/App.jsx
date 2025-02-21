import React, { useState, useEffect} from "react";
import "./App.css";
import TextInput from "./components/inputfield";
import SummarizeButton from "./components/SummarizeButton";
import OutputDisplay from "./components/output";
import Translation from "./components/Translation";

 

const App = () => {
  useEffect(() => {
    const summarizerMeta = document.createElement("meta");
    summarizerMeta.httpEquiv = "origin-trial";
    summarizerMeta.content = import.meta.env.VITE_SUMMARIZER_TOKEN;
    document.head.appendChild(summarizerMeta);
  
    const detectorMeta = document.createElement("meta");
    detectorMeta.httpEquiv = "origin-trial";
    detectorMeta.content = import.meta.env.VITE_DETECTOR_TOKEN;
    document.head.appendChild(detectorMeta);
  
    const translatorMeta = document.createElement("meta");
    translatorMeta.httpEquiv = "origin-trial";
    translatorMeta.content = import.meta.env.VITE_TRANSLATOR_TOKEN;
    document.head.appendChild(translatorMeta);
  
    return () => {
      document.head.removeChild(summarizerMeta); 
      document.head.removeChild(detectorMeta); 
      document.head.removeChild(translatorMeta); 
    };
  }, []);
 
  const [text, setText] = useState('');
  const [detectedLang, setDetectedLang] = useState('');
  const [rawLang, setRawLang] = useState('en');
  const [summarizedText, setSummarizedText] = useState('');
  const [translatedText, setTranslatedText] = useState('')
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  return (
    <div className="cardBody">
      <div className="chat-container">
      <OutputDisplay summarizedText={summarizedText} translatedText={translatedText}  messages={messages} />
      </div>
      <div id="functions">
      <Translation text={text} translatedText={translatedText} setTranslatedText={setTranslatedText} rawLang={rawLang} setMessages={setMessages} setError={setError}/>
    
     {text.length >= 150 && detectedLang === " English" && (
  <SummarizeButton 
    text={text} 
    summarizedText={summarizedText} 
    setSummarizedText={setSummarizedText}
    setMessages={setMessages}
    setError={setError}
  />
)}
</div>
 <TextInput text={text} setText={setText} detectedLang={detectedLang} setDetectedLang={setDetectedLang} setRawLang={setRawLang} setMessages={setMessages} setError={setError}  />
  {error && <p className="error">{error}</p>}
    </div>
   
  );
};

export default App;
