import './chatMessage.css';

const generateHash = (input: string) => {
  let hash = 0;
  for (const char of input) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0; // Constrain to 32bit integer
  }
  return hash;
};

export type ChatMessageType<
  T extends ChatMessageVariants = ChatMessageVariants,
> = {
  content: string;
  type: T;
};

type ChatMessageVariants = 'system' | 'transcript' | 'user';

export const createChatMessage = <T extends ChatMessageVariants>(
  content: string,
  type: T,
): ChatMessageType<T> => {
  return { content, type };
};

export const ChatMessage = ({
  chatMessage,
  index,
}: {
  chatMessage: ChatMessageType;
  index: number;
}) => {
  const { content, type } = chatMessage;

  const parsedKey = `${index}-${generateHash(content)}`;

  return (
    <div className={`chat-message chat-message-${type}`} key={parsedKey}>
      {content}
    </div>
  );
};
