// src/taskpane/FileStatusComponents.tsx
import React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  Button,
  makeStyles,
  tokens,
  Checkbox,
  Label,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from '@fluentui/react-components';

// Define file status types
type FileStatus = 'untracked' | 'tracked' | 'ignored';

const useStyles = makeStyles({
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 12px',
    borderRadius: '16px',
    fontWeight: 500,
    fontSize: '12px',
    cursor: 'pointer',
    border: 'none',
    '&:hover': {
      filter: 'brightness(95%)',
    },
  },
  tracked: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
    color: tokens.colorPaletteGreenForeground1,
  },
  untracked: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground1,
  },
  ignored: {
    backgroundColor: tokens.colorNeutralBackground4,
    color: tokens.colorNeutralForeground2,
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
    minWidth: '300px', // Ensure minimum width
  },
  dialogText: {
    maxWidth: '450px', // Maximum width for readability
    width: '100%',     // Take full width up to max
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '12px',
  }
});

interface FileStatusIndicatorProps {
  status: FileStatus;
  onTrack: () => void;
  onIgnore: () => void;
}

const FileStatusIndicator: React.FC<FileStatusIndicatorProps> = ({ 
  status, 
  onTrack, 
  onIgnore 
}) => {
  const handleTrack = async () => {
    console.log('Track button clicked');
    Office.context.document.settings.set("debug_log", "Track button clicked");
    await Office.context.document.settings.saveAsync();
    onTrack();
  };

  const handleIgnore = async () => {
    console.log('Ignore button clicked');
    Office.context.document.settings.set("debug_log", "Ignore button clicked");
    await Office.context.document.settings.saveAsync();
    onIgnore();
  };  
    const styles = useStyles();
  
    const getStatusStyle = () => {
      switch (status) {
        case 'tracked': return styles.tracked;
        case 'ignored': return styles.ignored;
        default: return styles.untracked;
      }
    };
  
    const getStatusLabel = () => {
      switch (status) {
        case 'tracked': return 'Tracked File';
        case 'ignored': return 'Ignored File';
        default: return 'Untracked File';
      }
    };
  
  return (
    <Menu>
      <MenuTrigger>
        <button className={`${styles.statusIndicator} ${getStatusStyle()}`}>
          {getStatusLabel()}
        </button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {status === 'untracked' && (
            <>
              <MenuItem onClick={handleTrack}>Track File</MenuItem>
              <MenuItem onClick={handleIgnore}>Ignore File</MenuItem>
            </>
          )}
          {status === 'tracked' && (
            <MenuItem onClick={handleIgnore}>Ignore File</MenuItem>
          )}
          {status === 'ignored' && (
            <MenuItem onClick={handleTrack}>Track File</MenuItem>
          )}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

interface RegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dontAskAgain: boolean) => void;
}

const RegistrationDialog: React.FC<RegistrationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const styles = useStyles();
  const [dontAskAgain, setDontAskAgain] = React.useState(false);

  const handleConfirm = () => {
    onConfirm(dontAskAgain);
  };

  return (
    <Dialog open={isOpen}>
      <DialogSurface>
        <DialogTitle>Notice: Unknown File</DialogTitle>
        <DialogBody>
          <div className={styles.dialogContent}>
            <p className={styles.dialogText}>
              ContractSmarts does not recognize this file. Some of our features require that we identify individual files. May we track it?
            </p>
            <div className={styles.checkbox}>
              <Checkbox
                checked={dontAskAgain}
                onChange={(e, data) => setDontAskAgain(data.checked)}
                label="Don't ask again for this file"
              />
            </div>
          </div>
        </DialogBody>
        <DialogActions>
          <Button appearance="secondary" onClick={onClose}>
            Not Now
          </Button>
          <Button appearance="primary" onClick={handleConfirm}>
            Allow
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
};

export {
  FileStatus,
  FileStatusIndicator,
  RegistrationDialog,
  RegistrationDialogProps,
}