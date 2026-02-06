import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { dashboardService } from '../services/dashboardService';
import type { FinancialSummary, AccountSummary, Expense, CategoryBreakdown, DailySummary } from '../services/dashboardService';
import { useAuth } from '../features/auth/context/AuthContext';
import Modal from '../components/ui/Modal';
import TransactionForm from '../components/forms/TransactionForm';
import AccountForm from '../components/forms/AccountForm';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [accSummary, setAccSummary] = useState<AccountSummary | null>(null);
  const [dailySummary, setDailySummary] = useState<DailySummary[]>([]);
  const [transactions, setTransactions] = useState<Expense[]>([]);
  const [topCategories, setTopCategories] = useState<CategoryBreakdown[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [activeModal, setActiveModal] = useState<'expense' | 'income' | 'account' | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

      const [finData, accData, txData, catData, dailyData] = await Promise.all([
        dashboardService.getFinancialSummary(startOfMonth, endOfMonth),
        dashboardService.getAccountSummary(),
        dashboardService.getRecentTransactions(),
        dashboardService.getTopCategories(startOfMonth, endOfMonth),
        dashboardService.getDailyExpenses(startOfMonth, endOfMonth)
      ]);

      setSummary(finData);
      setAccSummary(accData);
      setTransactions(txData || []);
      
      const safeCatData = catData || [];
      setTopCategories(safeCatData.sort((a, b) => b.amount - a.amount).slice(0, 4));
      
      setDailySummary(dailyData || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
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

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
           <div className="lg:col-span-3 h-80 bg-white/5 rounded-[2.5rem]"></div>
           <div className="h-80 bg-white/5 rounded-[2.5rem]"></div>
        </div>
        <div className="h-24 bg-white/5 rounded-[2rem]"></div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
           {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-white/5 rounded-[2rem]"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 animate-fade-in-up pb-10">
      
      {/* Top Section: Cash Flow & Net Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in">
        <div className="lg:col-span-3 bg-card rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden group">
           <div className="flex justify-between items-center mb-10 relative z-10">
              <h3 className="text-2xl font-black">{t('dashboard.cash_flow')}</h3>
              <div className="flex gap-4">
                 <span className="text-[10px] font-black uppercase text-white hover:text-accent-purple cursor-pointer transition-colors px-2">{t('dashboard.days')}</span>
                 <span className="text-[10px] font-black uppercase text-white/20 hover:text-white cursor-pointer transition-colors px-2">{t('dashboard.weeks')}</span>
                 <span className="text-[10px] font-black uppercase text-white/20 hover:text-white cursor-pointer transition-colors px-2">{t('dashboard.months')}</span>
              </div>
           </div>
           
           <div className="h-64 flex items-end gap-2 px-4 relative z-10">
              {dailySummary.length > 0 ? (
                dailySummary.map((d, i) => {
                  const maxAmount = Math.max(...dailySummary.map(x => x.amount), 1);
                  const height = (d.amount / maxAmount) * 100;
                  return (
                    <div key={i} className="flex-1 bg-accent-purple/5 rounded-t-full group/bar cursor-pointer hover:bg-accent-purple/20 transition-all flex flex-col justify-end overflow-hidden" style={{ height: `${height}%` }}>
                       <div className="h-full w-full bg-accent-purple opacity-40 transition-opacity"></div>
                       <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white text-black text-[9px] font-black rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                          {formatCurrency(d.amount)}
                       </div>
                    </div>
                  );
                })
              ) : (
                [3,5,2,8,4,6,3,9,5,7,4,5,2,8,4,6].map((h, i) => (
                  <div key={i} className="flex-1 bg-accent-purple/5 rounded-t-full" style={{ height: `${h * 10}%` }}></div>
                ))
              )}
           </div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
        </div>

        <div className="flex flex-col gap-6">
           <div className="bg-accent-purple rounded-[2.5rem] p-8 text-black relative overflow-hidden group shadow-2xl shadow-accent-purple/20">
              <div className="relative z-10">
                 <h4 className="text-[11px] font-black uppercase tracking-widest mb-1 opacity-50">{t('dashboard.current_balance')}</h4>
                 <div className="text-3xl font-black tracking-tighter">
                   {accSummary ? formatCurrency(accSummary.totalBalance, accSummary.currency) : '$0.00'}
                 </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
           </div>
           <div className="bg-card rounded-[2.5rem] p-8 border border-white/5 flex-1 space-y-8">
              <div>
                 <h4 className="text-[11px] font-black uppercase tracking-widest text-white/20 mb-2">{t('dashboard.monthly_expenses')}</h4>
                 <div className="text-xl font-black text-red-500">
                   -{summary ? formatCurrency(summary.totalExpenses, summary.currency) : '$0.00'}
                 </div>
              </div>
              <div className="pt-4 border-t border-white/5">
                 <h4 className="text-[11px] font-black uppercase tracking-widest text-white/20 mb-2">{t('dashboard.monthly_income')}</h4>
                 <div className="text-xl font-black text-green-400">
                   +{summary ? formatCurrency(summary.totalIncome, summary.currency) : '$0.00'}
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
                {t('dashboard.welcome_description', { trend: summary && summary.netBalance > 0 ? t('dashboard.more') : t('dashboard.less') })}
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
          <div className="card-elite p-8 border border-white/5 group hover:border-accent-purple/30 transition-all">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-accent-purple/10 flex items-center justify-center text-accent-purple border border-accent-purple/20">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors">{t('dashboard.total_balance')}</span>
             </div>
             <div className="text-2xl font-black text-white">{accSummary ? formatCurrency(accSummary.totalBalance, accSummary.currency) : '$0.00'}</div>
             <p className="text-[9px] font-bold text-white/20 mt-2">{accSummary?.activeAccountsCount} active accounts monitored</p>
          </div>

          <div className="card-elite p-8 border border-white/5 group hover:border-green-500/30 transition-all">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors">{t('dashboard.total_income')}</span>
             </div>
             <div className="text-2xl font-black text-green-400">{summary ? formatCurrency(summary.totalIncome, summary.currency) : '$0.00'}</div>
             <p className="text-[9px] font-bold text-white/20 mt-2">Captured this billing cycle</p>
          </div>

          <div className="card-elite p-8 border border-white/5 group hover:border-red-500/30 transition-all">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors">{t('dashboard.total_expenses')}</span>
             </div>
             <div className="text-2xl font-black text-red-500">{summary ? formatCurrency(summary.totalExpenses, summary.currency) : '$0.00'}</div>
             <p className="text-[9px] font-bold text-white/20 mt-2">Deducted current month</p>
          </div>

          <div className="card-elite p-8 border border-white/5 group hover:border-blue-500/30 transition-all">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors">{t('dashboard.net_cash_flow')}</span>
             </div>
             <div className={`text-2xl font-black ${summary && summary.netBalance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                {summary ? formatCurrency(summary.netBalance, summary.currency) : '$0.00'}
             </div>
             <p className="text-[9px] font-bold text-white/20 mt-2">Net performance overview</p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-card rounded-[2.5rem] p-10 border border-white/5">
              <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black">{t('dashboard.recent_transactions')}</h3>
                  <button className="text-[10px] font-black uppercase text-accent-purple hover:text-white transition-colors">{t('dashboard.view_all')}</button>
              </div>
              
              <div className="space-y-4">
                 {transactions.length === 0 ? (
                    <div className="text-center py-20 text-white/10 font-black uppercase tracking-widest text-sm italic">{t('dashboard.no_transactions')}</div>
                 ) : (
                    transactions.map((t) => (
                        <div key={t.id} className="group flex items-center justify-between p-6 rounded-[2rem] hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/60 group-hover:text-white group-hover:bg-accent-purple/10 transition-all">
                                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div>
                                    <div className="font-black text-white group-hover:text-accent-purple transition-colors">{t.description}</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-white/20">{t.categoryName} • {new Date(t.date).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-black text-white">{formatCurrency(t.amount, t.currency)}</div>
                                <div className="text-[9px] font-black uppercase tracking-tighter text-white/10">{t.accountName}</div>
                            </div>
                        </div>
                    ))
                 )}
              </div>
          </div>

          {/* Quick Actions & Top Categories */}
          <div className="space-y-10">
              <div className="bg-card rounded-[2.5rem] p-10 border border-white/5">
                  <h3 className="text-lg font-black mb-8">{t('dashboard.quick_actions')}</h3>
                   <div className="grid grid-cols-1 gap-4">
                      <button 
                        onClick={() => setActiveModal('expense')}
                        className="flex items-center gap-5 p-6 rounded-[2rem] border-2 border-dashed border-white/5 hover:border-accent-purple/40 hover:bg-accent-purple/5 transition-all group"
                      >
                          <div className="w-12 h-12 rounded-2xl bg-accent-purple flex items-center justify-center text-white shadow-lg shadow-accent-purple/20">
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                          </div>
                          <span className="font-black text-white/60 group-hover:text-white transition-colors">{t('dashboard.add_expense')}</span>
                      </button>
                      <button 
                        onClick={() => setActiveModal('income')}
                        className="flex items-center gap-5 p-6 rounded-[2rem] border-2 border-dashed border-white/5 hover:border-green-500/40 hover:bg-green-500/5 transition-all group"
                      >
                          <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </div>
                          <span className="font-black text-white/60 group-hover:text-white transition-colors">{t('dashboard.add_income')}</span>
                      </button>
                      <button 
                        onClick={() => setActiveModal('account')}
                        className="flex items-center gap-5 p-6 rounded-[2rem] border-2 border-dashed border-white/5 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all group"
                      >
                          <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          </div>
                          <span className="font-black text-white/60 group-hover:text-white transition-colors">Add Account</span>
                      </button>
                  </div>
              </div>

               <div className="bg-card rounded-[2.5rem] p-10 border border-white/5">
                   <h3 className="text-lg font-black mb-8">{t('dashboard.top_categories')}</h3>
                   <div className="space-y-8">
                       {topCategories.length === 0 ? (
                           <div className="text-sm text-white/20 font-black uppercase italic text-center py-10">No data available</div>
                       ) : (
                           topCategories.map((cat, idx) => (
                               <div key={idx} className="group">
                                   <div className="flex justify-between items-end mb-3">
                                       <div>
                                          <div className="text-[10px] font-black uppercase tracking-widest text-white/30 group-hover:text-white/60 transition-colors mb-1">{cat.categoryName}</div>
                                          <div className="text-sm font-black text-white">{formatCurrency(cat.amount)}</div>
                                       </div>
                                       <div className="text-xs font-black text-accent-purple">{cat.percentage}%</div>
                                   </div>
                                   <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden">
                                       <div 
                                         className="h-full bg-accent-purple rounded-full shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all duration-1000" 
                                         style={{ width: `${cat.percentage}%` }}
                                       ></div>
                                   </div>
                               </div>
                           ))
                       )}
                   </div>
               </div>
          </div>
      </div>

      {/* Modals */}
      <Modal 
        isOpen={activeModal === 'expense' || activeModal === 'income'} 
        onClose={() => setActiveModal(null)}
        title={activeModal === 'expense' ? t('dashboard.add_expense') : t('dashboard.add_income')}
      >
        <TransactionForm 
          type={activeModal === 'expense' ? 'Expense' : 'Income'} 
          onCancel={() => setActiveModal(null)}
          onSuccess={() => {
            setActiveModal(null);
            fetchData();
          }}
        />
      </Modal>

      <Modal 
        isOpen={activeModal === 'account'} 
        onClose={() => setActiveModal(null)}
        title="Add New Account"
      >
        <AccountForm 
          onCancel={() => setActiveModal(null)}
          onSuccess={() => {
            setActiveModal(null);
            fetchData();
          }}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
