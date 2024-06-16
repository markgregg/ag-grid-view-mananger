import { ColDef } from 'ag-grid-community';
import Bond from '@/TestApp/types/Bond';

export const columns: ColDef<Bond>[] = [
  {
    field: 'isin',
    filter: 'agSetColumnFilter',
    sortable: true,
    resizable: true,
  },
  {
    field: 'side',
    filter: 'agSetColumnFilter',
    sortable: true,
    resizable: true,
  },
  {
    field: 'currency',
    filter: 'agSetColumnFilter',
    sortable: true,
    resizable: true,
  },
  {
    field: 'issueDate',
    filter: 'agDateColumnFilter',
    sortable: true,
    resizable: true,
  },
  {
    field: 'maturityDate',
    filter: 'agDateColumnFilter',
    sortable: true,
    resizable: true,
  },
  {
    field: 'coupon',
    filter: 'agNumberColumnFilter',
    sortable: true,
    resizable: true,
  },
  {
    field: 'issuer',
    filter: 'agTextColumnFilter',
    sortable: true,
    resizable: true,
  },
  {
    field: 'hairCut',
    filter: 'agNumberColumnFilter',
    sortable: true,
    resizable: true,
  },
  {
    field: 'active',
    filter: 'agNumberColumnFilter',
    sortable: true,
    resizable: true,
  },
  {
    colId: 'sector',
    field: 'categories.sector',
    filter: 'agSetColumnFilter',
    sortable: true,
    resizable: true,
  },
];
