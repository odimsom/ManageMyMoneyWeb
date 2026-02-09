import api from './api';
import type { PaginatedResponse } from './incomeService';

export interface Expense {
  id: string;
  sourceId: string;
  sourceName: string;
  accountId: string;
  accountName: string;
  amount: number;
  date: string;
  description?: string;
  isRecurring: boolean;
  categoryId: string;
  categoryName: string;
  currencyCode: string;
  tags: Tag[];
  attachments: Attachment[];
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  contentType: string;
  url: string;
}

export interface CreateExpenseRequest {
  amount: number;
  description?: string;
  categoryId: string;
  accountId: string;
  date: string;
  currency: string;
  isRecurring?: boolean;
  tagIds?: string[];
}

export interface UpdateExpenseRequest {
  amount: number;
  description?: string;
  categoryId: string;
  accountId: string;
  date: string;
  isRecurring?: boolean;
  tagIds?: string[];
}

export interface CreateQuickExpenseRequest {
  amount: number;
  description?: string;
  categoryId: string;
  accountId: string;
}

export interface ExpenseSummaryResponse {
  totalExpense: number;
  byCategory: { [key: string]: number };
}

export interface CategoryExpenseSummary {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
}

export interface DailyExpenseSummary {
  date: string;
  amount: number;
}

export interface CreateRecurringExpenseRequest {
  amount: number;
  description?: string;
  categoryId: string;
  accountId: string;
  startDate: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  dayOfMonth?: number;
  dayOfWeek?: number;
}

export interface RecurringExpenseResponse {
  id: string;
  amount: number;
  description?: string;
  categoryName: string;
  accountName: string;
  frequency: string;
  nextRunDate: string;
  status: 'Active' | 'Paused' | 'Cancelled';
}

const getExpenses = async (params: { 
  FromDate?: string; 
  ToDate?: string; 
  CategoryId?: string; 
  AccountId?: string; 
  MinAmount?: number; 
  MaxAmount?: number; 
  SearchTerm?: string; 
  TagIds?: string[]; 
  PageNumber?: number; 
  PageSize?: number; 
}) => {
  const response = await api.get<{ data: PaginatedResponse<Expense> }>('/api/Expenses', { params });
  return response.data.data;
};

const createExpense = async (data: CreateExpenseRequest) => {
  const response = await api.post<{ data: Expense }>('/api/Expenses', data);
  return response.data.data;
};

const createQuickExpense = async (data: CreateQuickExpenseRequest) => {
  const response = await api.post<{ data: Expense }>('/api/Expenses/quick', data);
  return response.data.data;
};

const getExpenseById = async (id: string) => {
  const response = await api.get<{ data: Expense }>(`/api/Expenses/${id}`);
  return response.data.data;
};

const updateExpense = async (id: string, data: UpdateExpenseRequest) => {
  const response = await api.put<{ data: Expense }>(`/api/Expenses/${id}`, data);
  return response.data.data;
};

const deleteExpense = async (id: string) => {
  await api.delete(`/api/Expenses/${id}`);
};

const getMonthlyExpenseSummary = async (year: number, month: number) => {
  const response = await api.get<{ data: ExpenseSummaryResponse }>('/api/Expenses/summary/monthly', { params: { year, month } });
  return response.data.data;
};

const getCategoryExpenseSummary = async (fromDate?: string, toDate?: string) => {
  const response = await api.get<{ data: CategoryExpenseSummary[] }>('/api/Expenses/summary/category', { params: { fromDate, toDate } });
  return response.data.data || [];
};

const getDailyExpenseSummary = async (fromDate?: string, toDate?: string) => {
  const response = await api.get<{ data: DailyExpenseSummary[] }>('/api/Expenses/summary/daily', { params: { fromDate, toDate } });
  return response.data.data || [];
};

const getTags = async () => {
  const response = await api.get<{ data: Tag[] }>('/api/Expenses/tags');
  return response.data.data || [];
};

const createTag = async (data: { name: string; color?: string }) => {
  const response = await api.post<{ data: Tag }>('/api/Expenses/tags', data);
  return response.data.data;
};

const deleteTag = async (tagId: string) => {
  await api.delete(`/api/Expenses/tags/${tagId}`);
};

const addAttachment = async (expenseId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post<{ data: Attachment }>(`/api/Expenses/${expenseId}/attachments`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.data;
};

const deleteAttachment = async (expenseId: string, attachmentId: string) => {
  await api.delete(`/api/Expenses/${expenseId}/attachments/${attachmentId}`);
};

const createRecurringExpense = async (data: CreateRecurringExpenseRequest) => {
  const response = await api.post<{ data: RecurringExpenseResponse }>('/api/Expenses/recurring', data);
  return response.data.data;
};

const getRecurringExpenses = async () => {
  const response = await api.get<{ data: RecurringExpenseResponse[] }>('/api/Expenses/recurring');
  return response.data.data || [];
};

export const expenseService = {
  getExpenses,
  createExpense,
  createQuickExpense,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getMonthlyExpenseSummary,
  getCategoryExpenseSummary,
  getDailyExpenseSummary,
  getTags,
  createTag,
  deleteTag,
  addAttachment,
  deleteAttachment,
  createRecurringExpense,
  getRecurringExpenses
};
