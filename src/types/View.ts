import { ColumnState } from 'ag-grid-community';

export interface View {
  id: string;
  version: number;
  name: string;
  timestamp: Date;
  columnState: ColumnState[];
  columnGroupState: {
    groupId: string;
    open: boolean;
  }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customState?: any;
  changed: boolean;
}
