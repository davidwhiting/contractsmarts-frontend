// src/taskpane/ModelAlign.tsx
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

interface ModelAlignProps {
  onNavigate: (view: string) => void;
}

const ModelAlign = ({ onNavigate }: ModelAlignProps) => {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      <NavigationBar currentView="modelAlign" onNavigate={onNavigate} />
      <Card className={styles.content}>
        <Text>This is model align</Text>
      </Card>
    </div>
  );
};

export {
  ModelAlign,
  type ModelAlignProps,
};