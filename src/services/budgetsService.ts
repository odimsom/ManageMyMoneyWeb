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

export interface CreateBudgetRequest {
  categoryId: string;
  amount: number;
  period: 'Monthly' | 'Yearly';
  startDate: string;
  endDate: string;
  currency: string;
}

export interface UpdateBudgetRequest {
  amount: number;
  period: 'Monthly' | 'Yearly';
  startDate: string;
  endDate: string;
}

export interface BudgetProgress {
  budgetId: string;
  categoryName: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentageUsed: number;
  daysRemaining: number;
  status: 'OnTrack' | 'NearLimit' | 'OverBudget';
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  status: 'Active' | 'Completed' | 'Paused' | 'Cancelled';
  currency: string;
  color?: string;
  icon?: string;
}

export interface CreateSavingsGoalRequest {
  name: string;
  targetAmount: number;
  targetDate: string;
  currency: string;
  color?: string;
  icon?: string;
  initialContribution?: number;
  accountId?: string;
}

export interface UpdateSavingsGoalRequest {
  name: string;
  targetAmount: number;
  targetDate: string;
  color?: string;
  icon?: string;
}

export interface AddContributionRequest {
  amount: number;
  date: string;
  accountId: string;
}

export interface ContributionResponse {
  id: string;
  amount: number;
  date: string;
  accountName: string;
}

const getBudgets = async (activeOnly = true) => {
  const response = await api.get<{ data: Budget[] }>(`/api/Budgets`, {
    params: { activeOnly }
  });
  return response.data.data || [];
};

const getBudgetById = async (id: string) => {
  const response = await api.get<{ data: Budget }>(`/api/Budgets/${id}`);
  return response.data.data;
};

const createBudget = async (data: CreateBudgetRequest) => {
  const response = await api.post<{ data: Budget }>(`/api/Budgets`, data);
  return response.data.data;
};

const updateBudget = async (id: string, data: UpdateBudgetRequest) => {
  const response = await api.put<{ data: Budget }>(`/api/Budgets/${id}`, data);
  return response.data.data;
};

const deleteBudget = async (id: string) => {
  await api.delete(`/api/Budgets/${id}`);
};

const getBudgetProgress = async (id: string) => {
  const response = await api.get<{ data: BudgetProgress }>(`/api/Budgets/${id}/progress`);
  return response.data.data;
};

const getAllBudgetProgress = async () => {
  const response = await api.get<{ data: BudgetProgress[] }>('/api/Budgets/progress');
  return response.data.data || [];
};

const checkBudgetAlerts = async () => {
  await api.post('/api/Budgets/check-alerts');
};

const getSavingsGoals = async (status?: string) => {
  const response = await api.get<{ data: SavingsGoal[] }>('/api/Budgets/goals', {
    params: { status }
  });
  return response.data.data || [];
};

const getSavingsGoalById = async (goalId: string) => {
  const response = await api.get<{ data: SavingsGoal }>(`/api/Budgets/goals/${goalId}`);
  return response.data.data;
};

const createSavingsGoal = async (data: CreateSavingsGoalRequest) => {
  const response = await api.post<{ data: SavingsGoal }>('/api/Budgets/goals', data);
  return response.data.data;
};

const updateSavingsGoal = async (goalId: string, data: UpdateSavingsGoalRequest) => {
  const response = await api.put<{ data: SavingsGoal }>(`/api/Budgets/goals/${goalId}`, data);
  return response.data.data;
};

const pauseSavingsGoal = async (goalId: string) => {
  await api.post(`/api/Budgets/goals/${goalId}/pause`);
};

const resumeSavingsGoal = async (goalId: string) => {
  await api.post(`/api/Budgets/goals/${goalId}/resume`);
};

const cancelSavingsGoal = async (goalId: string) => {
  await api.post(`/api/Budgets/goals/${goalId}/cancel`);
};

const getContributions = async (goalId: string) => {
  const response = await api.get<{ data: ContributionResponse[] }>(`/api/Budgets/goals/${goalId}/contributions`);
  return response.data.data || [];
};

const addContribution = async (goalId: string, data: AddContributionRequest) => {
  const response = await api.post<{ data: ContributionResponse }>(`/api/Budgets/goals/${goalId}/contributions`, data);
  return response.data.data;
};

const withdrawFromGoal = async (goalId: string, amount: number) => {
  await api.post(`/api/Budgets/goals/${goalId}/withdraw`, null, {
    params: { amount }
  });
};

export const budgetsService = {
  getBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetProgress,
  getAllBudgetProgress,
  checkBudgetAlerts,
  getSavingsGoals,
  getSavingsGoalById,
  createSavingsGoal,
  updateSavingsGoal,
  pauseSavingsGoal,
  resumeSavingsGoal,
  cancelSavingsGoal,
  getContributions,
  addContribution,
  withdrawFromGoal
};
