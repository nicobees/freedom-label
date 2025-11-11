import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import './aiModal.css';
import ArrowRightIcon from '../../assets/icons/arrow-right.svg?react';
import MicrophoneIcon from '../../assets/icons/microphone.svg?react';
import {
  type AiMessage,
  useAutoFill,
  type UseAutoFillProps,
} from '../../hooks/useAutoFill';
import { i18n } from '../../i18n';
import { examplePrompts } from '../../services/auto-fill-form/constants';
import { Button, type ButtonProps } from '../atoms/Button/Button';
import { ChatMessage } from './ChatMessage';
import { useSpeechService } from './useSpeechService';

const ActivateSection = ({
  disabled,
  loadingMessage,
  onClick,
}: {
  disabled: boolean;
  loadingMessage: null | string;
  onClick: () => void;
}) => {
  const { t } = useTranslation();
  const label = i18n.format(t('ai'), 'uppercase');

  return (
    <div className="activate-button">
      <Button disabled={disabled} label={label} onClick={onClick} />
      {loadingMessage ? <div>{`${loadingMessage}`}</div> : null}
    </div>
  );
};

type MicrophoneButtonProps = Pick<ButtonProps, 'disabled'> & {
  browserSupported: boolean;
  disabled: boolean;
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
};

const MicrophoneButton = ({
  browserSupported,
  disabled,
  isListening,
  onStartListening,
  onStopListening,
}: MicrophoneButtonProps) => {
  const { t } = useTranslation();
  const MicrophoneIconButton = isListening ? (
    <span>X</span>
  ) : (
    <MicrophoneIcon aria-hidden="true" />
  );

  const label = browserSupported
    ? `${t('record')} :)`
    : t('notSupportedInYourBrowser');

  return (
    <Button
      disabled={disabled}
      icon={MicrophoneIconButton}
      label={label}
      onClick={() => {
        if (isListening) {
          void onStopListening();
          return;
        }
        void onStartListening();
      }}
    />
  );
};

type AiModalProps = Pick<UseAutoFillProps, 'autoFillFormCallback'>;

export const AiModal = ({ autoFillFormCallback }: AiModalProps) => {
  const { t } = useTranslation();
  const [userInput, setUserInput] = useState('');
  const [chatMessages, setChatMessages] = useState<AiMessage[]>([]);

  const { deactivate, init, initialised, initProgress, loading, prompt } =
    useAutoFill({
      autoFillFormCallback,
    });

  useEffect(() => {
    return () => {
      deactivate();
    };
  }, [deactivate]);

  const {
    listening,
    speechSupported,
    startListening,
    stopListening,
    transcript,
  } = useSpeechService();

  const onChatSend = useCallback(
    async (input: string) => {
      if (!input) {
        return;
      }
      const userMessageType = listening ? 'transcript' : 'user';
      setChatMessages((prev) => [
        { content: input, type: userMessageType },
        ...prev,
      ]);
      setUserInput('');

      if (listening) {
        stopListening();
      }

      const aiMessages = await prompt(input);
      const reversedAiMessages = aiMessages.toReversed();
      setChatMessages((prev) => [...reversedAiMessages, ...prev]);
    },
    [listening, prompt, stopListening],
  );

  const addExamplePromptsMessage = useCallback(() => {
    const infoMessagesExamples = [
      `- ${examplePrompts[0]}`,
      `- ${examplePrompts[1]}`,
      `- ${examplePrompts[7]}`,
    ].join('\n');

    const message = { content: infoMessagesExamples, type: 'example' } as const;

    setChatMessages((prev) => [message, ...prev]);
  }, []);

  const computedPlaceholder = useMemo(() => {
    const placeholderPromptMatching = loading ? `${loading}...` : null;
    const placeholderDictation = listening ? 'Listening...' : null;

    return (
      placeholderPromptMatching ||
      placeholderDictation ||
      t('typeInstructionsToFillTheForm')
    );
  }, [listening, loading, t]);

  const computedInitLoadingMessage = useMemo(() => {
    const initProgressMessage =
      initProgress !== null && !!loading ? `(${initProgress}%)` : '';
    return !initialised && !!loading
      ? `${loading}...${initProgressMessage}`
      : null;
  }, [initialised, initProgress, loading]);

  const containerActivatedClassName = initialised ? ` initialised` : '';
  const textAreaValue = listening ? transcript : userInput;

  return (
    <div className={`ai-modal-container ${containerActivatedClassName}`}>
      {!initialised ? (
        <ActivateSection
          disabled={!!loading || initialised}
          loadingMessage={computedInitLoadingMessage}
          onClick={() => void init()}
        />
      ) : (
        <>
          <div className="chat-content">
            {chatMessages.map((message, index) => {
              return (
                <ChatMessage
                  errorHandler={() => addExamplePromptsMessage()}
                  index={index}
                  key={index}
                  message={message}
                />
              );
            })}
          </div>
          <div className="chat-input">
            <div className="input-wrapper">
              <textarea
                className="field__input input-text"
                name="ai-modal-prompt"
                onChange={(e) => {
                  setUserInput(e.target.value);
                }}
                placeholder={computedPlaceholder}
                value={textAreaValue}
              />
              <div className="buttons-wrapper">
                <MicrophoneButton
                  browserSupported={speechSupported}
                  disabled={!initialised || !!loading || !speechSupported}
                  isListening={listening}
                  onStartListening={() => void startListening()}
                  onStopListening={() => void stopListening()}
                />
                <Button
                  disabled={!initialised || !!loading || !textAreaValue}
                  icon={<ArrowRightIcon aria-hidden="true" />}
                  label={t('send')}
                  onClick={() => {
                    void onChatSend(textAreaValue);
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
