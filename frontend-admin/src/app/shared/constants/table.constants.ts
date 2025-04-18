import { TableConfig } from '../interfaces/table.interfaces';

export const TABLE_CONFIG: TableConfig = {
  rowsPerPageOptions: [5, 10, 20],
  rowsPerPage: 10,
  paginator: true,
  pageLinkSize: 5,
  showCurrentPageReport: true,
  emptyMessage: 'Nenhum registro encontrado',
  columns: [],
};
