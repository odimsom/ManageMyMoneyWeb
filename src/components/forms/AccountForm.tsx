import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { accountService } from '../../services/accountService';
import { useToast } from '../../hooks/useToast';

interface AccountFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AccountForm: React.FC<AccountFormProps> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Checking',
    initialBalance: '',
    currency: 'USD',
    institutionName: '',
    accountNumber: '',
    color: '#a855f7'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await accountService.createAccount({
        ...formData,
        initialBalance: parseFloat(formData.initialBalance) || 0
      });
      showToast(t('common.success'), 'success');
      onSuccess();
    } catch {
      showToast(t('common.error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full h-14 bg-glass border border-border-subtle rounded-2xl px-6 text-base-content placeholder:text-base-content-muted focus:border-accent-purple/50 focus:bg-glass/20 outline-none transition-all font-medium";
  const labelClasses = "text-[10px] font-black uppercase tracking-widest text-base-content-muted mb-2 block ml-4";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelClasses}>{t('dashboard.account_name')}</label>
        <input 
          type="text"
          required
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className={inputClasses}
          placeholder="e.g. Personal Bank Account"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>{t('dashboard.account_type')}</label>
            <select 
              required
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
              className={inputClasses}
            >
              <option value="Checking" className="bg-card text-base-content">Checking</option>
              <option value="Savings" className="bg-card text-base-content">Savings</option>
              <option value="CreditCard" className="bg-card text-base-content">Credit Card</option>
              <option value="Cash" className="bg-card text-base-content">Cash</option>
              <option value="Investment" className="bg-card text-base-content">Investment</option>
            </select>
        </div>
        <div>
          <label className={labelClasses}>{t('dashboard.currency')}</label>
            <select 
              required
              value={formData.currency}
              onChange={e => setFormData({ ...formData, currency: e.target.value })}
              className={inputClasses}
            >
              <option value="USD" className="bg-card text-base-content">USD</option>
              <option value="DOP" className="bg-card text-base-content">DOP</option>
              <option value="EUR" className="bg-card text-base-content">EUR</option>
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>{t('dashboard.initial_balance')}</label>
          <input 
            type="number"
            step="0.01"
            required
            value={formData.initialBalance}
            onChange={e => setFormData({ ...formData, initialBalance: e.target.value })}
            className={inputClasses}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className={labelClasses}>{t('dashboard.institution')}</label>
          <input 
            type="text"
            value={formData.institutionName}
            onChange={e => setFormData({ ...formData, institutionName: e.target.value })}
            className={inputClasses}
            placeholder="e.g. Chase, BPD"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 h-16 rounded-2xl border border-border-subtle bg-glass font-black text-base-content-muted hover:bg-glass/20 hover:text-base-content transition-all uppercase tracking-widest text-xs"
        >
          {t('common.cancel')}
        </button>
        <button 
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-16 rounded-2xl bg-accent-purple text-white font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent-purple/20 uppercase tracking-widest text-xs disabled:opacity-50"
        >
          {isSubmitting ? '...' : t('dashboard.create_account')}
        </button>
      </div>
    </form>
  );
};

export default AccountForm;
