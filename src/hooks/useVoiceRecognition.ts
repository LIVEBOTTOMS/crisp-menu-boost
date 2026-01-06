import { useState, useEffect } from 'react';

interface VoiceRecognitionResult {
    transcript: string;
    confidence: number;
    isFinal: boolean;
}

interface VoiceRecognitionReturn {
    isListening: boolean;
    transcript: string;
    confidence: number;
    error: string | null;
    isSupported: boolean;
    startListening: () => void;
    stopListening: () => void;
    resetTranscript: () => void;
}

export const useVoiceRecognition = (): VoiceRecognitionReturn => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [confidence, setConfidence] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [recognition, setRecognition] = useState<any>(null);

    // Check if browser supports Web Speech API
    const isSupported = typeof window !== 'undefined' &&
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

    useEffect(() => {
        if (!isSupported) {
            setError('Speech recognition is not supported in this browser');
            return;
        }

        // @ts-ignore - WebKit prefix
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();

        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';
        recognitionInstance.maxAlternatives = 1;

        recognitionInstance.onstart = () => {
            setIsListening(true);
            setError(null);
        };

        recognitionInstance.onresult = (event: any) => {
            const result = event.results[event.results.length - 1];
            const transcriptText = result[0].transcript;
            const confidenceScore = result[0].confidence;

            setTranscript(transcriptText);
            setConfidence(confidenceScore);
        };

        recognitionInstance.onerror = (event: any) => {
            setError(event.error);
            setIsListening(false);
        };

        recognitionInstance.onend = () => {
            setIsListening(false);
        };

        setRecognition(recognitionInstance);

        return () => {
            if (recognitionInstance) {
                recognitionInstance.stop();
            }
        };
    }, [isSupported]);

    const startListening = () => {
        if (recognition && !isListening) {
            setTranscript('');
            setConfidence(0);
            setError(null);
            recognition.start();
        }
    };

    const stopListening = () => {
        if (recognition && isListening) {
            recognition.stop();
        }
    };

    const resetTranscript = () => {
        setTranscript('');
        setConfidence(0);
    };

    return {
        isListening,
        transcript,
        confidence,
        error,
        isSupported,
        startListening,
        stopListening,
        resetTranscript
    };
};

// Text-to-Speech hook for voice feedback
export const useTextToSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

    const speak = (text: string, options?: { rate?: number; pitch?: number; volume?: number }) => {
        if (!isSupported) return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = options?.rate || 1;
        utterance.pitch = options?.pitch || 1;
        utterance.volume = options?.volume || 1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const stop = () => {
        if (isSupported) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    return { speak, stop, isSpeaking, isSupported };
};
