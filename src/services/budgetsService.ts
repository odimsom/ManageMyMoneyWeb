import api from './api';

export interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  spentAmount: number;
  currency: string;
  period: 'Monthly' | 'Yearly';
  startDate: string;
  endDate: string;
  percentage: number;
}

const getBudgets = async () => {
  const response = await api.get<{ data: Budget[] }>(`/api/Budgets`);
  return response.data.data;
};

const createBudget = async (data: Partial<Budget>) => {
  const response = await api.post<{ data: Budget }>(`/api/Budgets`, data);
  return response.data.data;
};

export const budgetsService = {
  getBudgets,
  createBudget
};
