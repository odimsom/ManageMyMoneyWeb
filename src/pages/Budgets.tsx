import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { budgetsService } from '../services/budgetsService';
import type { Budget, SavingsGoal } from '../services/budgetsService';
import { accountService } from '../services/accountService';
import type { Account } from '../services/accountService';
import { useToast } from '../hooks/useToast';
import Modal from '../components/ui/Modal';
import BudgetForm from '../components/forms/BudgetForm';
import SavingsGoalForm from '../components/forms/SavingsGoalForm';

const Budgets: React.FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<'budget' | 'goal' | 'contribution' | 'withdrawal' | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [actionAmount, setActionAmount] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [budgetData, goalsData, accountsData] = await Promise.all([
        budgetsService.getBudgets(),
        budgetsService.getSavingsGoals(),
        accountService.getAccounts()
      ]);
      setBudgets(budgetData);
      setSavingsGoals(goalsData);
      setAccounts(accountsData);
      if (accountsData.length > 0) setSelectedAccountId(accountsData[0].id);
    } catch {
      showToast(t('common.error'), 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteBudget = async (id: string) => {
    if (!window.confirm(t('common.confirm_delete'))) return;
    try {
      await budgetsService.deleteBudget(id);
      showToast(t('common.success'), 'success');
      fetchData();
    } catch {
      showToast(t('common.error'), 'error');
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (!window.confirm(t('common.confirm_delete'))) return;
    try {
      await budgetsService.cancelSavingsGoal(id);
      showToast(t('common.success'), 'success');
      fetchData();
    } catch {
      showToast(t('common.error'), 'error');
    }
  };

  const handleFormSuccess = () => {
    setActiveModal(null);
    setEditingBudget(null);
    setEditingGoal(null);
    fetchData();
  };

  const handleActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal || !actionAmount || !selectedAccountId) return;
    
    setIsSubmitting(true);
    try {
      const amount = parseFloat(actionAmount);
      if (activeModal === 'contribution') {
        await budgetsService.addContribution(selectedGoal.id, {
          amount,
          date: new Date().toISOString(),
          accountId: selectedAccountId
        });
      } else if (activeModal === 'withdrawal') {
        await budgetsService.withdrawFromGoal(selectedGoal.id, amount);
      }
      
      showToast(t('common.success'), 'success');
      setActiveModal(null);
      setActionAmount('');
      fetchData();
    } catch {
      showToast(t('common.error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-glass rounded-[2.5rem]"></div>
          ))}
        </div>
      </div>
    );
  }

  const inputClasses = "w-full h-14 bg-glass border border-border-subtle rounded-2xl px-6 text-base-content placeholder:text-base-content-muted focus:border-accent-purple/50 focus:bg-glass/20 outline-none transition-all font-medium";
  const labelClasses = "text-[10px] font-black uppercase tracking-widest text-base-content-muted mb-2 block ml-4";

  return (
    <div className="flex flex-col gap-20 animate-fade-in-up pb-10">
      <section>
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-black text-base-content">{t('budgets.title')}</h1>
          <button 
            onClick={() => setActiveModal('budget')}
            className="px-8 h-14 bg-accent-purple text-white font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent-purple/20"
          >
            {t('budgets.create_budget')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {budgets.length === 0 ? (
            <div className="col-span-full bg-card rounded-[2.5rem] p-20 border border-border-subtle flex flex-col items-center justify-center gap-6">
              <div className="w-20 h-20 bg-glass border border-border-subtle rounded-full flex items-center justify-center text-base-content-muted">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <div className="text-center">
                <div className="text-xl font-black text-base-content mb-2">{t('budgets.no_budgets')}</div>
                <p className="text-base-content-muted font-medium">{t('budgets.description')}</p>
              </div>
            </div>
          ) : (
            budgets.map((budget) => (
              <div key={budget.id} className="bg-card rounded-[2.5rem] p-10 border border-border-subtle hover:border-accent-purple/30 transition-all group overflow-hidden relative">
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <h3 className="text-xl font-black text-base-content group-hover:text-accent-purple transition-colors">{budget.categoryName}</h3>
                        <div className="text-[10px] font-black uppercase tracking-widest text-base-content-muted">{budget.period} {t('budgets.budget_label')}</div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setEditingBudget(budget); setActiveModal('budget'); }}
                          className="w-8 h-8 rounded-lg bg-glass hover:bg-accent-purple/20 text-base-content-muted hover:text-accent-purple flex items-center justify-center transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteBudget(budget.id)}
                          className="w-8 h-8 rounded-lg bg-glass hover:bg-red-500/20 text-base-content-muted hover:text-red-500 flex items-center justify-center transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>

                    <div className="h-3 w-full bg-glass rounded-full overflow-hidden mb-6">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(156,124,244,0.4)] ${budget.spentAmount > budget.amount ? 'bg-red-500' : 'bg-accent-purple'}`} 
                        style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center text-sm font-black italic">
                      <div>
                        <div className="text-[10px] text-base-content-muted font-black uppercase not-italic tracking-widest mb-1">{t('budgets.spent')}</div>
                        <div className={budget.spentAmount > budget.amount ? 'text-red-500' : 'text-base-content'}>
                          {formatCurrency(budget.spentAmount, budget.currency)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-base-content-muted font-black uppercase not-italic tracking-widest mb-1">{t('budgets.limit')}</div>
                        <div className="text-base-content-muted">
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
          <h2 className="text-3xl font-black text-base-content">{t('savings_goals.title')}</h2>
          <button 
            onClick={() => setActiveModal('goal')}
            className="px-8 h-14 bg-green-500 text-white font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-green-500/20"
          >
            {t('savings_goals.create_goal')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {savingsGoals.length === 0 ? (
            <div className="col-span-full bg-card rounded-[2.5rem] p-20 border border-border-subtle text-center flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-glass border border-border-subtle rounded-full flex items-center justify-center text-base-content-muted">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div className="text-xl font-black text-base-content italic">{t('savings_goals.description')}</div>
            </div>
          ) : (
            savingsGoals.map((goal) => {
              const percentage = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={goal.id} className="bg-card rounded-[2.5rem] p-10 border border-border-subtle hover:border-green-500/30 transition-all group relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <h3 className="text-xl font-black text-base-content group-hover:text-green-500 transition-colors">{goal.name}</h3>
                        <div className="text-[10px] font-black uppercase tracking-widest text-base-content-muted">{goal.status}</div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setEditingGoal(goal); setActiveModal('goal'); }}
                          className="w-8 h-8 rounded-lg bg-glass hover:bg-green-500/20 text-base-content-muted hover:text-green-500 flex items-center justify-center transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="w-8 h-8 rounded-lg bg-glass hover:bg-red-500/20 text-base-content-muted hover:text-red-500 flex items-center justify-center transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>

                    <div className="h-4 w-full bg-glass border border-border-subtle rounded-full overflow-hidden mb-6 p-1">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(34,197,94,0.4)]" 
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center text-sm font-black italic">
                      <div>
                        <div className="text-[10px] text-base-content-muted font-black uppercase not-italic tracking-widest mb-1">{t('savings_goals.current')}</div>
                        <div className="text-base-content">
                          {formatCurrency(goal.currentAmount, goal.currency)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-base-content-muted font-black uppercase not-italic tracking-widest mb-1">{t('savings_goals.target')}</div>
                        <div className="text-base-content-muted">
                          {formatCurrency(goal.targetAmount, goal.currency)}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <button 
                        onClick={() => { setSelectedGoal(goal); setActiveModal('contribution'); }}
                        className="flex-1 h-10 bg-green-500/10 hover:bg-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-green-500/20"
                      >
                        {t('savings_goals.add_contribution')}
                      </button>
                      <button 
                        onClick={() => { setSelectedGoal(goal); setActiveModal('withdrawal'); }}
                        className="flex-1 h-10 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-red-500/20"
                      >
                        {t('savings_goals.withdraw')}
                      </button>
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
        onClose={() => { setActiveModal(null); setEditingBudget(null); }}
        title={editingBudget ? t('budgets.edit_budget') : t('budgets.new_budget')}
      >
        <BudgetForm initialData={editingBudget || undefined} onSuccess={handleFormSuccess} onCancel={() => { setActiveModal(null); setEditingBudget(null); }} />
      </Modal>

      <Modal
        isOpen={activeModal === 'goal'}
        onClose={() => { setActiveModal(null); setEditingGoal(null); }}
        title={editingGoal ? t('savings_goals.edit_goal') : t('savings_goals.new_goal')}
      >
        <SavingsGoalForm initialData={editingGoal || undefined} onSuccess={handleFormSuccess} onCancel={() => { setActiveModal(null); setEditingGoal(null); }} />
      </Modal>

      <Modal
        isOpen={activeModal === 'contribution' || activeModal === 'withdrawal'}
        onClose={() => setActiveModal(null)}
        title={activeModal === 'contribution' ? t('savings_goals.add_contribution') : t('savings_goals.withdraw')}
      >
        <form onSubmit={handleActionSubmit} className="space-y-6">
          <div>
            <label className={labelClasses}>{t('common.amount')}</label>
            <input 
              type="number"
              step="0.01"
              required
              value={actionAmount}
              onChange={e => setActionAmount(e.target.value)}
              className={inputClasses}
              placeholder="0.00"
            />
          </div>
          {activeModal === 'contribution' && (
            <div>
              <label className={labelClasses}>{t('common.account')}</label>
              <select 
                required
                value={selectedAccountId}
                onChange={e => setSelectedAccountId(e.target.value)}
                className={inputClasses}
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id} className="bg-gray-800 text-white">{acc.name} ({acc.currency})</option>
                ))}
              </select>
            </div>
          )}
          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={() => setActiveModal(null)}
              className="flex-1 h-14 rounded-2xl border border-border-subtle bg-glass font-black text-base-content-muted hover:bg-glass/20 hover:text-base-content transition-all uppercase tracking-widest text-xs"
            >
              {t('common.cancel')}
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 h-14 rounded-2xl font-black hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-xs disabled:opacity-50 ${
                activeModal === 'contribution' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}
            >
              {isSubmitting ? '...' : t('common.save')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Budgets;
