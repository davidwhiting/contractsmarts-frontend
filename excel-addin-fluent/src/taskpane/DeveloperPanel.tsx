// src/taskpane/DeveloperPanel.tsx
import { useState } from 'react';
import {
  Card,
  Button,
  Text,
  makeStyles,
  shorthands,
  tokens,
  Textarea,
} from '@fluentui/react-components';
import { NavigationBar } from './NavigationBar';
import { ExcelFileRegistration } from '../services/excel/registration';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
    ...shorthands.padding('20px'),
  },
  resultArea: {
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding('12px'),
    ...shorthands.borderRadius('4px'),
    minHeight: '200px',
    overflowY: 'auto',
  }
});

export const DeveloperPanel = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  const styles = useStyles();
  const [result, setResult] = useState<string>('Results will appear here...');

  const handleRegisterFile = async () => {
    try {
      const metadata = await ExcelFileRegistration.registerFile();
      setResult(JSON.stringify(metadata, null, 2));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleGetMetadata = async () => {
    try {
      const metadata = await ExcelFileRegistration.getFileMetadata();
      setResult(JSON.stringify(metadata, null, 2));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className={styles.container}>
      <NavigationBar currentView="developer" onNavigate={onNavigate} />
      <Card className={styles.content}>
        <Text size={500}>Developer Testing Panel</Text>
        
        <Button appearance="primary" onClick={handleRegisterFile}>
          Register Current File
        </Button>

        <Button onClick={handleGetMetadata}>
          Get File Metadata
        </Button>

        <Text weight="semibold">Results:</Text>
        <Textarea 
          className={styles.resultArea}
          value={result}
          readOnly
        />
      </Card>
    </div>
  );
};

