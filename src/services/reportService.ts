import api from './api';

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  savingsRate: number;
  currency: string;
  fromDate: string;
  toDate: string;
}

export interface CategoryBreakdownItem {
  categoryId: string;
  categoryName: string;
  categoryIcon?: string;
  categoryColor?: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface IncomeSourceBreakdownItem {
  sourceId: string;
  sourceName: string;
  amount: number;
  percentage: number;
}

export interface DailyBalanceItem {
  date: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface MonthlyReport {
  year: number;
  month: number;
  monthName: string;
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  savingsRate: number;
  currency: string;
  expensesByCategory: CategoryBreakdownItem[];
  incomeBySource: IncomeSourceBreakdownItem[];
  dailyBalance: DailyBalanceItem[];
  comparedToPreviousMonth: number;
}

export interface MonthlyTrendItem {
  month: number;
  monthName: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface YearlyReport {
  year: number;
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  averageMonthlySavings: number;
  currency: string;
  monthlyTrends: MonthlyTrendItem[];
  expensesByCategory: CategoryBreakdownItem[];
}

export interface ComparisonReportRequest {
  period1Start: string;
  period1End: string;
  period2Start: string;
  period2End: string;
}

export interface PeriodSummary {
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface CategoryComparisonItem {
  categoryId: string;
  categoryName: string;
  period1Amount: number;
  period2Amount: number;
  change: number;
  changePercentage: number;
}

export interface ComparisonReportResponse {
  period1: PeriodSummary;
  period2: PeriodSummary;
  incomeChange: number;
  incomeChangePercentage: number;
  expenseChange: number;
  expenseChangePercentage: number;
  balanceChange: number;
  categoryComparison: CategoryComparisonItem[];
}

export interface BudgetPerformance {
  budgetName: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  performancePercentage: number;
  status: 'UnderBudget' | 'NearLimit' | 'OverBudget' | string;
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
