import { useEffect, useState } from 'react';
import { FluentProvider, webLightTheme, Body1 } from '@fluentui/react-components';
import { DocumentChat } from './DocumentChat';

export const Taskpane = () => {
  const [isOfficeInitialized, setIsOfficeInitialized] = useState(false);

  useEffect(() => {
    Office.onReady((info) => {
      if (info.host === Office.HostType.Excel) {
        setIsOfficeInitialized(true);
      }
    });
  }, []);

  if (!isOfficeInitialized) {
    return (
      <FluentProvider theme={webLightTheme}>
        <div style={{ padding: '20px' }}>
          <Body1>Loading Office JS...</Body1>
        </div>
      </FluentProvider>
    );
  }

  return <DocumentChat />;
};

//import { useEffect, useState } from 'react';
//import {
//  FluentProvider,
//  webLightTheme,
//  Button,
//  Title3,
//  Card,
//  CardHeader,
//  Body1,
//  Divider,
//} from '@fluentui/react-components';
//import { DocumentText24Regular, Send24Regular } from '@fluentui/react-icons';
//
//export const Taskpane = () => {
//  const [isOfficeInitialized, setIsOfficeInitialized] = useState(false);
//
//  useEffect(() => {
//    // Initialize Office JS
//    Office.onReady((info) => {
//      if (info.host === Office.HostType.Excel) {
//        setIsOfficeInitialized(true);
//      }
//    });
//  }, []);
//
//  const handleAnalyzeClick = async () => {
//    try {
//      await Excel.run(async (context) => {
//        const range = context.workbook.getSelectedRange();
//        range.load("address");
//        await context.sync();
//        
//        console.log(`Selected range: ${range.address}`);
//      });
//    } catch (error) {
//      console.error("Error:", error);
//    }
//  };
//
//  if (!isOfficeInitialized) {
//    return (
//      <FluentProvider theme={webLightTheme}>
//        <div style={{ padding: '20px' }}>
//          <Body1>Loading Office JS...</Body1>
//        </div>
//      </FluentProvider>
//    );
//  }
//
//  return (
//    <FluentProvider theme={webLightTheme}>
//      <div style={{ padding: '20px' }}>
//        <Card>
//          <CardHeader
//            header={
//              <Title3>
//                <DocumentText24Regular />
//                Excel Add-in
//              </Title3>
//            }
//          />
//          <div style={{ padding: '12px' }}>
//            <Body1>
//              Welcome to your Fluent UI Excel add-in. Select a range and click analyze
//              to get started.
//            </Body1>
//            <Divider style={{ margin: '12px 0' }} />
//            <Button
//              appearance="primary"
//              icon={<Send24Regular />}
//              onClick={handleAnalyzeClick}
//            >
//              Analyze Selection
//            </Button>
//          </div>
//        </Card>
//      </div>
//    </FluentProvider>
//  );
//};