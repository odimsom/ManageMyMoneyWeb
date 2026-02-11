import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { expenseService } from '../services/expenseService';
import type { Expense } from '../services/expenseService';
import { categoryService } from '../services/categoryService';
import type { Category } from '../services/categoryService';
import { useToast } from '../hooks/useToast';
import Modal from '../components/ui/Modal';
import TransactionForm from '../components/forms/TransactionForm';

const Transactions: React.FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await expenseService.getExpenses({ 
        PageSize: 50,
        SearchTerm: searchTerm,
        CategoryId: selectedCategoryId || undefined
      });
      setExpenses(response.items || []);
    } catch {
      showToast(t('common.error'), 'error');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategoryId, showToast, t]);

  const handleDeleteExpense = async (id: string) => {
    if (!window.confirm(t('common.confirm_delete'))) return;
    try {
      await expenseService.deleteExpense(id);
      showToast(t('common.success'), 'success');
      fetchExpenses();
    } catch {
      showToast(t('common.error'), 'error');
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const handleExport = async (format: 'excel' | 'csv') => {
    try {
      const data = format === 'excel' ? await expenseService.exportExpensesByExcel() : await expenseService.exportExpensesByCsv();
      const blob = new Blob([data], { type: format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast(t('common.export_success'), 'success');
    } catch {
      showToast(t('common.export_error'), 'error');
    }
  };

  return (
    <div className="flex flex-col gap-10 animate-fade-in-up pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h1 className="text-4xl font-black text-base-content">{t('dashboard.recent_transactions')}</h1>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleExport('excel')}
              className="h-12 bg-green-500/10 hover:bg-green-500/20 text-green-500 px-6 rounded-xl border border-green-500/20 font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5l5 5v11a2 2 0 01-2 2z" /></svg>
              {t('transactions.excel_export')}
            </button>
            <button 
              onClick={() => handleExport('csv')}
              className="h-12 bg-glass hover:bg-glass/20 text-base-content-muted px-6 rounded-xl border border-border-subtle font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5l5 5v11a2 2 0 01-2 2z" /></svg>
              {t('transactions.csv_export')}
            </button>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none opacity-20 group-focus-within:opacity-100 transition-opacity">
              <svg className="w-4 h-4 text-base-content" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder={t('transactions.search_placeholder')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 bg-card rounded-xl pl-12 pr-6 border border-border-subtle focus:border-accent-purple/50 outline-none font-bold text-xs transition-all w-64 text-base-content"
            />
          </div>

          <div className="relative">
            <select 
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="h-12 bg-card rounded-xl px-6 pr-10 border border-border-subtle focus:border-accent-purple/50 outline-none font-black text-[10px] uppercase tracking-widest transition-all appearance-none cursor-pointer text-base-content"
            >
              <option value="">{t('transactions.all_categories')}</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
               <svg className="w-3 h-3 text-base-content" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-[2.5rem] p-10 border border-border-subtle">
        {isLoading ? (
          <div className="flex flex-col gap-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-glass rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-4">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-base-content-muted">
                  <th className="px-6 pb-2">{t('common.description')}</th>
                  <th className="px-6 pb-2">{t('common.category')}</th>
                  <th className="px-6 pb-2">{t('common.account')}</th>
                  <th className="px-6 pb-2 text-right">{t('common.amount')}</th>
                  <th className="px-6 pb-2 text-center">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-20 text-base-content-muted font-black uppercase tracking-widest text-sm italic">
                      {t('transactions.no_expenses')}
                    </td>
                  </tr>
                ) : (
                  expenses.map((e) => (
                    <tr key={e.id} className="group hover:bg-glass transition-all">
                      <td className="px-6 py-4 bg-glass rounded-l-[1.5rem] border-y border-l border-border-subtle group-hover:border-accent-purple/50">
                        <div className="flex flex-col">
                          <div className="font-black text-base-content group-hover:text-accent-purple transition-colors">{e.description}</div>
                          <div className="text-[9px] font-black uppercase text-base-content-muted tracking-tighter mt-1">{new Date(e.date).toLocaleDateString()}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 bg-glass border-y border-border-subtle group-hover:border-accent-purple/50">
                        <span className="px-3 py-1 bg-glass rounded-lg text-[10px] font-black uppercase tracking-widest text-base-content-muted">
                          {e.categoryName || t('common.uncategorized') || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4 bg-glass border-y border-border-subtle group-hover:border-accent-purple/50 text-[10px] font-black uppercase tracking-widest text-base-content-muted">
                        {e.accountName || t('common.no_account') || 'Default Account'}
                      </td>
                      <td className="px-6 py-4 bg-glass border-y border-border-subtle group-hover:border-accent-purple/50 text-right">
                        <div className="text-lg font-black text-base-content">{formatCurrency(e.amount, e.currencyCode)}</div>
                        <div className="flex gap-1 justify-end mt-1">
                          {e.tags?.map(tag => (
                            <span key={tag.id} className="text-[7px] font-black uppercase px-1 border border-border-subtle rounded text-base-content-muted">{tag.name}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 bg-glass rounded-r-[1.5rem] border-y border-r border-border-subtle group-hover:border-accent-purple/50">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => { setEditingExpense(e); setIsModalOpen(true); }}
                            className="w-10 h-10 rounded-xl bg-glass hover:bg-accent-purple/20 text-base-content-muted hover:text-accent-purple flex items-center justify-center transition-all shadow-xl"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button 
                            onClick={() => handleDeleteExpense(e.id)}
                            className="w-10 h-10 rounded-xl bg-glass hover:bg-red-500/20 text-base-content-muted hover:text-red-500 flex items-center justify-center transition-all shadow-xl"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingExpense(null); }}
        title={t('transactions.edit_transaction')}
      >
        {editingExpense && (
          <TransactionForm 
            type="Expense"
            initialData={editingExpense}
            onSuccess={() => { setIsModalOpen(false); setEditingExpense(null); fetchExpenses(); }}
            onCancel={() => { setIsModalOpen(false); setEditingExpense(null); }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Transactions;
