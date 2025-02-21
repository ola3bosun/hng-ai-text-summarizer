import React, { useState, useEffect } from 'react';

const TextInput = ({ text, setText, setDetectedLang, detectedLang, setRawLang,setMessages,setError}) => {
  const [detector, setDetector] = useState(null);
  const [loading, setLoading] = useState(true); 
  const[detectedText, setDetectedText]= useState("")

  const languageTagToHumanReadable = (languageTag, targetLanguage) => {
    const displayNames = new Intl.DisplayNames([targetLanguage], {
      type: 'language',
    });
    return displayNames.of(languageTag);
  };


  useEffect(() => {
    const initDetector = async () => {
      if ('ai' in self && 'languageDetector' in self.ai) {
        const capabilities = await self.ai.languageDetector.capabilities();
        try {
          const newDetector =
            capabilities.capabilities === 'readily'
              ? await self.ai.languageDetector.create()
              : await self.ai.languageDetector.create({
                  monitor(m) {
                    m.addEventListener('downloadprogress', (e) => {
                      console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
                    });
                  },
                });

          await newDetector.ready;
          setDetector(newDetector);
        } catch (error) {
          console.error('Failed to initialize detector:', error);
        }
      }
      setLoading(false); 
    };
    initDetector();
  }, []);

  const handleChange = async (e) => {
    const newText = e.target.value;
    setDetectedText(newText)
    setError(null)

    if (!detector || loading) {
      setDetectedLang('Detecting language...');
      return;
    }
    if (!newText.trim()) {
      setDetectedLang('');
      return;
    }

    try {
      const results = await detector.detect(newText.trim());

      if (results.length > 0) {
        const { detectedLanguage } = results[0];
        setRawLang(detectedLanguage)
        
        setDetectedLang(` ${languageTagToHumanReadable(detectedLanguage, 'en')}`);
      }
    } catch (error) {
      console.error('Language detection failed:', error);
      setError('Failed to detect language. Please try again.');
    }
  };

const handleEnter = () =>{
    if (!detectedText.trim()) return; 
    
    setText(detectedText);

    setMessages(prev => [
        ...prev,
        { type: 'user', text: detectedText },
    ]);

    setDetectedText('');
}
  return (
    <>
        <div className="input-container">
            <div id='answer'>
    <textarea value={detectedText} onChange={handleChange} placeholder="Enter Text" /> 
      <br />
      <button onClick={handleEnter}>Send</button>
      </div>
      <span id='language'> Detected Language: {loading ? 'Initializing...' : detectedLang}</span> 
      </div>
    </>
  );
};

export default TextInput;
