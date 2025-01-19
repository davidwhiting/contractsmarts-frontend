// DocumentChat.tsx
import { useState, useEffect } from 'react';
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
import { Send24Regular, OpenRegular } from '@fluentui/react-icons';
import { NavigationBar } from './NavigationBar';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.padding('8px', '16px'),
    backgroundColor: tokens.colorNeutralBackground1,
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
  const [popupWindow, setPopupWindow] = useState<Window | null>(null);

  useEffect(() => {
    // Listen for messages from popup window
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'REQUEST_MESSAGES') {
        event.source?.postMessage({
          type: 'UPDATE_MESSAGES',
          messages
        }, '*');
      } else if (event.data.type === 'SEND_MESSAGE') {
        handleSendMessage(event.data.message);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [messages]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: text,
      sender: 'user',
    };

    // Add bot response
    const botMessage: Message = {
      id: Date.now() + 1,
      text: `Thank you for your input. Message ${messageCounter}`,
      sender: 'bot',
    };

    const newMessages = [...messages, userMessage, botMessage];
    setMessages(newMessages);
    setMessageCounter(messageCounter + 1);

    // Update popup window if it exists
    if (popupWindow && !popupWindow.closed) {
      popupWindow.postMessage({
        type: 'UPDATE_MESSAGES',
        messages: newMessages
      }, '*');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
      setInputText('');
    }
  };

  const openPopupWindow = () => {
    const width = 800;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const popup = window.open(
      '/popup.html',
      'DocumentChat',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );

    if (popup) {
      setPopupWindow(popup);
      popup.focus();
    }
  };

  return (
    <div className={styles.container}>
      <NavigationBar currentView="documentChat" onNavigate={onNavigate} />
      <div className={styles.header}>
        <Text size={500}>Document Chat</Text>
        <Button
          appearance="subtle"
          icon={<OpenRegular />}
          onClick={openPopupWindow}
        >
          Open in Window
        </Button>
      </div>
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
          onClick={() => {
            handleSendMessage(inputText);
            setInputText('');
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default DocumentChat;