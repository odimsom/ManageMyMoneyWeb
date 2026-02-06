import api from './api';

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  currency: string;
}

export interface Expense {
  id: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  categoryName: string;
  categoryColor?: string;
  accountName: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface AccountSummary {
  totalBalance: number;
  currency: string;
  activeAccountsCount: number;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  categoryColor?: string;
  percentage: number;
  amount: number;
}

const getFinancialSummary = async (fromDate: string, toDate: string) => {
  const response = await api.get<{ data: FinancialSummary }>(`/reports/summary`, {
    params: { fromDate, toDate }
  });
  return response.data.data;
};

const getAccountSummary = async () => {
    const response = await api.get<{ data: AccountSummary }>(`/accounts/summary`);
    return response.data.data;
}

const getTopCategories = async (fromDate: string, toDate: string) => {
  const response = await api.get<{ data: CategoryBreakdown[] }>(`/reports/top-categories`, {
    params: { fromDate, toDate, top: 3 }
  });
  return response.data.data;
};

const getRecentTransactions = async () => {
  const response = await api.get<{ data: PaginatedResponse<Expense> }>(`/expenses`, {
    params: { pageNumber: 1, pageSize: 5, sort: '-date' }
  });
  return response.data.data.data;
};

export const dashboardService = {
  getFinancialSummary,
  getAccountSummary,
  getTopCategories,
  getRecentTransactions
};
