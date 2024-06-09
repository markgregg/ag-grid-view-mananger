import * as React from 'react';
import { IoIosAdd } from "react-icons/io";
import { AgGridViewManagerApi, Persistence, View } from '@/types';
import ViewItem from '../ViewItem';
import { ColumnApi } from 'ag-grid-community';
import { VIEW_VERSION } from '@/general/constants';
import { guid } from '@/general/utilityFunctions';
import { deleteView, fetchActiveView, fetchViews, persistView, updateActiveView } from '../../general/agGridViewManagerFunctions';
import ActiveView from '../ActiveView';
import './AgGridViewManagerList.css';


export interface AgGridViewManagerListProps {
  persistence: Persistence;
  columnApi: ColumnApi | null; // ag-grid column api
  onSelect?: (view: View) => void;
}

const AgGridViewManagerList = React.forwardRef<AgGridViewManagerApi, AgGridViewManagerListProps>(
  (props, ref) => {
    const {
      persistence,
      columnApi,
      onSelect,
    } = props;
    const [newViewName, setNewViewName] = React.useState<string>('');
    const [views, setViews] = React.useState<View[]>([]);
    const [activeView, setActiveView] = React.useState<View | null>(null);

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
      if (columnApi && views.length == 0) {
        const lastViewList = fetchViews(persistence);
        setViews(lastViewList);
        const lastView = fetchActiveView(persistence);
        const lastActiveView = lastViewList.find((v) => v.id === lastView)
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
            changed: false
          };
          handleSelect(defaultView);
        } else {
          handleSelect(lastActiveView);
        }
      }
    }, [columnApi]);

    const updateView = (customState: any) => {
      if (!columnApi) return;
      const columnState = columnApi.getColumnState();
      const columnGroupState = columnApi.getColumnGroupState();
      setActiveView({
        ...(activeView !== null ? activeView : {
          version: VIEW_VERSION,
          id: guid(),
          name: 'Default',
        }),
        columnState,
        columnGroupState,
        customState,
        timestamp: new Date(Date.now()),
        changed: true
      });
    }

    const handleSelect = (view: View) => {
      const {
        columnState,
        columnGroupState
      } = view;
      columnApi?.applyColumnState({
        state: columnState,
        applyOrder: true
      });
      columnApi?.setColumnGroupState(columnGroupState);
      setTimeout(() => {
        setActiveView(view);
        updateActiveView(persistence, view);
        if (onSelect) {
          onSelect(view);
        }
      }, 10);
    }

    const handleDeleteView = (view: View) => {
      setViews(views.filter(v => v.name !== view.name));
      deleteView(persistence, view);
      if (activeView?.name == view.name) {
        setActiveView({
          ...activeView,
          name: 'Default'
        });
      }
    }

    const handleSaveView = () => {
      if (activeView) {
        const updateView = {
          ...activeView,
          changed: false,
        };
        persistView(persistence, updateView);
        setViews(views.map((v) => v.name === updateView.name
          ? updateView
          : v
        ));
        setActiveView(updateView);
      }
    }

    const handleSaveNewView = () => {
      if (columnApi && newViewName !== '' && !views.find((v) => v.name === newViewName)) {
        const columnState = columnApi.getColumnState();
        const columnGroupState = columnApi.getColumnGroupState();
        const view: View = {
          ...activeView,
          id: guid(),
          version: VIEW_VERSION,
          name: newViewName,
          columnState,
          columnGroupState,
          timestamp: new Date(Date.now()),
          changed: false
        };
        setViews([...views, view]);
        persistView(persistence, view);
        setNewViewName('');
      }
    }

    const handleRename = (view: View, name: string): boolean => {
      const updatedView = {
        ...view,
        name,
      }
      setViews(views.map(v =>
        v.id === updatedView.id
          ? updatedView
          : v
      ));
      persistence.persist(updatedView);
      if (activeView?.id === updatedView.id) {
        setActiveView({
          ...activeView,
          name,
        });
      }
      return true;
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        handleSaveNewView();
      }
    }

    return (
      <div
        id="agViewManagerList"
        className="agViewManagerListMain"
      >
        {activeView && <>
          <ActiveView
            view={activeView}
            onSave={(() => handleSaveView())}
          />
        </>
        }
        <div className="agViewManagerListNewView">
          <input
            type="text"
            value={newViewName}
            onChange={(e) => setNewViewName(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e)}
          />
          <IoIosAdd
            onClick={() => handleSaveNewView()}
          />
        </div>
        <div className='horizontalSeperator' />
        <div className="agViewManagerListItems">
          <ul>
            {views.filter(view => newViewName === '' || view.name.includes(newViewName)).map((view => (
              <ViewItem
                key={view.name}
                view={view}
                onDelete={() => handleDeleteView(view)}
                onRename={(newName) => handleRename(view, newName)}
                onSelect={() => handleSelect(view)}
              />
            )))}
          </ul>
        </div>
      </div>
    );
  });

export default AgGridViewManagerList;
