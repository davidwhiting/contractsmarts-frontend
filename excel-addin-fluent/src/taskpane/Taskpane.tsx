// src/taskpane/Taskpane.tsx
import { useEffect, useState } from 'react';
import { FluentProvider, webLightTheme, Body1 } from '@fluentui/react-components';
import { DocumentChat } from './DocumentChat';
import { MainMenu } from './MainMenu';
import { ModelManager } from './ModelManager';
import { ModelValidate } from './ModelValidate';
import { Support } from './Support';

export const Taskpane = () => {
  const [isOfficeInitialized, setIsOfficeInitialized] = useState(false);
  const [currentView, setCurrentView] = useState('main');

  useEffect(() => {
    Office.onReady((info) => {
      if (info.host === Office.HostType.Excel) {
        setIsOfficeInitialized(true);
      }
    });
  }, []);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
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
      {currentView === 'main' && <MainMenu onNavigate={handleNavigate} />}
      {currentView === 'documentChat' && <DocumentChat onNavigate={handleNavigate} />}
      {currentView === 'modelManager' && <ModelManager onNavigate={handleNavigate} />}
      {currentView === 'modelValidate' && <ModelValidate onNavigate={handleNavigate} />}
      {currentView === 'support' && <Support onNavigate={handleNavigate} />}
    </FluentProvider>
  );
};
