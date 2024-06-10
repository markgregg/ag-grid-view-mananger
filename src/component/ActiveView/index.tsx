import { CiSaveDown2 } from "react-icons/ci";
import { View } from '@/types';
import './ActiveView.css';

interface ActiveViewProperties {
  view: View;
  onSave: () => void;
}

export default function ActiveView({
  view,
  onSave,
}: ActiveViewProperties): JSX.Element {
  const {
    name,
    changed,
  } = view;

  return (
    <div
      className="activeViewMain"
      style={{
        fontStyle: changed ? 'italic' : 'normal',
        color: changed ? '#007099' : 'black',
      }}
    >
      <span className="activeView">
        <span className="activeViewText">
          {name}
        </span>
        {changed && <CiSaveDown2
          className="activeViewIcon"
          onClick={() => onSave()}
        />}
      </span>
    </div>
  )
}