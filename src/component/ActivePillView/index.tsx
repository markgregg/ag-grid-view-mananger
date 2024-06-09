import { CiSaveDown2 } from "react-icons/ci";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { View } from '@/types';
import './ActivePillView.css';

interface ActivePillViewProperties {
  view: View;
  onSave: () => void;
  onRename: () => void;
}

export default function ActivePillView({
  view,
  onSave,
  onRename,
}: ActivePillViewProperties): JSX.Element {
  const {
    name,
    changed,
  } = view;

  return (
    <div className="activePillViewMain">
      <span className="activePillView">
        <span className="activePillViewText">
          {name}
        </span>
        {changed && <CiSaveDown2
          onClick={() => onSave()}
        />}
      </span>
      {<MdDriveFileRenameOutline
        onClick={() => onRename()}
      />}
    </div>
  )
}