import { CiSaveDown2, CiMenuKebab } from 'react-icons/ci';

import { View } from '@/types';
import './ActivePillView.css';

interface ActivePillViewProperties {
  view: View;
  onSave: () => void;
  onShowMenu: () => void;
}

export default function ActivePillView({
  view,
  onSave,
  onShowMenu,
}: ActivePillViewProperties): JSX.Element {
  const { name, changed } = view;

  const handleSave = (event: React.MouseEvent) => {
    onSave();
    event.stopPropagation();
  };

  const handleShowMenu = (event: React.MouseEvent) => {
    onShowMenu();
    event.stopPropagation();
  };

  return (
    <div className="activePillViewMain">
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
            onClick={(e) => handleSave(e)}
          />
        )}
      </span>
      <div onClick={(e) => handleShowMenu(e)}>
        <CiMenuKebab className="activePillViewMainIcon" />
      </div>
    </div>
  );
}
