import React, { useState, useEffect } from 'react';
import { accountService } from '../../services/accountService';
import { useTranslation } from 'react-i18next';
import type { Account, TransferRequest } from '../../services/accountService';
import { useToast } from '../../hooks/useToast';

interface TransferFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const TransferForm: React.FC<TransferFormProps> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [formData, setFormData] = useState<TransferRequest>({
    fromAccountId: '',
    toAccountId: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await accountService.getAccounts();
        setAccounts(data);
      } catch {
        showToast(t('accounts.error_loading'), 'error');
      }
    };
    fetchAccounts();
  }, [showToast, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fromAccountId === formData.toAccountId) {
      showToast(t('accounts.transfer_error_same'), 'error');
      return;
    }
    if (formData.amount <= 0) {
      showToast(t('accounts.transfer_error_amount'), 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await accountService.transfer(formData);
      showToast(t('accounts.transfer_success'), 'success');
      onSuccess();
    } catch {
      showToast(t('accounts.transfer_error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-base-content-muted ml-4">{t('accounts.from_account')}</label>
          <select
            required
            className="w-full h-14 bg-glass rounded-2xl px-6 border border-border-subtle focus:border-accent-purple/50 outline-none font-bold text-sm transition-all appearance-none text-base-content"
            value={formData.fromAccountId}
            onChange={(e) => setFormData({ ...formData, fromAccountId: e.target.value })}
          >
            <option value="" className="bg-card text-base-content">{t('common.select_account')}</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id} className="bg-card text-base-content">{acc.name} ({acc.currency} {acc.balance})</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-base-content-muted ml-4">{t('accounts.to_account')}</label>
          <select
            required
            className="w-full h-14 bg-glass rounded-2xl px-6 border border-border-subtle focus:border-accent-purple/50 outline-none font-bold text-sm transition-all appearance-none text-base-content"
            value={formData.toAccountId}
            onChange={(e) => setFormData({ ...formData, toAccountId: e.target.value })}
          >
            <option value="" className="bg-card text-base-content">{t('common.select_account')}</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id} className="bg-card text-base-content">{acc.name} ({acc.currency} {acc.balance})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-base-content-muted ml-4">{t('common.amount')}</label>
          <input
            type="number"
            step="0.01"
            required
            className="w-full h-14 bg-glass rounded-2xl px-6 border border-border-subtle focus:border-accent-purple/50 outline-none font-bold text-sm transition-all text-base-content placeholder:text-base-content-muted"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-base-content-muted ml-4">{t('common.date')}</label>
          <input
            type="date"
            required
            className="w-full h-14 bg-glass rounded-2xl px-6 border border-border-subtle focus:border-accent-purple/50 outline-none font-bold text-sm transition-all text-base-content"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-base-content-muted ml-4">{t('common.description')} ({t('common.optional') || 'Optional'})</label>
        <textarea
          className="w-full h-32 bg-glass rounded-2xl p-6 border border-border-subtle focus:border-accent-purple/50 outline-none font-bold text-sm transition-all resize-none text-base-content placeholder:text-base-content-muted"
          placeholder={t('accounts.transfer_placeholder')}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-14 bg-glass text-base-content-muted font-black rounded-full hover:bg-glass/20 hover:text-base-content transition-all border border-border-subtle uppercase tracking-widest text-xs"
        >
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-14 bg-accent-purple text-white font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent-purple/20 uppercase tracking-widest text-xs disabled:opacity-50 disabled:hover:scale-100"
        >
          {isSubmitting ? t('accounts.transfer_processing') : t('accounts.transfer_complete')}
        </button>
      </div>
    </form>
  );
};

export default TransferForm;
