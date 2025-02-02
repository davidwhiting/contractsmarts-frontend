// src/taskpane/MainMenu.tsx
import {
  Card,
  Button,
  makeStyles,
  shorthands,
  Title3,
} from '@fluentui/react-components';
import {
  ChatBubblesQuestion24Regular,
  AppsListDetail24Regular,
  CheckmarkCircle24Regular,
  QuestionCircle24Regular,
  Wrench24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
    ...shorthands.padding('20px'),
  },
  menuButton: {
    height: '48px',
    justifyContent: 'flex-start',
    ...shorthands.padding('12px'),
  },
  buttonIcon: {
    marginRight: '8px',
  },
  devButton: {
    marginTop: 'auto', // This will push the dev button to the bottom
  }
});

interface MainMenuProps {
  onNavigate: (view: string) => void;
}

export const MainMenu = ({ onNavigate }: MainMenuProps) => {
  const styles = useStyles();

  // Only show developer button in development
  const isDevelopment = import.meta.env.MODE === 'development';

  return (
    <Card className={styles.container}>
      <Title3>ContractSmarts</Title3>
      <Button 
        className={styles.menuButton}
        appearance="subtle"
        icon={<ChatBubblesQuestion24Regular className={styles.buttonIcon} />}
        onClick={() => onNavigate('documentChat')}
      >
        Document Chat
      </Button>
      <Button 
        className={styles.menuButton}
        appearance="subtle"
        icon={<AppsListDetail24Regular className={styles.buttonIcon} />}
        onClick={() => onNavigate('modelManager')}
      >
        Model Manager
      </Button>
      <Button 
        className={styles.menuButton}
        appearance="subtle"
        icon={<CheckmarkCircle24Regular className={styles.buttonIcon} />}
        onClick={() => onNavigate('modelValidate')}
      >
        Model Validate
      </Button>
      <Button 
        className={styles.menuButton}
        appearance="subtle"
        icon={<QuestionCircle24Regular className={styles.buttonIcon} />}
        onClick={() => onNavigate('support')}
      >
        Support
      </Button>

      {isDevelopment && (
        <Button 
          className={`${styles.menuButton} ${styles.devButton}`}
          appearance="subtle"
          icon={<Wrench24Regular className={styles.buttonIcon} />}
          onClick={() => onNavigate('developer')}
        >
          Developer Tools
        </Button>
      )}

    </Card>
  );
};
