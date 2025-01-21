// src/taskpane/ModelManager.tsx
import { Card, Text, makeStyles, shorthands } from '@fluentui/react-components';
import { NavigationBar } from './NavigationBar';
import { ModelAlignProps } from './ModelAlign';

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

interface ModelManagerProps {
  onNavigate: (view: string) => void;
}

const ModelManager = ({ onNavigate }: ModelManagerProps) => {
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

export {
  ModelManager,
  type ModelManagerProps,
}