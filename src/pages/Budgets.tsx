import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { budgetsService } from '../services/budgetsService';
import type { Budget, SavingsGoal } from '../services/budgetsService';
import { useToast } from '../hooks/useToast';
import Modal from '../components/ui/Modal';
import BudgetForm from '../components/forms/BudgetForm';
import SavingsGoalForm from '../components/forms/SavingsGoalForm';

const Budgets: React.FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<'budget' | 'goal' | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [budgetData, goalsData] = await Promise.all([
        budgetsService.getBudgets(),
        budgetsService.getSavingsGoals()
      ]);
      setBudgets(budgetData);
      setSavingsGoals(goalsData);
    } catch {
      showToast(t('common.error'), 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-white/5 rounded-[2.5rem]"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-white/5 rounded-[2.5rem]"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-20 animate-fade-in-up pb-10">
      <section>
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-black text-white">{t('budgets.title')}</h1>
          <button 
            onClick={() => setActiveModal('budget')}
            className="px-8 h-14 bg-accent-purple text-white font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent-purple/20"
          >
            {t('budgets.create_budget')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {budgets.length === 0 ? (
            <div className="col-span-full bg-card rounded-[2.5rem] p-20 border border-white/5 flex flex-col items-center justify-center gap-6">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-white/10">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <div className="text-center">
                <div className="text-xl font-black text-white mb-2">{t('budgets.no_budgets')}</div>
                <p className="text-white/20 font-medium">{t('budgets.description')}</p>
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
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/20">{budget.period} {t('budgets.budget_label')}</div>
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
                        <div className="text-[10px] text-white/20 font-black uppercase not-italic tracking-widest mb-1">{t('budgets.spent')}</div>
                        <div className={budget.spentAmount > budget.amount ? 'text-red-500' : 'text-white'}>
                          {formatCurrency(budget.spentAmount, budget.currency)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-white/20 font-black uppercase not-italic tracking-widest mb-1">{t('budgets.limit')}</div>
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
      </section>

      <section>
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black text-white">{t('savings_goals.title')}</h2>
          <button 
            onClick={() => setActiveModal('goal')}
            className="px-8 h-14 bg-green-500 text-white font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-green-500/20"
          >
            {t('savings_goals.create_goal')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {savingsGoals.length === 0 ? (
            <div className="col-span-full bg-card rounded-[2.5rem] p-20 border border-white/5 text-center flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-white/10">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div className="text-xl font-black text-white italic">{t('savings_goals.description')}</div>
            </div>
          ) : (
            savingsGoals.map((goal) => {
              const percentage = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={goal.id} className="bg-card rounded-[2.5rem] p-10 border border-white/5 hover:border-green-500/30 transition-all group relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <h3 className="text-xl font-black text-white group-hover:text-green-500 transition-colors">{goal.name}</h3>
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/20">{goal.status}</div>
                      </div>
                      <div className="text-sm font-black text-green-400">{percentage.toFixed(1)}%</div>
                    </div>

                    <div className="h-4 w-full bg-white/[0.03] rounded-full overflow-hidden mb-6 p-1">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(34,197,94,0.4)]" 
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center text-sm font-black italic">
                      <div>
                        <div className="text-[10px] text-white/20 font-black uppercase not-italic tracking-widest mb-1">{t('savings_goals.current')}</div>
                        <div className="text-white">
                          {formatCurrency(goal.currentAmount, goal.currency)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-white/20 font-black uppercase not-italic tracking-widest mb-1">{t('savings_goals.target')}</div>
                        <div className="text-white/60">
                          {formatCurrency(goal.targetAmount, goal.currency)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-green-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <Modal
        isOpen={activeModal === 'budget'}
        onClose={() => setActiveModal(null)}
        title={t('budgets.new_budget')}
      >
        <BudgetForm onSuccess={() => { setActiveModal(null); fetchData(); }} onCancel={() => setActiveModal(null)} />
      </Modal>

      <Modal
        isOpen={activeModal === 'goal'}
        onClose={() => setActiveModal(null)}
        title={t('savings_goals.new_goal')}
      >
        <SavingsGoalForm onSuccess={() => { setActiveModal(null); fetchData(); }} onCancel={() => setActiveModal(null)} />
      </Modal>
    </div>
  );
};

export default Budgets;
