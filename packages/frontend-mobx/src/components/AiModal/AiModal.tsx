import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import './aiModal.css';
import ArrowRightIcon from '../../assets/icons/arrow-right.svg?react';
import MicrophoneIcon from '../../assets/icons/microphone.svg?react';
import { useAutoFill, type UseAutoFillProps } from '../../hooks/useAutoFill';
import { i18n } from '../../i18n';
import { Button } from '../atoms/Button/Button';
import {
  ChatMessage,
  type ChatMessageType,
  createChatMessage,
} from './ChatMessage';
import { useSpeechService } from './useSpeechService';

type AiModalProps = Pick<UseAutoFillProps, 'autoFillFormCallback'>;

// const filterBoolean = <T,>(item: null | T | undefined): item is T => {
//   return !!item;
// };

// const temp2 = `Marco Verdi needs right lens, material is F2mid and it is a scleral lens. The lenses needs to be ready by 15th of March 2026.
// It has power of -1.73, diameter of 3. It also needs a toric base curve of 2.1, while axis is 180. It also needs toric saggital of 749 only on right lens.
// Production batch is late-2025.`;
// const temp3 = `I want left lens for A Rossi. It has base curve of 1.24 and diameter of 2.24. Batch is late 2025`;

export const AiModal = ({ autoFillFormCallback }: AiModalProps) => {
  const { t } = useTranslation();
  const [aiModeActive, setAiModeActive] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]);
  const { initialised, initProgress, loading, prompt } = useAutoFill({
    autoFillFormCallback,
    enabled: aiModeActive,
  });

  const {
    listening,
    speechSupported,
    startListening,
    stopListening,
    transcript,
  } = useSpeechService();

  const onMicrophoneClick = useCallback(() => {
    if (listening) {
      stopListening();
      return;
    }

    void startListening();
  }, [listening, startListening, stopListening]);

  // const onTranscriptSend = useCallback(async () => {
  //   stopListening();

  //   if (!transcript) {
  //     const newSystemInput = createChatMessage(
  //       'No audio to transcribe',
  //       'system',
  //     );
  //     setChatMessages((prev) => [newSystemInput, ...prev]);
  //     return;
  //   }

  //   const newUserInput = createChatMessage(transcript, 'transcript');
  //   setChatMessages((prev) => [newUserInput, ...prev]);

  //   const llmAnswer = await prompt(newUserInput.content);
  //   const newSystemInput = createChatMessage(
  //     llmAnswer || 'No answer from llm',
  //     'system',
  //   );
  //   setChatMessages((prev) => [newSystemInput, ...prev]);
  // }, [prompt, setChatMessages, stopListening, transcript]);

  const onChatSend = useCallback(
    async (input: string) => {
      if (!input) {
        return;
      }
      const newUserInput = createChatMessage(input, 'user');
      setChatMessages((prev) => [newUserInput, ...prev]);
      setUserInput('');

      if (listening) {
        stopListening();
      }

      const llmAnswer = await prompt(input);
      const newSystemInput = createChatMessage(
        llmAnswer || 'No answer from llm',
        'system',
      );
      setChatMessages((prev) => [newSystemInput, ...prev]);
    },
    [listening, prompt, setChatMessages, stopListening],
  );

  const activateButton = (
    <Button
      disabled={!!loading || initialised}
      label={i18n.format(t('ai'), 'uppercase')}
      onClick={() => setAiModeActive(true)}
    />
  );

  const containerActivatedClassName = initialised ? ` initialised` : '';
  const initProgressMessage =
    initProgress !== null && !!loading ? `(${initProgress}%)` : '';
  const loadingInitMessage =
    !initialised && !!loading ? `${loading}...${initProgressMessage}` : '';
  const LoadingInit = loading ? <div>{`${loadingInitMessage}`}</div> : null;

  const placeholderPromptMatching = loading ? `${loading}...` : null;
  const placeholderDictation = listening ? 'Listening...' : null;
  const placeholder =
    placeholderPromptMatching ||
    placeholderDictation ||
    t('typeInstructionsToFillTheForm');

  const MicrophoneIconButton = listening ? (
    <span>X</span>
  ) : (
    <MicrophoneIcon aria-hidden="true" />
  );
  const microphoneLabel = speechSupported
    ? `${t('record')} :)`
    : 'Not supported in your browser';

  const textAreaValue = listening ? transcript : userInput;

  return (
    <div className={`ai-modal-container ${containerActivatedClassName}`}>
      {!initialised ? (
        <div className="activate-button">
          {activateButton}
          {LoadingInit}
        </div>
      ) : (
        <>
          <div className="chat-content">
            {chatMessages.map((message, index) => {
              return (
                <ChatMessage chatMessage={message} index={index} key={index} />
              );
            })}
          </div>
          <div className="chat-input">
            <div className="input-wrapper">
              <textarea
                className="field__input input-text"
                // disabled={!!loading || !initialised}
                name="ai-modal-prompt"
                onChange={(e) => {
                  setUserInput(e.target.value);
                }}
                placeholder={placeholder}
                value={textAreaValue}
              />
              <div className="buttons-wrapper">
                <Button
                  disabled={!initialised || !!loading || !speechSupported}
                  icon={MicrophoneIconButton}
                  label={microphoneLabel}
                  onClick={() => {
                    void onMicrophoneClick();
                  }}
                />
                {/* <Button
                  disabled={!initialised || !!loading}
                  icon={<ArrowRightIcon aria-hidden="true" />}
                  label={t('send')}
                  onClick={() => {
                    void onTranscriptSend();
                  }}
                  visible={!!listening}
                /> */}
                <Button
                  disabled={!initialised || !!loading || !textAreaValue}
                  icon={<ArrowRightIcon aria-hidden="true" />}
                  label={t('send')}
                  onClick={() => {
                    void onChatSend(textAreaValue);
                  }}
                  visible={true}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
