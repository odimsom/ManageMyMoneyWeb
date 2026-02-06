import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { transactionsService } from '../../services/transactionsService';
import { accountService } from '../../services/accountService';
import type { Account } from '../../services/accountService';
import { categoryService } from '../../services/categoryService';
import type { Category } from '../../services/categoryService';
import { useToast } from '../../hooks/useToast';

interface TransactionFormProps {
  type: 'Expense' | 'Income';
  onSuccess: () => void;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ type, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    categoryId: '',
    accountId: '',
    date: new Date().toISOString().split('T')[0],
    currency: 'USD'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accs, cats] = await Promise.all([
          accountService.getAccounts(),
          type === 'Expense' 
            ? categoryService.getCategories() // En una implementación real, esto podría filtrar por tipo
            : categoryService.getCategories()
        ]);
        setAccounts(accs);
        setCategories(cats);
        
        if (accs.length > 0) setFormData(prev => ({ ...prev, accountId: accs[0].id }));
        if (cats.length > 0) setFormData(prev => ({ ...prev, categoryId: cats[0].id }));
      } catch (error) {
        console.error('Failed to fetch form data', error);
      }
    };
    fetchData();
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (type === 'Expense') {
        await transactionsService.createExpense(payload);
      } else {
        await transactionsService.createIncome(payload);
      }

      showToast(t('common.success'), 'success');
      onSuccess();
    } catch {
      showToast(t('common.error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white placeholder:text-white/20 focus:border-accent-purple/50 focus:bg-white/[0.08] outline-none transition-all font-medium";
  const labelClasses = "text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block ml-4";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>{t('dashboard.amount')}</label>
          <input 
            type="number"
            step="0.01"
            required
            value={formData.amount}
            onChange={e => setFormData({ ...formData, amount: e.target.value })}
            className={inputClasses}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className={labelClasses}>{t('dashboard.date')}</label>
          <input 
            type="date"
            required
            value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>{t('dashboard.description')}</label>
        <input 
          type="text"
          required
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          className={inputClasses}
          placeholder="What was this for?"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>{t('dashboard.account')}</label>
          <select 
            required
            value={formData.accountId}
            onChange={e => setFormData({ ...formData, accountId: e.target.value })}
            className={inputClasses}
          >
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>{acc.name} ({acc.currency})</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClasses}>{t('dashboard.category')}</label>
          <select 
            required
            value={formData.categoryId}
            onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
            className={inputClasses}
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 h-16 rounded-2xl border border-white/5 font-black text-white/40 hover:bg-white/5 hover:text-white transition-all uppercase tracking-widest text-xs"
        >
          {t('common.cancel')}
        </button>
        <button 
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-16 rounded-2xl bg-white text-black font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-white/5 uppercase tracking-widest text-xs disabled:opacity-50"
        >
          {isSubmitting ? '...' : (type === 'Expense' ? t('dashboard.add_expense') : t('dashboard.add_income'))}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
