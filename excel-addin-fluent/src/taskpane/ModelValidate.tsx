// src/taskpane/ModelValidate.tsx
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

interface ModelValidateProps {
  onNavigate: (view: string) => void;
}

const ModelValidate = ({ onNavigate }: ModelValidateProps) => {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      <NavigationBar currentView="modelValidate" onNavigate={onNavigate} />
      <Card className={styles.content}>
        <Text>This is model validate</Text>
      </Card>
    </div>
  );
};

export {
  ModelValidate,
  type ModelValidateProps,
};