import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { reportService } from '../services/reportService';
import { expenseService } from '../services/expenseService';
import { incomeService } from '../services/incomeService';
import type { MonthlyReport, FinancialSummary, BudgetPerformance } from '../services/reportService';
import { useToast } from '../hooks/useToast';

const Reports: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport | null>(null);
  const [budgetPerformance, setBudgetPerformance] = useState<BudgetPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      const [summaryData, monthlyData, performanceData] = await Promise.all([
        reportService.getFinancialSummary(),
        reportService.getMonthlyReport(currentYear, currentMonth),
        reportService.getBudgetPerformance()
      ]);

      setSummary(summaryData);
      setMonthlyReport(monthlyData);
      setBudgetPerformance(performanceData);
    } catch (error) {
      console.error('Failed to fetch reports data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const handleExportIncome = async () => {
    try {
      const data = await incomeService.exportIncomeByExcel();
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `income-report-${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast(t('common.export_success'), 'success');
    } catch {
      showToast(t('common.export_error'), 'error');
    }
  };

  const handleExportExpenses = async (format: 'excel' | 'csv') => {
    try {
      const data = format === 'excel' ? await expenseService.exportExpensesByExcel() : await expenseService.exportExpensesByCsv();
      const blob = new Blob([data], { type: format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `expense-report-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast(t('common.export_success'), 'success');
    } catch {
      showToast(t('common.export_error'), 'error');
    }
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-glass rounded-[2rem]"></div>)}
      </div>
      <div className="h-96 bg-glass rounded-[2.5rem]"></div>
    </div>;
  }

  return (
    <div className="flex flex-col gap-10 animate-fade-in-up pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter mb-2 text-base-content">{t('reports.title')}</h1>
          <p className="text-base-content-muted font-medium">{t('reports.description')}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-black uppercase text-base-content-muted tracking-widest px-2">{t('reports.income_label')}</span>
            <button 
              onClick={() => handleExportIncome()}
              className="h-10 bg-green-500/10 hover:bg-green-500/20 text-green-500 px-5 rounded-xl border border-green-500/20 font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5l5 5v11a2 2 0 01-2 2z" /></svg>
              {t('transactions.excel_export')}
            </button>
          </div>
          <div className="w-px h-10 bg-border-subtle mx-2 self-end mb-1"></div>
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-black uppercase text-base-content-muted tracking-widest px-2">{t('reports.expenses_label')}</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleExportExpenses('excel')}
                className="h-10 bg-accent-purple/10 hover:bg-accent-purple/20 text-accent-purple px-5 rounded-xl border border-accent-purple/20 font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5l5 5v11a2 2 0 01-2 2z" /></svg>
                {t('transactions.excel_export')}
              </button>
              <button 
                onClick={() => handleExportExpenses('csv')}
                className="h-10 bg-glass hover:bg-glass/20 text-base-content-muted px-5 rounded-xl border border-border-subtle font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5l5 5v11a2 2 0 01-2 2z" /></svg>
                {t('transactions.csv_export')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-[2rem] p-8 border border-border-subtle">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-base-content-muted mb-2">{t('reports.net_worth')}</h4>
          <div className="text-3xl font-black text-base-content">{summary ? formatCurrency(summary.netBalance) : '$0.00'}</div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-green-500">+{summary?.savingsRate || 0}% {t('reports.savings_rate_label')}</span>
          </div>
        </div>
        <div className="bg-card rounded-[2rem] p-8 border border-border-subtle">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-base-content-muted mb-2">{t('reports.total_income')}</h4>
          <div className="text-3xl font-black text-green-400">{summary ? formatCurrency(summary.totalIncome) : '$0.00'}</div>
        </div>
        <div className="bg-card rounded-[2rem] p-8 border border-border-subtle">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-base-content-muted mb-2">{t('reports.total_expenses')}</h4>
          <div className="text-3xl font-black text-red-500">{summary ? formatCurrency(summary.totalExpenses) : '$0.00'}</div>
        </div>
      </div>

      {/* Monthly Breakdown Chart */}
      <div className="bg-card rounded-[2.5rem] p-10 border border-border-subtle">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-xl font-black text-base-content">{t('reports.monthly_performance')}</h3>
          <div className="text-sm font-black text-base-content-muted">{new Date().toLocaleString(i18n.language, { month: 'long', year: 'numeric' })}</div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-4">
                <span className="text-sm font-black text-base-content-muted">{t('reports.income_vs_expenses')}</span>
                <span className="text-sm font-black text-base-content">{monthlyReport ? ((monthlyReport.totalExpenses / monthlyReport.totalIncome) * 100).toFixed(1) : 0}%</span>
              </div>
              <div className="h-4 w-full bg-glass rounded-full overflow-hidden flex border border-border-subtle">
                <div 
                  className="h-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]" 
                  style={{ width: monthlyReport ? `${(monthlyReport.totalIncome / (monthlyReport.totalIncome + monthlyReport.totalExpenses)) * 100}%` : '50%' }}
                ></div>
                <div 
                  className="h-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]" 
                  style={{ width: monthlyReport ? `${(monthlyReport.totalExpenses / (monthlyReport.totalIncome + monthlyReport.totalExpenses)) * 100}%` : '50%' }}
                ></div>
              </div>
              <div className="flex justify-between mt-3 text-[10px] font-black uppercase">
                <span className="text-green-500">{t('reports.income_label')}: {monthlyReport ? formatCurrency(monthlyReport.totalIncome) : '$0'}</span>
                <span className="text-red-500">{t('reports.expenses_label')}: {monthlyReport ? formatCurrency(monthlyReport.totalExpenses) : '$0'}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-border-subtle">
              <h4 className="text-sm font-black mb-6 text-base-content-muted">{t('reports.top_expense_categories')}</h4>
              <div className="space-y-4">
                {monthlyReport?.expensesByCategory.map((cat, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                        <span className="text-base-content">{cat.categoryName}</span>
                        <span className="text-base-content">{formatCurrency(cat.amount)}</span>
                      </div>
                      <div className="h-1.5 w-full bg-glass border border-border-subtle rounded-full overflow-hidden">
                        <div className="h-full bg-accent-purple" style={{ width: monthlyReport ? `${(cat.amount / Math.max(monthlyReport.totalExpenses, 1)) * 100}%` : '0%' }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-glass rounded-[2rem] p-8 border border-border-subtle">
            <h4 className="text-sm font-black mb-6 text-base-content-muted">{t('reports.budget_performance')}</h4>
            <div className="space-y-6">
              {budgetPerformance.map((bp, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                    <span className="text-base-content">{bp.budgetName}</span>
                    <span className={bp.status === 'OverBudget' ? 'text-red-500' : bp.status === 'NearLimit' ? 'text-yellow-500' : 'text-green-500'}>
                      {bp.performancePercentage}% {t('reports.used')}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-glass border border-border-subtle rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${bp.status === 'OverBudget' ? 'bg-red-500' : bp.status === 'NearLimit' ? 'bg-yellow-500' : 'bg-green-500'}`} 
                      style={{ width: `${Math.min(bp.performancePercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
