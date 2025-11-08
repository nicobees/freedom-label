import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import './aiModal.css';
import ArrowRightIcon from '../../assets/icons/arrow-right.svg?react';
import MicrophoneIcon from '../../assets/icons/microphone.svg?react';
import { useAutoFill, type UseAutoFillProps } from '../../hooks/useAutoFill';
import { ActionButton } from '../atoms/Button/ActionButton';

type AiModalProps = Pick<UseAutoFillProps, 'autoFillFormCallback'>;

const filterBoolean = <T,>(item: null | T | undefined): item is T => {
  return !!item;
};

export const AiModal = ({ autoFillFormCallback }: AiModalProps) => {
  const { t } = useTranslation();
  const [aiModeActive, setAiModeActive] = useState(false);
  const [chatMessages, setChatMessages] = useState<string[]>([``]);
  const { initialised, prompt } = useAutoFill({
    autoFillFormCallback,
    enabled: aiModeActive,
  });
  const [userInput, setUserInput] =
    useState(`Marco Verdi needs right lens, material is F2mid and it is a scleral lens. The lenses needs to be ready by 15th of March 2026.
It has power of -1.73, diameter of 3. It also needs a toric base curve of 2.1, while axis is 180. It also needs toric saggital of 749 only on right lens.
Production batch is late-2025.`);

  const onChatSend = useCallback(async () => {
    const original = await prompt(userInput);
    const newChatMessages = [userInput, original || null].filter(filterBoolean);
    setChatMessages((prev) => [...prev, ...newChatMessages]);
    setUserInput('');
  }, [prompt, setChatMessages, userInput]);

  const activatedButton = (
    <ActionButton
      icon={<MicrophoneIcon aria-hidden="true" />}
      label={t('activateAiMode')}
      onClickHandler={() => setAiModeActive(true)}
    />
  );
  const label = 'How do you want to fill the form?';

  const activatedContent = (
    <>
      <div className="ai-modal-chat">
        {chatMessages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <div>
        <label className="field__label">
          <input
            className="field__input"
            name="ai-modal-prompt"
            onChange={(e) => {
              setUserInput(e.target.value);
            }}
            placeholder={label}
            value={userInput}
          />
        </label>
        <ActionButton
          icon={<ArrowRightIcon aria-hidden="true" />}
          label={t('send')}
          onClickHandler={() => {
            void onChatSend();
          }}
        />
      </div>
    </>
  );

  const content = !initialised ? activatedButton : activatedContent;

  return <div className="ai-modal-container">{content}</div>;
};
