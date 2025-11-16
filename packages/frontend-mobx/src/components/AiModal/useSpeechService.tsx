import { useCallback } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

export const useSpeechService = () => {
  const {
    browserSupportsSpeechRecognition,
    listening,
    resetTranscript,
    transcript,
  } = useSpeechRecognition();

  const startListening = useCallback(async () => {
    resetTranscript();
    await SpeechRecognition.startListening({
      continuous: true,
      language: 'en-US',
    });
  }, [resetTranscript]);

  const stopListening = useCallback(async () => {
    await SpeechRecognition.stopListening();
    resetTranscript();
  }, [resetTranscript]);

  return {
    listening,
    speechSupported: browserSupportsSpeechRecognition,
    startListening,
    stopListening,
    transcript,
  } as {
    listening: boolean;
    speechSupported: boolean;
    startListening: () => Promise<void>;
    stopListening: () => Promise<void>;
    transcript: string;
  };
};
