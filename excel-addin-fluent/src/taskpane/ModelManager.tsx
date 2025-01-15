// src/taskpane/ModelManager.tsx
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

export const ModelManager = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      <NavigationBar currentView="modelManager" onNavigate={onNavigate} />
      <Card className={styles.content}>
        <Text>This is model manager</Text>
      </Card>
    </div>
  );
};

