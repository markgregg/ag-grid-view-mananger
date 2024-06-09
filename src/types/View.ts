import { ColumnState } from "ag-grid-community";

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
  customState?: any;
  changed: boolean;
}