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
import { SpeechToTextExtractor } from './transcribe';

type AiModalProps = Pick<UseAutoFillProps, 'autoFillFormCallback'>;

// const filterBoolean = <T,>(item: null | T | undefined): item is T => {
//   return !!item;
// };

const speechExtractor = new SpeechToTextExtractor();

// const temp2 = `Marco Verdi needs right lens, material is F2mid and it is a scleral lens. The lenses needs to be ready by 15th of March 2026.
// It has power of -1.73, diameter of 3. It also needs a toric base curve of 2.1, while axis is 180. It also needs toric saggital of 749 only on right lens.
// Production batch is late-2025.`;
// const temp3 = `I want left lens for A Rossi. It has base curve of 1.24 and diameter of 2.24. Batch is late 2025`;

export const AiModal = ({ autoFillFormCallback }: AiModalProps) => {
  const { t } = useTranslation();
  const [aiModeActive, setAiModeActive] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]);
  const { initialised, initProgress, loading, prompt } = useAutoFill({
    autoFillFormCallback,
    enabled: aiModeActive,
  });

  const [userInput, setUserInput] = useState('');

  const temp = useCallback(async () => {
    const transcribedText = await speechExtractor.startListening(
      (interim) => console.log('Interim:', interim),
      (final) => console.log('Final:', final),
    );

    console.log('Transcribed:', transcribedText);
  }, []);

  const onChatSend = useCallback(async () => {
    const newUserInput = createChatMessage(userInput, 'user');
    setChatMessages((prev) => [newUserInput, ...prev]);
    setUserInput('');

    const llmAnswer = await prompt(userInput);
    const newSystemInput = createChatMessage(
      llmAnswer || 'No answer from llm',
      'system',
    );
    setChatMessages((prev) => [newSystemInput, ...prev]);
  }, [prompt, setChatMessages, userInput]);

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

  const placeholder = loading
    ? `${loading}...`
    : t('typeInstructionsToFillTheForm');

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
                value={userInput}
              />
              <div className="buttons-wrapper">
                <Button
                  disabled={!initialised || !!loading}
                  icon={<MicrophoneIcon aria-hidden="true" />}
                  label={`${t('record')} :)`}
                  onClick={() => {
                    void temp();
                  }}
                />
                <Button
                  disabled={!initialised || !!loading}
                  icon={<ArrowRightIcon aria-hidden="true" />}
                  label={t('send')}
                  onClick={() => {
                    void onChatSend();
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
