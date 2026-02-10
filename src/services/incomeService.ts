import api from './api';

export interface Income {
  id: string;
  sourceId: string;
  sourceName: string;
  accountId: string;
  accountName: string;
  amount: number;
  date: string;
  description?: string;
  isRecurring: boolean;
  status: string;
  currencyCode: string;
}

export interface IncomeSource {
  id: string;
  name: string;
  description?: string;
  averageAmount?: number;
}

export interface CreateIncomeRequest {
  sourceId: string;
  accountId: string;
  amount: number;
  date: string;
  description?: string;
  isRecurring: boolean;
}

export interface UpdateIncomeRequest {
  sourceId: string;
  accountId: string;
  amount: number;
  date: string;
  description?: string;
  isRecurring: boolean;
}

export interface CreateIncomeSourceRequest {
  name: string;
  description?: string;
}

export interface IncomeSummaryResponse {
  totalIncome: number;
  bySource: { [key: string]: number };
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

const getIncomes = async (params: { fromDate?: string; toDate?: string; pageNumber?: number; pageSize?: number }) => {
  const response = await api.get<{ data: PaginatedResponse<Income> }>('/api/Income', { params });
  return response.data;
};

const exportIncomeByExcel = async (fromDate?: string, toDate?: string) => {
  const response = await api.get('/api/Income/export/excel', {
    params: { fromDate, toDate },
    responseType: 'blob'
  });
  return response.data;
};

const getIncomeById = async (id: string) => {
  const response = await api.get<{ data: Income }>(`/api/Income/${id}`);
  return response.data.data;
};

const createIncome = async (data: CreateIncomeRequest) => {
  const response = await api.post<{ data: Income }>('/api/Income', data);
  return response.data.data;
};

const updateIncome = async (id: string, data: UpdateIncomeRequest) => {
  const response = await api.put<{ data: Income }>(`/api/Income/${id}`, data);
  return response.data.data;
};

const deleteIncome = async (id: string) => {
  await api.delete(`/api/Income/${id}`);
};

const getMonthlyIncomeSummary = async (year: number, month: number) => {
  const response = await api.get<{ data: IncomeSummaryResponse }>('/api/Income/summary/monthly', {
    params: { year, month }
  });
  return response.data.data;
};

const getIncomeSources = async () => {
  const response = await api.get<{ data: IncomeSource[] }>('/api/Income/sources');
  return response.data.data || [];
};

const createIncomeSource = async (data: CreateIncomeSourceRequest) => {
  const response = await api.post<{ data: IncomeSource }>('/api/Income/sources', data);
  return response.data.data;
};

const updateIncomeSource = async (id: string, data: CreateIncomeSourceRequest) => {
  const response = await api.put<{ data: IncomeSource }>(`/api/Income/sources/${id}`, data);
  return response.data.data;
};

const deleteIncomeSource = async (id: string) => {
  await api.delete(`/api/Income/sources/${id}`);
};

export const incomeService = {
  getIncomes,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome,
  getMonthlyIncomeSummary,
  getIncomeSources,
  createIncomeSource,
  updateIncomeSource,
  deleteIncomeSource,
  exportIncomeByExcel
};
