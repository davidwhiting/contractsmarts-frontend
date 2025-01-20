// src/taskpane/Support.tsx
import { Card, Text, makeStyles, shorthands } from '@fluentui/react-components';
import { NavigationBar } from './NavigationBar';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  content: {
    ...shorthands.padding('20px'),
  },
});

interface SupportProps {
  onNavigate: (view: string) => void;
}

const Support = ({ onNavigate }: SupportProps) => {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      <NavigationBar currentView="support" onNavigate={onNavigate} />
      <Card className={styles.content}>
        <Text>This is support</Text>
      </Card>
    </div>
  );
};

export {
  Support,
  type SupportProps,
};