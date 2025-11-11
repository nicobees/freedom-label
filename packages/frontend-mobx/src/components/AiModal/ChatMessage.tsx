import type { AiMessage, AiMessageVariants } from '../../hooks/useAutoFill';

import './chatMessage.css';

const generateHash = (input: string) => {
  let hash = 0;
  for (const char of input) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0; // Constrain to 32bit integer
  }
  return hash;
};

const typeIconMapping: Partial<Record<AiMessageVariants, string>> = {
  error: '❌',
  example: '💡',
  match: '✅',
  transcript: '🗣️',
};

const ContentWithShowExamplesAction = ({
  content,
  onClick,
}: {
  content: string;
  onClick: () => void;
}) => {
  const actionLabel = '🔻 Click here to see some examples 🔻';

  return (
    <div>
      {content}
      <div className="chat-message-show-examples-action" onClick={onClick}>
        {actionLabel}
      </div>
    </div>
  );
};

export const ChatMessage = ({
  errorHandler,
  index,
  message,
}: {
  errorHandler?: () => void;
  index: number;
  message: AiMessage;
}) => {
  const { content, type } = message;

  const parsedKey = `${index}-${generateHash(content)}`;

  const iconType = typeIconMapping[type] || null;

  const computedContent =
    type !== 'error' ? (
      content
    ) : (
      <ContentWithShowExamplesAction
        content={content}
        onClick={errorHandler || (() => {})}
      />
    );

  return (
    <div className={`chat-message chat-message-${type}`} key={parsedKey}>
      {computedContent}
      {iconType ? <span className="chat-message-icon">{iconType}</span> : null}
    </div>
  );
};
