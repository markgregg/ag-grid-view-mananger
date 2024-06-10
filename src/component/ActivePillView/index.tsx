import { CiSaveDown2 } from "react-icons/ci";
import { View } from '@/types';
import './ActivePillView.css';
import PopupMenu from "../PopupMenu";

interface ActivePillViewProperties {
  view: View;
  onSave: () => void;
  onRename: () => void;
  onClone: () => void;
}

export default function ActivePillView({
  view,
  onSave,
  onRename,
  onClone,
}: ActivePillViewProperties): JSX.Element {
  const {
    name,
    changed,
  } = view;

  const handleSave = (event: React.MouseEvent) => {
    onSave();
    event.stopPropagation();
  }

  const handleReanme = () => {
    onRename();
  }

  const handleClone = () => {
    onClone();
  }

  return (
    <div className="activePillViewMain">
      <span className="activePillView">
        <span
          className="activePillViewText"
          style={{
            fontStyle: changed ? 'italic' : undefined,
          }}
        >
          {name}
        </span>
        {changed && <CiSaveDown2
          className="activePillViewMainIcon"
          onClick={(e) => handleSave(e)}
        />}
      </span>
      <PopupMenu
        onRename={() => handleReanme()}
        onClone={() => handleClone()}
      />
    </div>
  )
}