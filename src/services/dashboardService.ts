import api from './api';

export type Currency = 'USD' | 'EUR' | 'DOP';

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

export interface DailySummary {
  date: string;
  amount: number;
}

const getFinancialSummary = async (fromDate: string, toDate: string) => {
  const response = await api.get<{ data: FinancialSummary }>(`/api/Reports/summary`, {
    params: { fromDate, toDate }
  });
  return response.data.data;
};

const getAccountSummary = async () => {
    const response = await api.get<{ data: AccountSummary }>(`/api/Accounts/summary`);
    return response.data.data;
}

const getTopCategories = async (fromDate: string, toDate: string) => {
  const response = await api.get<{ data: CategoryBreakdown[] }>(`/api/Expenses/summary/category`, {
    params: { fromDate, toDate }
  });
  return response.data.data;
};

const getRecentTransactions = async () => {
  const response = await api.get<{ data: PaginatedResponse<Expense> }>(`/api/Expenses`, {
    params: { PageNumber: 1, PageSize: 5 }
  });
  return response.data.data.data;
};

const getDailyExpenses = async (fromDate: string, toDate: string) => {
  const response = await api.get<{ data: DailySummary[] }>(`/api/Expenses/summary/daily`, {
    params: { fromDate, toDate }
  });
  return response.data.data;
};

export const dashboardService = {
  getFinancialSummary,
  getAccountSummary,
  getTopCategories,
  getRecentTransactions,
  getDailyExpenses
};
