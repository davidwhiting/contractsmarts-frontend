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
  Input,
  TabList,
  Tab,
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
    maxHeight: '200px',
    overflowY: 'auto',
    fontFamily: 'monospace',
  },
  debugArea: {
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding('12px'),
    ...shorthands.borderRadius('4px'),
    height: '150px',
    overflowY: 'auto',
    fontFamily: 'monospace',
    fontSize: '12px',
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
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },
  buttonGroup: {
    display: 'flex',
    ...shorthands.gap('8px'),
  }
});

const log = async (message: string) => {
  console.log(message);
  await Excel.run(async (context) => {
    const logXml = `<log time="${new Date().toISOString()}">${message}</log>`;
    context.workbook.customXmlParts.add(logXml);
    await context.sync();
  });
  Office.context.document.settings.set("debug_log", message);
  await Office.context.document.settings.saveAsync();
};

const DeveloperPanel = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  const styles = useStyles();
  const [result, setResult] = useState<string>('Results will appear here...');
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [errorInfo, setErrorInfo] = useState<{ message: string; uuid?: string } | null>(null);
  const [metadataInput, setMetadataInput] = useState('');
  const [fieldNameInput, setFieldNameInput] = useState('');
  const localLog = (message: string) => {
    setDebugLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
    log(message);
  };

  const handleRegisterFile = async () => {
    try {
      localLog('Attempting to register file...');

      const metadata = await ExcelFileRegistration.registerFile();
      localLog('File registered successfully');      
      setResult(JSON.stringify(metadata, null, 2));
    } catch (error) {
      localLog(`Registration error: ${error instanceof Error ? error.message : String(error)}`);

      if (error instanceof AlreadyRegisteredError) {
        setErrorInfo({
          message: error.message,
          uuid: error.existingUuid
        });
      } else {
        setErrorInfo({
          message: error instanceof Error ? error.message : String(error)
        });
      }
    }
  };

  const handleGetMetadata = async () => {
    try {
      setErrorInfo(null);
      const metadata = await ExcelFileRegistration.getFileMetadata();
      setResult(JSON.stringify(metadata, null, 2));
    } catch (error) {
      setErrorInfo({
        message: error instanceof Error ? error.message : String(error)
      });
    }
  };

  const handleUpdateMetadata = async () => {
    try {
      setErrorInfo(null);
      let parsedMetadata;
      try {
        parsedMetadata = JSON.parse(metadataInput);
      } catch {
        throw new Error('Invalid JSON input');
      }
      const updatedMetadata = await ExcelFileRegistration.updateFileMetadata(parsedMetadata);
      setResult(JSON.stringify(updatedMetadata, null, 2));
      setMetadataInput('');
    } catch (error) {
      setErrorInfo({
        message: error instanceof Error ? error.message : String(error)
      });
    }
  };

  const handleReadField = async () => {
    try {
      setErrorInfo(null);
      const metadata = await ExcelFileRegistration.getFileMetadata();
      if (!metadata) {
        throw new Error('No metadata found');
      }
      const value = metadata[fieldNameInput as keyof typeof metadata];
      setResult(JSON.stringify({ [fieldNameInput]: value }, null, 2));
      setFieldNameInput('');
    } catch (error) {
      setErrorInfo({
        message: error instanceof Error ? error.message : String(error)
      });
    }
  };

  return (
    <div className={styles.container}>
      <NavigationBar currentView="developer" onNavigate={onNavigate} />
      <Card className={styles.content}>
        <Text size={500}>Developer Testing Panel</Text>
        
        <div className={styles.buttonGroup}>
          <Button appearance="primary" onClick={handleRegisterFile}>
            Register File
          </Button>
          <Button onClick={handleGetMetadata}>
            Get All Metadata
          </Button>
        </div>

        <div className={styles.inputGroup}>
          <InfoLabel>Write Metadata (JSON format):</InfoLabel>
          <Textarea 
            value={metadataInput}
            onChange={(e, data) => setMetadataInput(data.value)}
            placeholder='{"status": "tracked", "customField": "value"}'
          />
          <Button onClick={handleUpdateMetadata}>Update Metadata</Button>
        </div>

        <div className={styles.inputGroup}>
          <InfoLabel>Read Specific Field:</InfoLabel>
          <Input
            value={fieldNameInput}
            onChange={(e, data) => setFieldNameInput(data.value)}
            placeholder="Enter field name (e.g. status)"
          />
          <Button onClick={handleReadField}>Read Field</Button>
        </div>
        
        <InfoLabel>Debug Logs:</InfoLabel>
        <div className={styles.debugArea}>
          {debugLogs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>

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

export default DeveloperPanel;