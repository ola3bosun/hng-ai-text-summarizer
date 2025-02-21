import React, { useState } from 'react';

const SummarizeButton = ({ text, summarizedText, setSummarizedText,setMessages,setError }) => {
    const [summarizer, setSummarizer] = useState(null);
    const [loading, setLoading] = useState(false);

    const initializeSummarizer = async () => {
        try {
            if (!('ai' in self && 'summarizer' in self.ai)) {
                console.error('Summarizer API is not available.');
                return null;
            }

            const capabilities = await self.ai.summarizer.capabilities();
            console.log("Summarizer capabilities:", capabilities);
            if (!capabilities.available) {
                console.error("Summarizer API is not usable.");
                return null;
            }

            const options = {
                sharedContext: '',
                type: 'tl;dr',
                format: 'plain-text',
                length: 'short',
            };

            let summarizerInstance;
            if (capabilities.available === 'readily') {
                summarizerInstance = await self.ai.summarizer.create(options);
            } else {
                summarizerInstance = await self.ai.summarizer.create(options);
                summarizerInstance.addEventListener('downloadprogress', (e) => {
                    console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
                });
                await summarizerInstance.ready;
            }

            console.log("Summarizer initialized successfully.");
            return summarizerInstance;
        } catch (error) {
            console.error("Error initializing summarizer:", error);
            return null;
        }
    };

    const handleSummarize = async () => {
        if (loading) return; 
        setLoading(true);
        setError(null)

        try {
            let summarizerInstance = summarizer;

            if (!summarizerInstance) {
                console.log("Summarizer is not initialized. Initializing now...");
                summarizerInstance = await initializeSummarizer();
                setSummarizer(summarizerInstance); // Store it in state
            }
            
            if (summarizerInstance) {
                console.log("Starting summarization for text:", text);
                const summary = await summarizerInstance.summarize(text);
                setSummarizedText(summary);
                setMessages(prev => [
                    ...prev,
                    { type: 'bot', text: summary}
                ]);
            } else {
                throw new Error("Summarizer failed to initialize.");
            }
        } catch (error) {
            console.error("Summarization failed:", error);
            setError("Failed to summarize text. Please try again.");
        }

        setLoading(false);
    };

    return (
        <>
            <button onClick={handleSummarize} disabled={loading} className='summarize'>
                {loading ? 'Summarizing...' : 'Summarize'}
            </button>
        </>
    );
};

export default SummarizeButton;
