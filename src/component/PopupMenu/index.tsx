import * as React from 'react';
import { MdDriveFileRenameOutline } from 'react-icons/md';
import { GrClone } from 'react-icons/gr';
import './PopupMenu.css';

interface PopupMenuProperties {
  onRename: () => void;
  onClone: () => void;
  onHideMenu: () => void;
}

export default function PopupMenu({
  onRename,
  onClone,
  onHideMenu,
}: PopupMenuProperties): JSX.Element {
  const divRef = React.useRef<HTMLDivElement | null>(null);

  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  React.useEffect(() => {
    setTimeout(() => divRef.current?.focus(), 1);
    setActiveIndex(0);
  }, []);

  const handleReanme = (event?: React.MouseEvent) => {
    onRename();
    event?.stopPropagation();
    event?.preventDefault();
  };

  const handleClone = (event?: React.MouseEvent) => {
    onClone();
    event?.stopPropagation();
    event?.preventDefault();
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        setActiveIndex(activeIndex === 0 ? 1 : 0);
        event.stopPropagation();
        event.preventDefault();
        break;
      case 'ArrowDown':
        setActiveIndex(activeIndex === 1 ? 0 : 1);
        event.stopPropagation();
        event.preventDefault();
        break;
      case 'Enter':
        if (activeIndex === 0) {
          handleReanme();
        } else {
          handleClone();
        }
        event.stopPropagation();
        event.preventDefault();
        break;
      case 'Escape':
        onHideMenu();
        event.stopPropagation();
        event.preventDefault();
        break;
      default:
        // ignore
        break;
    }
  };

  const menuItems = [
    {
      text: 'Reanme',
      Icon: MdDriveFileRenameOutline,
      action: (e: React.MouseEvent) => handleReanme(e),
    },
    {
      text: 'Clone',
      Icon: GrClone,
      action: (e: React.MouseEvent) => handleClone(e),
    },
  ];

  return (
    <div
      ref={divRef}
      className="popupMenu"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      onKeyDown={(e) => handleKeyPress(e)}
    >
      <div className="popupDropDownMenu">
        {menuItems.map((item, index) => (
          <div
            className={
              activeIndex === index
                ? 'dropDownItem dropDownItemActive'
                : 'dropDownItem'
            }
            onMouseDown={(e) => item.action(e)}
            onMouseEnter={() => setActiveIndex(index)}
          >
            <span className="dropDownText">{item.text}</span>
            <item.Icon className="dropDownItemIcon" />
          </div>
        ))}
      </div>
    </div>
  );
}
