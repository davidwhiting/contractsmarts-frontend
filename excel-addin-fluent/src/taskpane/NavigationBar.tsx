// src/taskpane/NavigationBar.tsx
import {
  makeStyles,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbDivider,
} from '@fluentui/react-components';
import {
  Home24Regular,
  ChatBubblesQuestion24Regular,
  AppsListDetail24Regular,
  CheckmarkCircle24Regular,
  QuestionCircle24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  navBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 16px',
    borderBottom: '1px solid var(--colorNeutralStroke1)',
    backgroundColor: 'var(--colorNeutralBackground1)',
  },
  iconButtons: {
    display: 'flex',
    gap: '8px',
  },
  smallButton: {
    minWidth: 'auto',
    padding: '4px',
  },
});

interface NavigationBarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const NavigationBar = ({ currentView, onNavigate }: NavigationBarProps) => {
  const styles = useStyles();

  const viewNames: Record<string, string> = {
    documentChat: 'Document Chat',
    modelManager: 'Model Manager',
    modelValidate: 'Model Validate',
    support: 'Support',
  };

  return (
    <div className={styles.navBar}>
      <Breadcrumb>
        <BreadcrumbItem>
          <Button
            icon={<Home24Regular />}
            appearance="subtle"
            onClick={() => onNavigate('main')}
          />
        </BreadcrumbItem>
        <BreadcrumbDivider />
        <BreadcrumbItem>
          {viewNames[currentView]}
        </BreadcrumbItem>
      </Breadcrumb>
      <div className={styles.iconButtons}>
        {currentView !== 'modelManager' && (
          <Button
            className={styles.smallButton}
            icon={<AppsListDetail24Regular />}
            appearance="subtle"
            onClick={() => onNavigate('modelManager')}
          />
        )}
        {currentView !== 'modelValidate' && (
          <Button
            className={styles.smallButton}
            icon={<CheckmarkCircle24Regular />}
            appearance="subtle"
            onClick={() => onNavigate('modelValidate')}
          />
        )}
        {currentView !== 'modelAlign' && (
          <Button
            className={styles.smallButton}
            icon={<CheckmarkCircle24Regular />}
            appearance="subtle"
            onClick={() => onNavigate('modelAlign')}
          />
        )}        
        {currentView !== 'documentChat' && (
          <Button
            className={styles.smallButton}
            icon={<ChatBubblesQuestion24Regular />}
            appearance="subtle"
            onClick={() => onNavigate('documentChat')}
          />
        )}
        {currentView !== 'support' && (
          <Button
            className={styles.smallButton}
            icon={<QuestionCircle24Regular />}
            appearance="subtle"
            onClick={() => onNavigate('support')}
          />
        )}
      </div>
    </div>
  );
};
