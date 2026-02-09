import api from './api';

export interface FinancialSummary {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  monthlyCashFlow: number;
  unbudgetedSpending: number;
  savingsRate: number;
}

export interface MonthlyReport {
  month: number;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  topExpenseCategories: { name: string; amount: number }[];
  incomeSources: { name: string; amount: number }[];
}

export interface YearlyReport {
  year: number;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  monthlyBreakdown: { month: number; income: number; expenses: number }[];
}

export interface ComparisonReportRequest {
  period1Start: string;
  period1End: string;
  period2Start: string;
  period2End: string;
}

export interface ComparisonReportResponse {
  period1Income: number;
  period1Expenses: number;
  period2Income: number;
  period2Expenses: number;
  incomeChangePercentage: number;
  expenseChangePercentage: number;
}

export interface BudgetPerformance {
  budgetName: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  performancePercentage: number;
  status: 'UnderBudget' | 'NearLimit' | 'OverBudget';
}

const getFinancialSummary = async (fromDate?: string, toDate?: string) => {
  const response = await api.get<{ data: FinancialSummary }>('/api/Reports/summary', {
    params: { fromDate, toDate }
  });
  return response.data.data;
};

const getMonthlyReport = async (year: number, month: number) => {
  const response = await api.get<{ data: MonthlyReport }>(`/api/Reports/monthly`, {
    params: { year, month }
  });
  return response.data.data;
};

const getYearlyReport = async (year: number) => {
  const response = await api.get<{ data: YearlyReport }>(`/api/Reports/yearly`, {
    params: { year }
  });
  return response.data.data;
};

const getComparisonReport = async (data: ComparisonReportRequest) => {
  const response = await api.post<{ data: ComparisonReportResponse }>('/api/Reports/comparison', data);
  return response.data.data;
};

const getBudgetPerformance = async () => {
  const response = await api.get<{ data: BudgetPerformance[] }>('/api/Reports/budget-performance');
  return response.data.data || [];
};

export const reportService = {
  getFinancialSummary,
  getMonthlyReport,
  getYearlyReport,
  getComparisonReport,
  getBudgetPerformance
};
