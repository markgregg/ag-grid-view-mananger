import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  ColumnApi,
  GridApi,
  GridReadyEvent,
  IRowNode,
} from 'ag-grid-community';
import AgGridViewManagerList from '@/component/AgGridViewManagerList';
import Bond from '@/TestApp/types/Bond';
import { bonds } from '@/TestApp/data/bonds';
import { columns } from './AppFunctions';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridViewManagerApi, View } from '@/types';
import { localStoragePersistence } from '@/persistence/localStorePersistence';
import {
  FilterFunction,
  Matcher,
  ReactSmartSearchAgGrid,
} from 'react-smart-search';
import './App.css';
import AgGridViewManagerCombo from '@/component/AgGridViewManagerCombo';

export default function App(): JSX.Element {
  const agGridViewManagerApiRef = React.useRef<AgGridViewManagerApi | null>(null);
  const filterRef = React.useRef<FilterFunction | null>(null);
  const [matchers, setMatchers] = React.useState<Matcher[]>([]);
  const [rowData] = React.useState<Bond[]>(bonds);
  const [columnDefs] = React.useState<ColDef<Bond>[]>(columns);
  const [gridApi, setGridApi] = React.useState<GridApi<Bond> | null>(null);
  const [columnApi, setColumnApi] = React.useState<ColumnApi | null>(null);

  const matchersChanged = (
    newMatchers: Matcher[],
    newFilter: FilterFunction | null,
  ) => {
    setMatchers(newMatchers);
    filterRef.current = newFilter;
    gridApi?.onFilterChanged();
    agGridViewManagerApiRef.current?.viewChanged(newMatchers);
  };

  const handleGridReady = React.useCallback((event: GridReadyEvent<Bond>) => {
    setGridApi(event.api);
    setColumnApi(event.columnApi);
  }, []);

  const handleGridChanged = () => {
    agGridViewManagerApiRef.current?.viewChanged(matchers);
  }

  const isExternalFilterPresent = React.useCallback(
    (): boolean => filterRef.current !== null,
    [],
  );

  const doesExternalFilterPass = React.useCallback(
    (node: IRowNode<Bond>): boolean =>
      filterRef.current !== null && filterRef.current(node),
    [],
  );

  const handleSelect = (view: View) => {
    setMatchers(view.customState ?? []);
  }

  return (
    <div className="mainContainer">
      <div className="mainSearchbar">
        <ReactSmartSearchAgGrid
          matchers={matchers}
          onChanged={(m, f) => matchersChanged(m, f)}
          maxMatcherWidth={250}
          gridApi={gridApi}
          columnApi={columnApi}
          keyboardActivityTimeout={1000}
        />
      </div>
      <div className="mainContent">
        <div className="mainViewManager">
          {/*<AgGridViewManagerList
            ref={agGridViewManagerApiRef}
            columnApi={columnApi}
            persistence={localStoragePersistence('TEST_APP')}
            onSelect={(v) => handleSelect(v)}

  />*/}
          <AgGridViewManagerCombo
            ref={agGridViewManagerApiRef}
            columnApi={columnApi}
            persistence={localStoragePersistence('TEST_APP')}
            onSelect={(v) => handleSelect(v)}
          />
        </div>
        <div className="ag-theme-alpine agGrid">
          <AgGridReact
            onGridReady={handleGridReady}
            rowData={rowData}
            columnDefs={columnDefs}
            onColumnVisible={() => handleGridChanged()}
            onColumnPinned={() => handleGridChanged()}
            onColumnResized={() => handleGridChanged()}
            onColumnMoved={() => handleGridChanged()}
            onColumnRowGroupChanged={() => handleGridChanged()}
            onColumnValueChanged={() => handleGridChanged()}
            onColumnPivotChanged={() => handleGridChanged()}
            onSortChanged={() => handleGridChanged()}
            isExternalFilterPresent={isExternalFilterPresent}
            doesExternalFilterPass={doesExternalFilterPass}
          />
        </div>
      </div>
    </div>
  );
}
