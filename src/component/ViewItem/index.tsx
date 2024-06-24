import * as React from 'react';
import { RxCross2 } from 'react-icons/rx';
import { MdDriveFileRenameOutline } from 'react-icons/md';
import { TiTick } from 'react-icons/ti';
import { View } from '@/types';
import './ViewItem.css';

interface ViewItemProperties {
  view: View;
  onSelect: () => void;
  onDelete: () => void;
  onRename?: (newName: string) => boolean;
}

export default function ViewItem({
  view,
  onSelect,
  onDelete,
  onRename,
}: ViewItemProperties): JSX.Element {
  const { name } = view;
  const [newName, setNewName] = React.useState<string>('');
  const [rename, setRename] = React.useState<boolean>(false);
  const [active, setActive] = React.useState<boolean>(false);

  const handleReanme = (event: React.MouseEvent) => {
    setNewName(name);
    setRename(true);
    event.stopPropagation();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      completeRename();
      event.stopPropagation();
    }
  };

  const handleCompleteRename = (event: React.MouseEvent) => {
    completeRename();
    event.stopPropagation();
  };

  const completeRename = () => {
    if (newName !== '' && onRename) {
      if (onRename(newName)) {
        setRename(false);
      }
    }
  };

  const handleMouseEnter = () => {
    setActive(true);
  };

  const handleMouseLeave = () => {
    setActive(false);
  };

  const handleDelete = (event: React.MouseEvent) => {
    onDelete();
    event.stopPropagation();
    event.preventDefault();
  };

  const handleSelect = (event: React.MouseEvent) => {
    onSelect();
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {!rename && (
        <RxCross2
          className="agViewManagerComboMainIcon"
          onMouseDown={handleDelete}
        />
      )}
      {!rename && (
        <span className="viewItem" onClick={handleSelect}>
          {name}
        </span>
      )}
      {rename && (
        <>
          <span className="viewItemRenamewText">New name</span>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <TiTick onMouseDown={handleCompleteRename} />
        </>
      )}
      {onRename && !rename && active && (
        <MdDriveFileRenameOutline onClick={handleReanme} />
      )}
    </li>
  );
}
