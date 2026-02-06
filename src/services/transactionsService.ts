import api from './api';

export interface PaginatedResponse<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  categoryName: string;
  categoryColor?: string;
  accountName: string;
  type: 'Expense' | 'Income';
}

export interface TransactionFilters {
  pageNumber?: number;
  pageSize?: number;
  categoryId?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
}

export interface CreateExpenseRequest {
  amount: number;
  description: string;
  categoryId: string;
  accountId: string;
  date: string;
  currency: string;
}

export interface CreateIncomeRequest {
  amount: number;
  description: string;
  categoryId: string;
  accountId: string;
  date: string;
  currency: string;
}

const getTransactions = async (filters: TransactionFilters) => {
  // The API might have separate endpoints for expenses and incomes, 
  // or a unified one. Based on dashboardService, we have /api/Expenses.
  // I'll assume /api/Expenses for now and check for Incomes.
  const response = await api.get<{ data: PaginatedResponse<Transaction> }>(`/api/Expenses`, {
    params: filters
  });
  
  // Adding type to each transaction for UI display
  const transactionsRaw = response.data.data?.data || [];
  const transactions = transactionsRaw.map(t => ({ ...t, type: 'Expense' as const }));
  return { ...response.data.data, data: transactions };
};

const createExpense = async (data: CreateExpenseRequest) => {
  const response = await api.post<{ data: Transaction }>(`/api/Expenses`, data);
  return response.data.data;
};

const createIncome = async (data: CreateIncomeRequest) => {
  const response = await api.post<{ data: Transaction }>(`/api/Income`, data);
  return response.data.data;
};

export interface IncomeSource {
  id: string;
  name: string;
}

const getIncomeSources = async () => {
  const response = await api.get<{ data: IncomeSource[] }>(`/api/Income/sources`);
  return response.data.data || [];
};

export const transactionsService = {
  getTransactions,
  createExpense,
  createIncome,
  getIncomeSources
};
