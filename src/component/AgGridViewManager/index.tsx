import * as React from 'react';
import { IoIosAdd } from 'react-icons/io';
import { TiTick } from 'react-icons/ti';
import { ColumnApi } from 'ag-grid-community';
import { AgGridViewManagerApi, Persistence, View } from '@/types';
import { VIEW_VERSION } from '@/general/constants';
import { guid } from '@/general/utilityFunctions';
import {
  deleteView,
  fetchActiveView,
  fetchViews,
  persistView,
  updateActiveView,
} from '../../general/agGridViewManagerFunctions';
import ActivePillView from '../ActivePillView';
import ViewItem from '../ViewItem';
import PopupMenu from '../PopupMenu';
import './AgGridViewManager.css';

export interface AgGridViewManagerProps {
  persistence: Persistence;
  columnApi: ColumnApi | null; // ag-grid column api
  onSelect?: (view: View) => void;
  style?: React.CSSProperties;
}

const AgGridViewManagerCombo = React.forwardRef<
  AgGridViewManagerApi,
  AgGridViewManagerProps
>((props, ref) => {
  const { persistence, columnApi, onSelect, style } = props;
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [viewName, setViewName] = React.useState<string>('');
  const [views, setViews] = React.useState<View[]>([]);
  const [activeView, setActiveView] = React.useState<View>({
    id: guid(),
    name: 'Default',
    version: VIEW_VERSION,
    timestamp: new Date(Date.now()),
    columnState: [],
    columnGroupState: [],
    changed: false,
  });
  const [editting, setEditting] = React.useState<boolean>(false);
  const [renaming, setRenaming] = React.useState<boolean>(false);
  const [active, setActive] = React.useState<boolean>(false);
  const [showMenu, setShowMenu] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (ref) {
      const apiRef: AgGridViewManagerApi = {
        viewChanged: (customState) => updateView(customState),
      };
      if (typeof ref === 'function') {
        ref(apiRef);
      } else {
        ref.current = apiRef;
      }
    }
  }, [ref, columnApi, activeView]);

  React.useEffect(() => {
    if (columnApi && views.length === 0) {
      const lastViewList = fetchViews(persistence);
      setViews(lastViewList);
      const lastView = fetchActiveView(persistence);
      const lastActiveView = lastViewList.find((v) => v.id === lastView);
      if (!lastActiveView) {
        const columnState = columnApi.getColumnState();
        const columnGroupState = columnApi.getColumnGroupState();
        const defaultView: View = {
          id: guid(),
          version: VIEW_VERSION,
          name: 'Default',
          columnState,
          columnGroupState,
          timestamp: new Date(Date.now()),
          changed: false,
        };
        handleSelect(defaultView);
      } else {
        handleSelect(lastActiveView);
      }
    }
  }, [columnApi]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateView = (customState: any) => {
    if (!columnApi) return;
    const columnState = columnApi.getColumnState();
    const columnGroupState = columnApi.getColumnGroupState();
    if (
      JSON.stringify(customState) !== JSON.stringify(activeView.customState) ||
      JSON.stringify(columnState) !== JSON.stringify(activeView.columnState) ||
      JSON.stringify(columnGroupState) !==
        JSON.stringify(activeView.columnGroupState)
    ) {
      setActiveView({
        ...(activeView !== null
          ? activeView
          : {
              version: VIEW_VERSION,
              id: guid(),
              name: 'Default',
            }),
        columnState,
        columnGroupState,
        customState,
        timestamp: new Date(Date.now()),
        changed: true,
      });
    }
  };

  const handleSelect = (view: View) => {
    setEditting(false);
    const { columnState, columnGroupState } = view;
    columnApi?.applyColumnState({
      state: columnState,
      applyOrder: true,
    });
    columnApi?.setColumnGroupState(columnGroupState);
    setTimeout(() => {
      setActiveView(view);
      updateActiveView(persistence, view);
      if (onSelect) {
        onSelect(view);
      }
    }, 10);
    setViewName('');
  };

  const handleDeleteView = (view: View) => {
    setViews(views.filter((v) => v.name !== view.name));
    deleteView(persistence, view);
    if (activeView?.name === view.name) {
      setActiveView({
        ...activeView,
        name: 'Default',
      });
    }
  };

  const handleSaveView = () => {
    if (activeView) {
      const updateVw = {
        ...activeView,
        changed: false,
      };
      persistView(persistence, updateVw);
      setViews(views.map((v) => (v.name === updateVw.name ? updateVw : v)));
      setActiveView(updateVw);
      setEditting(false);
      setViewName('');
    }
  };

  const compelteSaveNew = () => {
    if (
      columnApi &&
      viewName !== '' &&
      !views.find((v) => v.name === viewName)
    ) {
      const columnState = columnApi.getColumnState();
      const columnGroupState = columnApi.getColumnGroupState();
      const view: View = {
        ...activeView,
        id: guid(),
        version: VIEW_VERSION,
        name: viewName,
        columnState,
        columnGroupState,
        timestamp: new Date(Date.now()),
        changed: false,
      };
      setViews([...views, view]);
      persistView(persistence, view);
      setViewName('');
      setActiveView(view);
      setEditting(false);
    }
  };

  const handleSaveNewView = (event: React.MouseEvent) => {
    event.stopPropagation();
    compelteSaveNew();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (renaming) {
        completeRename();
        return;
      }
      if (editting) {
        if (viewName === '') {
          setEditting(false);
          return;
        }
        compelteSaveNew();
        return;
      }
      event.stopPropagation();
      return;
    }
    if (event.key === 'Escape') {
      setRenaming(false);
      setEditting(false);
      setViewName('');
    }
  };

  const handleTextChange = (text: string) => {
    setViewName(text);
  };

  const getUniqueName = (name: string, index: number): string => {
    const newName = `${name}${index > 0 ? ` ${index}` : ''}`;
    if (views.find((v) => v.name === newName)) {
      return getUniqueName(name, index + 1);
    }
    return newName;
  };

  const handleClone = () => {
    const name = getUniqueName(`Copy Of ${activeView.name}`, 0);
    setRenaming(false);
    setViewName('');
    const clonedView: View = {
      ...activeView,
      id: guid(),
      name,
      changed: false,
    };
    persistView(persistence, clonedView);
    setViews([...views, clonedView]);
    setActiveView(clonedView);
    handleRename(name);
    setShowMenu(false);
  };

  const handleRename = (name?: string) => {
    setRenaming(true);
    setViewName(name ?? activeView.name);
    setTimeout(() => inputRef.current?.focus(), 1);
    setShowMenu(false);
  };

  const completeRename = () => {
    if (
      viewName === activeView.name ||
      (viewName !== '' && !views.find((v) => v.name === viewName))
    ) {
      setRenaming(false);
      setViewName('');
      if (viewName === activeView.name) {
        return;
      }
      const updateVw: View = {
        ...activeView,
        name: viewName,
        changed: false,
      };
      persistView(persistence, updateVw);
      setViews(views.map((v) => (v.name === activeView.name ? updateVw : v)));
      setActiveView(updateVw);
      setViewName('');
    }
  };

  const handleRenameComplete = (event: React.MouseEvent) => {
    event.stopPropagation();
    completeRename();
  };

  const handleEdit = (event: React.MouseEvent) => {
    if (!editting && !renaming) {
      setEditting(true);
      setViewName('');
      setTimeout(() => inputRef.current?.focus(), 1);
    }
    event.stopPropagation();
  };

  const handleShowMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleHideMenu = () => {
    setShowMenu(false);
  };

  const handleLostFocus = () => {
    setRenaming(false);
    setEditting(false);
    setViewName('');
  };

  return (
    <div
      id="agViewManagerCombo"
      className="agViewManagerComboMain"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      style={style}
    >
      <div className="agViewManagerComboBox" onClick={(e) => handleEdit(e)}>
        {editting || renaming ? (
          <div className="agViewManagerComboInputBox">
            <input
              ref={inputRef}
              className="agViewManagerComboInput"
              value={viewName}
              onKeyDown={(e) => handleKeyPress(e)}
              onChange={(e) => handleTextChange(e.target.value)}
              onBlur={() => handleLostFocus()}
              placeholder="View Name"
            />
            {renaming ? (
              <TiTick
                className="agViewManagerComboMainIcon"
                onClick={(e) => handleRenameComplete(e)}
              />
            ) : (
              <IoIosAdd
                className="agViewManagerComboMainIcon"
                onClick={(e) => handleSaveNewView(e)}
              />
            )}
          </div>
        ) : (
          <ActivePillView
            view={activeView}
            onSave={() => handleSaveView()}
            onShowMenu={() => handleShowMenu()}
          />
        )}
      </div>
      {active && !renaming && (
        <div className="agViewManagerComboList">
          <ul>
            {views
              .filter(
                (v) =>
                  viewName === '' ||
                  v.name.toLowerCase().includes(viewName.toLowerCase()),
              )
              .map((view) => (
                <ViewItem
                  key={view.id}
                  view={view}
                  onSelect={() => handleSelect(view)}
                  onDelete={() => handleDeleteView(view)}
                />
              ))}
          </ul>
        </div>
      )}
      {active && showMenu && (
        <PopupMenu
          onRename={() => handleRename()}
          onClone={() => handleClone()}
          onHideMenu={() => handleHideMenu()}
        />
      )}
    </div>
  );
});

export default AgGridViewManagerCombo;
