// PopupChat.tsx
import React, { useEffect } from 'react';
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
import { Send24Regular, Dismiss24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.padding('8px', '16px'),
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
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
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
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

const PopupChat = () => {
  const styles = useStyles();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputText, setInputText] = React.useState('');

  useEffect(() => {
    // Listen for messages from the parent window
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'UPDATE_MESSAGES') {
        setMessages(event.data.messages);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Request initial messages from parent window
    window.opener.postMessage({ type: 'REQUEST_MESSAGES' }, '*');

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Send message to parent window to handle
    window.opener.postMessage({
      type: 'SEND_MESSAGE',
      message: inputText
    }, '*');

    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    window.close();
  };

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Text size={500}>Document Chat</Text>
          <Button
            appearance="subtle"
            icon={<Dismiss24Regular />}
            onClick={handleClose}
          />
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
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </div>
      </div>
    </FluentProvider>
  );
};

export default PopupChat;