import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { budgetsService } from '../services/budgetsService';
import type { Budget } from '../services/budgetsService';
import { useToast } from '../hooks/useToast';

const Budgets: React.FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const data = await budgetsService.getBudgets();
        setBudgets(data);
      } catch {
        showToast('Error al cargar presupuestos', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBudgets();
  }, [showToast]);

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-white/5 rounded-[2.5rem]"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 animate-fade-in-up pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-white">{t('dashboard.budgets_title', { defaultValue: 'My Budgets' })}</h1>
        <button className="px-8 h-14 bg-accent-purple text-white font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent-purple/20">
          Create Budget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {budgets.length === 0 ? (
          <div className="col-span-full bg-card rounded-[2.5rem] p-20 border border-white/5 flex flex-col items-center justify-center gap-6">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-white/10">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <div className="text-center">
              <div className="text-xl font-black text-white mb-2">No budgets set yet</div>
              <p className="text-white/20 font-medium">Define spending limits to stay on top of your finances.</p>
            </div>
          </div>
        ) : (
          budgets.map((budget) => (
            <div key={budget.id} className="bg-card rounded-[2.5rem] p-10 border border-white/5 hover:border-accent-purple/30 transition-all group overflow-hidden relative">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <h3 className="text-xl font-black text-white group-hover:text-accent-purple transition-colors">{budget.categoryName}</h3>
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/20">{budget.period} Budget</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-white/60 mb-1">{budget.percentage}%</div>
                    </div>
                  </div>

                  <div className="h-3 w-full bg-white/[0.03] rounded-full overflow-hidden mb-6">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(156,124,244,0.4)] ${budget.spentAmount > budget.amount ? 'bg-red-500' : 'bg-accent-purple'}`} 
                      style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center text-sm font-black italic">
                    <div>
                      <div className="text-[10px] text-white/20 font-black uppercase not-italic tracking-widest mb-1">Spent</div>
                      <div className={budget.spentAmount > budget.amount ? 'text-red-500' : 'text-white'}>
                        {formatCurrency(budget.spentAmount, budget.currency)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-white/20 font-black uppercase not-italic tracking-widest mb-1">Limit</div>
                      <div className="text-white/60">
                        {formatCurrency(budget.amount, budget.currency)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-purple/5 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Budgets;
