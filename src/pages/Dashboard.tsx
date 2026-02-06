import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { dashboardService } from '../services/dashboardService';
import type { FinancialSummary, AccountSummary, Expense, CategoryBreakdown } from '../services/dashboardService';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [accSummary, setAccSummary] = useState<AccountSummary | null>(null);
  const [transactions, setTransactions] = useState<Expense[]>([]);
  const [topCategories, setTopCategories] = useState<CategoryBreakdown[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

        const [finData, accData, txData, catData] = await Promise.all([
          dashboardService.getFinancialSummary(startOfMonth, endOfMonth),
          dashboardService.getAccountSummary(),
          dashboardService.getRecentTransactions(),
          dashboardService.getTopCategories(startOfMonth, endOfMonth)
        ]);

        setSummary(finData);
        setAccSummary(accData);
        setTransactions(txData);
        setTopCategories(catData);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl p-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-2">{t('dashboard.welcome')}</h2>
          <p className="text-indigo-100 opacity-90">{t('dashboard.description')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Total Balance */}
          <div className="stats shadow bg-white text-gray-700 stat-card border border-gray-100">
            <div className="stat">
                <div className="stat-figure text-indigo-600">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                </div>
                <div className="stat-title">{t('dashboard.total_balance')}</div>
                <div className="stat-value text-2xl">{accSummary ? formatCurrency(accSummary.totalBalance, accSummary.currency) : '$0.00'}</div>
                <div className="stat-desc">{accSummary?.activeAccountsCount} active accounts</div>
            </div>
          </div>

          {/* Income */}
          <div className="stats shadow bg-white text-gray-700 border border-gray-100">
            <div className="stat">
                <div className="stat-figure text-green-600">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <div className="stat-title">{t('dashboard.total_income')}</div>
                <div className="stat-value text-2xl text-green-600">{summary ? formatCurrency(summary.totalIncome, summary.currency) : '$0.00'}</div>
                <div className="stat-desc">This Month</div>
            </div>
          </div>

          {/* Expenses */}
          <div className="stats shadow bg-white text-gray-700 border border-gray-100">
            <div className="stat">
                <div className="stat-figure text-pink-600">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                </div>
                <div className="stat-title">{t('dashboard.total_expenses')}</div>
                <div className="stat-value text-2xl text-pink-600">{summary ? formatCurrency(summary.totalExpenses, summary.currency) : '$0.00'}</div>
                <div className="stat-desc">This Month</div>
            </div>
          </div>

          {/* Net Balance / Cash Flow */}
          <div className="stats shadow bg-white text-gray-700 border border-gray-100">
            <div className="stat">
                <div className="stat-figure text-blue-600">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="stat-title">Net Cash Flow</div>
                <div className={`stat-value text-2xl ${summary && summary.netBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {summary ? formatCurrency(summary.netBalance, summary.currency) : '$0.00'}
                </div>
                <div className="stat-desc">Income - Expenses</div>
            </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 p-6 h-fit">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.recent_transactions')}</h3>
                  <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">{t('dashboard.view_all')}</button>
              </div>
              <div className="overflow-x-auto">
                 {transactions.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">{t('dashboard.no_transactions')}</div>
                 ) : (
                    <table className="table w-full">
                        {/* head */}
                        <thead>
                            <tr className="bg-gray-50">
                                <th>{t('dashboard.description')}</th>
                                <th>{t('dashboard.date')}</th>
                                <th>{t('dashboard.category')}</th>
                                <th className="text-right">{t('dashboard.amount')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((t) => (
                                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="font-medium text-gray-900">{t.description}</td>
                                    <td className="text-gray-500 text-sm">{new Date(t.date).toLocaleDateString()}</td>
                                    <td>
                                       <span className="badge badge-ghost badge-sm">{t.categoryName}</span>
                                    </td>
                                    <td className="text-right font-medium text-gray-900">
                                        {formatCurrency(t.amount, t.currency)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 )}
              </div>
          </div>

          {/* Quick Actions / Mini Widget */}
          <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.quick_actions')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                      <button className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all group">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mb-2 group-hover:bg-indigo-200 transition-colors">
                              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                          </div>
                          <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-700">{t('dashboard.add_expense')}</span>
                      </button>
                       <button className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all group">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2 group-hover:bg-green-200 transition-colors">
                              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          </div>
                          <span className="text-sm font-medium text-gray-600 group-hover:text-green-700">{t('dashboard.add_income')}</span>
                      </button>
                  </div>
              </div>

               <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 p-6">
                   <h4 className="text-lg font-semibold text-gray-900 mb-3">Top Categories</h4>
                   <div className="space-y-4">
                       {topCategories.length === 0 ? (
                           <div className="text-sm text-gray-500">No data available</div>
                       ) : (
                           topCategories.map((cat, idx) => (
                               <div key={idx}>
                                   <div className="flex justify-between text-xs text-gray-500 mb-1">
                                       <span>{cat.categoryName}</span>
                                       <span>{cat.percentage}%</span>
                                   </div>
                                   <progress className="progress progress-primary w-full" value={cat.percentage} max="100"></progress>
                               </div>
                           ))
                       )}
                   </div>
               </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
