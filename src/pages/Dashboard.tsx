import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { dashboardService } from '../services/dashboardService';
import { reportService } from '../services/reportService';
import type { FinancialSummary, MonthlyReport } from '../services/reportService';
import { accountService } from '../services/accountService';
import type { Account } from '../services/accountService';
import type { Expense } from '../services/expenseService';
import { useAuth } from '../features/auth/context/AuthContext';
import Modal from '../components/ui/Modal';
import TransactionForm from '../components/forms/TransactionForm';
import AccountForm from '../components/forms/AccountForm';

import i18n from '../i18n';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeModal, setActiveModal] = useState<'expense' | 'income' | 'account' | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      const [summaryData, monthlyData, accountsData, transactions] = await Promise.all([
        reportService.getFinancialSummary(),
        reportService.getMonthlyReport(now.getFullYear(), now.getMonth() + 1),
        accountService.getAccounts(),
        dashboardService.getRecentTransactions()
      ]);

      setSummary(summaryData);
      setReport(monthlyData);
      setAccounts(accountsData);
      setRecentTransactions(transactions as unknown as Expense[]);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = (amount: number | undefined | null, currency = user?.currency || 'USD') => {
    const safeAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
    return new Intl.NumberFormat(i18n.language === 'es' ? 'es-DO' : 'en-US', { 
       style: 'currency', 
       currency: currency 
    }).format(safeAmount);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-10 animate-pulse">
        <div className="h-64 bg-glass rounded-[2.5rem]"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-glass rounded-[2rem]"></div>
          ))}
        </div>
      </div>
    );
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const topCategories = report?.topExpenseCategories || [];

  return (
    <div className="flex flex-col gap-10 animate-fade-in-up pb-10">
      {/* Top Section with Chart Placeholder and Quick Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 h-auto lg:h-[400px]">
         <div className="lg:col-span-2 bg-card rounded-[2.5rem] p-10 border border-border-subtle relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
                <h3 className="text-xl font-black mb-1 text-base-content">{t('dashboard.spending_overview')}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-base-content-muted">{t('dashboard.daily_indicator')}</p>
            </div>
            
            <div className="flex items-end gap-3 h-48 relative z-10">
               {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85, 60, 50].map((h, i) => (
                  <div key={i} className="flex-1 bg-accent-purple/5 rounded-t-full" style={{ height: `${h}%` }}></div>
               ))}
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
         </div>

         <div className="flex flex-col gap-6">
            <div className="bg-accent-purple rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-accent-purple/20">
               <div className="relative z-10">
                  <h4 className="text-[11px] font-black uppercase tracking-widest mb-1 opacity-50">{t('dashboard.current_balance')}</h4>
                  <div className="text-3xl font-black tracking-tighter">
                    {summary ? formatCurrency(summary.netWorth) : formatCurrency(totalBalance)}
                  </div>
               </div>
               <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            </div>
            <div className="bg-card rounded-[2.5rem] p-8 border border-border-subtle flex-1 space-y-8">
               <div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-base-content-muted mb-2">{t('dashboard.monthly_expenses')}</h4>
                  <div className="text-xl font-black text-red-500">
                    -{formatCurrency(report?.totalExpenses || 0)}
                  </div>
               </div>
               <div className="pt-4 border-t border-border-subtle">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-base-content-muted mb-2">{t('dashboard.monthly_income')}</h4>
                  <div className="text-xl font-black text-green-400">
                    +{formatCurrency(report?.totalIncome || 0)}
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Welcome Banner */}
      <div className="relative group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-purple to-indigo-600 rounded-[2rem] opacity-90"></div>
        <div className="relative p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
               <h2 className="text-3xl font-black text-white mb-2">{t('dashboard.welcome', { name: user?.firstName })}</h2>
               <p className="text-white/60 font-medium max-w-md">
                 {report && report.netSavings > 0 
                   ? t('dashboard.savings_positive') 
                   : t('dashboard.savings_negative')}
               </p>
            </div>
            <button className="px-10 h-16 bg-white text-black font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5">
               {t('dashboard.review_report')}
            </button>
        </div>
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-elite p-8 border border-border-subtle group hover:border-accent-purple/30 transition-all">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-accent-purple/10 flex items-center justify-center text-accent-purple border border-accent-purple/20">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-base-content-muted group-hover:text-base-content transition-colors">{t('dashboard.total_balance')}</span>
             </div>
             <div className="text-2xl font-black text-base-content">{summary ? formatCurrency(summary.netWorth) : formatCurrency(totalBalance)}</div>
             <p className="text-[9px] font-bold text-base-content-muted mt-2">{t('dashboard.active_accounts', { count: accounts.length })}</p>
          </div>

          <div className="card-elite p-8 border border-border-subtle group hover:border-green-500/30 transition-all">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-base-content-muted group-hover:text-base-content transition-colors">{t('dashboard.total_income')}</span>
             </div>
             <div className="text-2xl font-black text-green-400">{formatCurrency(report?.totalIncome || 0)}</div>
             <p className="text-[9px] font-bold text-base-content-muted mt-2">{t('dashboard.captured_cycle')}</p>
          </div>

          <div className="card-elite p-8 border border-border-subtle group hover:border-red-500/30 transition-all">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-base-content-muted group-hover:text-base-content transition-colors">{t('dashboard.total_expenses')}</span>
             </div>
             <div className="text-2xl font-black text-red-500">{formatCurrency(report?.totalExpenses || 0)}</div>
             <p className="text-[9px] font-bold text-base-content-muted mt-2">{t('dashboard.deducted_month')}</p>
          </div>

          <div className="card-elite p-8 border border-border-subtle group hover:border-blue-500/30 transition-all">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-base-content-muted group-hover:text-base-content transition-colors">{t('dashboard.net_cash_flow')}</span>
             </div>
             <div className={`text-2xl font-black ${(report?.netSavings || 0) >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                {formatCurrency(report?.netSavings || 0)}
             </div>
             <p className="text-[9px] font-bold text-base-content-muted mt-2">{t('dashboard.performance_overview')}</p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-card rounded-[2.5rem] p-10 border border-border-subtle">
              <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-base-content">{t('dashboard.recent_transactions')}</h3>
                  <button className="text-[10px] font-black uppercase text-accent-purple hover:text-base-content transition-colors">{t('dashboard.view_all')}</button>
              </div>
              
              <div className="space-y-4">
                 {recentTransactions.length === 0 ? (
                    <div className="text-center py-20 text-base-content-muted font-black uppercase tracking-widest text-sm italic">{t('dashboard.no_transactions')}</div>
                 ) : (
                    recentTransactions.map((tx) => (
                        <div key={tx.id} className="group flex items-center justify-between p-6 rounded-[2rem] hover:bg-glass transition-all border border-transparent hover:border-border-subtle">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-glass flex items-center justify-center text-base-content-muted group-hover:text-base-content group-hover:bg-accent-purple/10 transition-all">
                                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div>
                                    <div className="font-black text-base-content group-hover:text-accent-purple transition-colors">{tx.description}</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-base-content-muted">{tx.categoryName} • {new Date(tx.date).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-black text-base-content">{formatCurrency(tx.amount)}</div>
                                <div className="text-[9px] font-black uppercase tracking-tighter text-base-content-muted">{tx.accountName}</div>
                            </div>
                        </div>
                    ))
                 )}
              </div>
          </div>

          {/* Quick Actions & Top Categories */}
          <div className="space-y-10">
              <div className="bg-card rounded-[2.5rem] p-10 border border-border-subtle">
                  <h3 className="text-lg font-black mb-8 text-base-content">{t('dashboard.quick_actions')}</h3>
                   <div className="grid grid-cols-1 gap-4">
                      <button 
                        onClick={() => setActiveModal('expense')}
                        className="flex items-center gap-5 p-6 rounded-[2rem] border-2 border-dashed border-border-subtle hover:border-accent-purple/40 hover:bg-accent-purple/5 transition-all group"
                      >
                          <div className="w-12 h-12 rounded-2xl bg-accent-purple flex items-center justify-center text-white shadow-lg shadow-accent-purple/20">
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                          </div>
                          <span className="font-black text-base-content-muted group-hover:text-base-content transition-colors">{t('dashboard.add_expense')}</span>
                      </button>
                      <button 
                        onClick={() => setActiveModal('income')}
                        className="flex items-center gap-5 p-6 rounded-[2rem] border-2 border-dashed border-border-subtle hover:border-green-500/40 hover:bg-green-500/5 transition-all group"
                      >
                          <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </div>
                          <span className="font-black text-base-content-muted group-hover:text-base-content transition-colors">{t('dashboard.add_income')}</span>
                      </button>
                  </div>
              </div>

               <div className="bg-card rounded-[2.5rem] p-10 border border-border-subtle">
                   <h3 className="text-lg font-black mb-8 text-base-content">{t('dashboard.top_categories')}</h3>
                   <div className="space-y-8">
                       {topCategories.length === 0 ? (
                           <div className="text-sm text-base-content-muted font-black uppercase italic text-center py-10">{t('dashboard.no_data')}</div>
                       ) : (
                           topCategories.map((cat, idx) => (
                               <div key={idx} className="group">
                                   <div className="flex justify-between items-end mb-3">
                                       <div>
                                          <div className="text-[10px] font-black uppercase tracking-widest text-base-content-muted group-hover:text-base-content transition-colors mb-1">{cat.name}</div>
                                          <div className="text-sm font-black text-base-content">{formatCurrency(cat.amount)}</div>
                                       </div>
                                   </div>
                                   <div className="h-2 w-full bg-glass rounded-full overflow-hidden">
                                       <div 
                                         className="h-full bg-accent-purple rounded-full shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all duration-1000" 
                                         style={{ width: `${Math.min((cat.amount / (report?.totalExpenses || 1)) * 100, 100)}%` }}
                                       ></div>
                                   </div>
                                </div>
                            ))
                       )}
                   </div>
               </div>
          </div>
      </div>

      <Modal 
        isOpen={!!activeModal} 
        onClose={() => setActiveModal(null)}
        title={activeModal === 'expense' ? t('dashboard.add_expense') : activeModal === 'income' ? t('dashboard.add_income') : t('accounts.add_account')}
      >
        {activeModal === 'account' ? (
          <AccountForm onCancel={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); fetchData(); }} />
        ) : (
          <TransactionForm 
            type={activeModal === 'expense' ? 'Expense' : 'Income'} 
            onCancel={() => setActiveModal(null)}
            onSuccess={() => {
              setActiveModal(null);
              fetchData();
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
