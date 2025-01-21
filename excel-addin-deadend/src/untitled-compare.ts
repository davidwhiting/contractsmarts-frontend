// In FileStatusComponents.tsx

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