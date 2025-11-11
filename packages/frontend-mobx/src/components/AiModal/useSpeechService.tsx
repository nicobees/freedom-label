import { useCallback, useEffect, useState } from 'react';
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

  const startListening = useCallback(() => {
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: true,
      language: 'en-US',
    });
  }, [resetTranscript]);

  const stopListening = useCallback(() => {
    SpeechRecognition.stopListening();
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
    startListening: () => void;
    stopListening: () => void;
    transcript: string;
  };
};
