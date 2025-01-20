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
  InfoLabel,
} from '@fluentui/react-components';
import { NavigationBar } from './NavigationBar';
import { ExcelFileRegistration, AlreadyRegisteredError } from '../services/excel/registration';

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
  },
  errorMessage: {
    color: tokens.colorStatusDangerForeground1,
    backgroundColor: tokens.colorStatusDangerBackground1,
    ...shorthands.padding('8px'),
    ...shorthands.borderRadius('4px'),
    marginBottom: '8px',
  },
  existingUuid: {
    fontFamily: 'monospace',
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding('4px', '8px'),
    ...shorthands.borderRadius('4px'),
    display: 'inline-block',
    marginTop: '4px',
  }
});

const DeveloperPanel = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  const styles = useStyles();
  const [result, setResult] = useState<string>('Results will appear here...');
  const [errorInfo, setErrorInfo] = useState<{ message: string; uuid?: string } | null>(null);

  const handleRegisterFile = async () => {
    try {
      setErrorInfo(null); // Clear any previous errors
      const metadata = await ExcelFileRegistration.registerFile();
      setResult(JSON.stringify(metadata, null, 2));
    } catch (error) {
      if (error instanceof AlreadyRegisteredError) {
        setErrorInfo({
          message: error.message,
          uuid: error.existingUuid
        });
        setResult('File registration failed - see error above');
      } else {
        setErrorInfo({
          message: error instanceof Error ? error.message : String(error)
        });
        setResult('An unexpected error occurred - see error above');
      }
    }
  };

  const handleGetMetadata = async () => {
    try {
      setErrorInfo(null); // Clear any previous errors
      const metadata = await ExcelFileRegistration.getFileMetadata();
      setResult(JSON.stringify(metadata, null, 2));
    } catch (error) {
      setErrorInfo({
        message: error instanceof Error ? error.message : String(error)
      });
      setResult('An error occurred while fetching metadata - see error above');
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

        {errorInfo && (
          <div className={styles.errorMessage}>
            <Text weight="semibold">{errorInfo.message}</Text>
            {errorInfo.uuid && (
              <div>
                <Text>Existing UUID:</Text>
                <div className={styles.existingUuid}>{errorInfo.uuid}</div>
              </div>
            )}
          </div>
        )}

        <InfoLabel htmlFor="resultArea">Results:</InfoLabel>
        <Textarea 
          id="resultArea"
          className={styles.resultArea}
          value={result}
          readOnly
        />
      </Card>
    </div>
  );
};

interface DeveloperPanelProps {
  onNavigate: (view: string) => void;
}

// Export at the bottom
export {
  DeveloperPanel,
  // If you had any additional types or interfaces you wanted to expose, they would go here
  type DeveloperPanelProps,
};