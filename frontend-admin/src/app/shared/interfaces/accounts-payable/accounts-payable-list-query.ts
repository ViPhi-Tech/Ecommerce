export type AccountsPayableListDueRange = {
  startDate: Date;
  endDate: Date;
};

/** Query GET /all: status no banco; `all` = sem filtro de status. */
export type AccountsPayableListStatusParam =
  | 'all'
  | 'pending'
  | 'paid'
  | 'overdue'
  | 'due_soon'
  | 'cancelled';

export type AccountsPayableListFetchQuery = {
  dueDateRange: AccountsPayableListDueRange;
  status: AccountsPayableListStatusParam;
};
