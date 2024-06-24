import { CiSaveDown2, CiMenuKebab } from 'react-icons/ci';

import { View } from '@/types';
import './ActivePillView.css';

interface ActivePillViewProperties {
  view: View;
  onSave: () => void;
  onShowMenu: () => void;
  onClick: () => void;
}

export default function ActivePillView({
  view,
  onSave,
  onShowMenu,
  onClick,
}: ActivePillViewProperties): JSX.Element {
  const { name, changed } = view;

  const handleSave = (event: React.MouseEvent) => {
    onSave();
    event.stopPropagation();
    event.preventDefault();
  };

  const handleShowMenu = (event: React.MouseEvent) => {
    onShowMenu();
    event.stopPropagation();
    event.preventDefault();
  };

  const handleClick = (event: React.MouseEvent) => {
    onClick();
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <div
      className={
        changed
          ? 'activePillViewMain activePillViewMainChanged'
          : 'activePillViewMain'
      }
      onMouseDown={handleClick}
    >
      <div className="activePillViewInner">
        <span className="activePillView">
          <span
            className="activePillViewText"
            style={
              changed
                ? {
                    fontStyle: 'italic',
                  }
                : {}
            }
          >
            {name}
          </span>
          {changed && (
            <CiSaveDown2
              className="activePillViewMainIcon activePillViewSaveIcon"
              onMouseDown={handleSave}
            />
          )}
        </span>
        <div onMouseDown={handleShowMenu}>
          <CiMenuKebab className="activePillViewMainIcon" />
        </div>
      </div>
    </div>
  );
}
