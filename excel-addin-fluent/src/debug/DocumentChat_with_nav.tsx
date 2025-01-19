import { useState } from 'react';
import {
  FluentProvider,
  webLightTheme,
  Card,
  Input,
  Button,
  makeStyles,
  shorthands,
  tokens,
  Text,
} from '@fluentui/react-components';
import { Send24Regular } from '@fluentui/react-icons';
import { NavigationBar } from './NavigationBar';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflowY: 'auto',
    ...shorthands.padding('12px'),
    backgroundColor: tokens.colorNeutralBackground2,
  },
  inputContainer: {
    display: 'flex',
    ...shorthands.padding('12px'),
    ...shorthands.gap('8px'),
    backgroundColor: tokens.colorNeutralBackground1,
  },
  messageContainer: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.margin('4px', '0'),
  },
  message: {
    ...shorthands.padding('8px', '12px'),
    ...shorthands.borderRadius('8px'),
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralBackground1,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: tokens.colorNeutralBackground4,
  },
});

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export const DocumentChat = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  const styles = useStyles();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [messageCounter, setMessageCounter] = useState(1);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
    };

    // Add bot response
    const botMessage: Message = {
      id: Date.now() + 1,
      text: `Thank you for your input. Message ${messageCounter}`,
      sender: 'bot',
    };

    setMessages([...messages, userMessage, botMessage]);
    setMessageCounter(messageCounter + 1);
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={styles.container}>
      <NavigationBar currentView="documentChat" onNavigate={onNavigate} />
      <Card className={styles.chatContainer}>
        {messages.map((message) => (
          <div key={message.id} className={styles.messageContainer}>
            <div
              className={`${styles.message} ${
                message.sender === 'user' ? styles.userMessage : styles.botMessage
              }`}
            >
              <Text>{message.text}</Text>
            </div>
          </div>
        ))}
      </Card>
      <div className={styles.inputContainer}>
        <Input
          value={inputText}
          onChange={(e, data) => setInputText(data.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          style={{ flexGrow: 1 }}
        />
        <Button
          appearance="primary"
          icon={<Send24Regular />}
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default DocumentChat;
