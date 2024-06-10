import * as React from "react";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { CiMenuKebab } from "react-icons/ci";
import { GrClone } from "react-icons/gr";
import './PopupMenu.css';


interface PopupMenuProperties {
  onRename: () => void;
  onClone: () => void;
}

export default function PopupMenu({
  onRename,
  onClone,
}: PopupMenuProperties): JSX.Element {
  const divRef = React.useRef<HTMLDivElement | null>(null);
  const [showMenu, setShowMenu] = React.useState<boolean>(false);
  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  const handleReanme = (event?: React.MouseEvent) => {
    onRename();
    setShowMenu(false);
    event?.stopPropagation();
  }

  const handleClone = (event?: React.MouseEvent) => {
    onClone();
    setShowMenu(false);
    event?.stopPropagation();
  }

  const handleShowMenu = (event: React.MouseEvent) => {
    setShowMenu(!showMenu);
    if (!showMenu) {
      setActiveIndex(0);
      setTimeout(() => divRef.current?.focus(), 1);
    }
    event.stopPropagation();
  }

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
        setShowMenu(false);
        event.stopPropagation();
        event.preventDefault();
        break;
      default:
        //ignore
        break;
    }
  }

  return (
    <div
      ref={divRef}
      className="popupMenu"
      onClick={(e) => handleShowMenu(e)}
      tabIndex={0}
      onKeyDown={(e) => handleKeyPress(e)}
    >
      <CiMenuKebab className="activePillViewMainIcon" />
      {showMenu && <div className="popupDropDownMenu">
        <div
          className={activeIndex === 0 ? 'dropDownItem dropDownItemActive' : 'dropDownItem'}
          onClick={(e) => handleReanme(e)}
          onMouseEnter={() => setActiveIndex(0)}
        ><span className="dropDownText">Reanme</span><MdDriveFileRenameOutline className="dropDownItemIcon" /></div>
        <div
          className={activeIndex === 1 ? 'dropDownItem dropDownItemActive' : 'dropDownItem'}
          onClick={(e) => handleClone(e)}
          onMouseEnter={() => setActiveIndex(1)}
        ><span className="dropDownText">Clone</span><GrClone className="dropDownItemIcon" /></div>
      </div>}
    </div>
  )
}