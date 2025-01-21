// src/taskpane/Taskpane.tsx
import { useEffect, useState } from 'react';
import { FluentProvider, webLightTheme, Body1 } from '@fluentui/react-components';
import { DocumentChat } from './DocumentChat';
import { MainMenu } from './MainMenu';
import { ModelManager } from './ModelManager';
import { ModelValidate } from './ModelValidate';
import { ModelAlign } from './ModelAlign';
import { Support } from './Support';
import { DeveloperPanel } from './DeveloperPanel';
import { FileStatusIndicator, RegistrationDialog } from './FileStatusComponents';
import { ExcelFileRegistration } from '../services/excel/registration';

const Taskpane = () => {
  const [isOfficeInitialized, setIsOfficeInitialized] = useState(false);
  const [currentView, setCurrentView] = useState('main');
  const [fileStatus, setFileStatus] = useState<'untracked' | 'tracked' | 'ignored'>('untracked');
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  const [globalDontAskAgain, setGlobalDontAskAgain] = useState(false);
  const [isFileEmpty, setIsFileEmpty] = useState(true);

  // Check if the file is empty
  const checkIfFileEmpty = async () => {
    try {
      return await Excel.run(async (context) => {
        const sheets = context.workbook.worksheets;
        sheets.load('items');
        await context.sync();

        for (const sheet of sheets.items) {
          const range = sheet.getUsedRange();
          range.load('address');
          await context.sync();
          
          if (range.address) {
            return false;
          }
        }
        return true;
      });
    } catch (error) {
      console.error('Error checking file emptiness:', error);
      return true;
    }
  };

  // Check file registration status
  const checkFileRegistration = async () => {
    try {
      const isEmpty = await checkIfFileEmpty();
      setIsFileEmpty(isEmpty);

      const metadata = await ExcelFileRegistration.getFileMetadata();
      if (metadata) {
        setFileStatus(metadata.status);
      } else if (!isEmpty && !globalDontAskAgain) {
        setShowRegistrationDialog(true);
      }
    } catch (error) {
      console.error('Error checking file registration:', error);
      setFileStatus('untracked');
    }
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const handleRegistrationConfirm = async (dontAskAgain: boolean) => {
    try {
      await ExcelFileRegistration.registerFile();
      setFileStatus('tracked');
      setGlobalDontAskAgain(dontAskAgain);
      setShowRegistrationDialog(false);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleTrackFile = async () => {
    await handleRegistrationConfirm(false);
  };

  const handleIgnoreFile = async () => {
    try {
      await ExcelFileRegistration.ignoreFile();
      setFileStatus('ignored');
      setShowRegistrationDialog(false);
    } catch (error) {
      console.error('Failed to ignore file:', error);
    }
  };

  useEffect(() => {
    const handleWorkbookSaved = () => {
      if (isFileEmpty) {
        checkFileRegistration();
      }
    };

    Office.onReady((info) => {
      if (info.host === Office.HostType.Excel) {
        setIsOfficeInitialized(true);
        checkFileRegistration();

        // Add event listener for file save
        Office.context.document.addHandlerAsync(
          Office.EventType.DocumentSelectionChanged,
          handleWorkbookSaved
        );
      }
    });

    return () => {
      if (Office?.context?.document) {
        Office.context.document.removeHandlerAsync(
          Office.EventType.DocumentSelectionChanged,
          handleWorkbookSaved
        );
      }
    };
  }, [isFileEmpty]);

  const statusContainerStyle = {
    position: 'fixed' as const,
    top: '12px',
    right: '12px',
    zIndex: 1000,
  };

  if (!isOfficeInitialized) {
    return (
      <FluentProvider theme={webLightTheme}>
        <div style={{ padding: '20px' }}>
          <Body1>Loading Office JS...</Body1>
        </div>
      </FluentProvider>
    );
  }

  return (
    <FluentProvider theme={webLightTheme}>
      <div style={{ 
        position: 'relative',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Status Indicator */}
        <div style={statusContainerStyle}>
          <FileStatusIndicator
            status={fileStatus}
            onTrack={handleTrackFile}
            onIgnore={handleIgnoreFile}
          />
        </div>

        {/* Registration Dialog */}
        <RegistrationDialog
          isOpen={showRegistrationDialog}
          onClose={() => setShowRegistrationDialog(false)}
          onConfirm={handleRegistrationConfirm}
        />

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          {currentView === 'main' && <MainMenu onNavigate={handleNavigate} />}
          {currentView === 'modelManager' && <ModelManager onNavigate={handleNavigate} />}
          {currentView === 'modelValidate' && <ModelValidate onNavigate={handleNavigate} />}
          {currentView === 'modelAlign' && <ModelAlign onNavigate={handleNavigate} />}
          {currentView === 'documentChat' && <DocumentChat onNavigate={handleNavigate} />}
          {currentView === 'support' && <Support onNavigate={handleNavigate} />}
          {currentView === 'developer' && <DeveloperPanel onNavigate={handleNavigate} />}
        </div>
      </div>
    </FluentProvider>
  );
};

export {
  Taskpane
};