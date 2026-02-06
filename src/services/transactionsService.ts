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

const getTransactions = async (filters: TransactionFilters) => {
  // The API might have separate endpoints for expenses and incomes, 
  // or a unified one. Based on dashboardService, we have /api/Expenses.
  // I'll assume /api/Expenses for now and check for Incomes.
  const response = await api.get<{ data: PaginatedResponse<Transaction> }>(`/api/Expenses`, {
    params: {
      PageNumber: filters.pageNumber || 1,
      PageSize: filters.pageSize || 10,
      CategoryId: filters.categoryId,
      FromDate: filters.fromDate,
      ToDate: filters.toDate,
      Search: filters.search
    }
  });
  
  // Adding type to each transaction for UI display
  const transactionsRaw = response.data.data?.data || [];
  const transactions = transactionsRaw.map(t => ({ ...t, type: 'Expense' as const }));
  return { ...response.data.data, data: transactions };
};

export const transactionsService = {
  getTransactions
};
