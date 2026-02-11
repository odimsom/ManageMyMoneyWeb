import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { accountService } from '../../services/accountService';
import { useToast } from '../../hooks/useToast';

interface CreditCardFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    bankName: '',
    creditLimit: '',
    currentBalance: '0',
    currency: 'USD',
    dueDay: '',
    closingDay: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await accountService.createCreditCard({
        ...formData,
        creditLimit: parseFloat(formData.creditLimit) || 0,
        currentBalance: parseFloat(formData.currentBalance) || 0,
        dueDay: parseInt(formData.dueDay) || 0,
        closingDay: parseInt(formData.closingDay) || 0
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>{t('common.card_name')}</label>
          <input 
            type="text"
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className={inputClasses}
            placeholder="e.g. My Visa Platinum"
          />
        </div>
        <div>
          <label className={labelClasses}>{t('common.bank_name')}</label>
          <input 
            type="text"
            required
            value={formData.bankName}
            onChange={e => setFormData({ ...formData, bankName: e.target.value })}
            className={inputClasses}
            placeholder="e.g. BPD, Popular"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>{t('common.credit_limit')}</label>
          <input 
            type="number"
            step="0.01"
            required
            value={formData.creditLimit}
            onChange={e => setFormData({ ...formData, creditLimit: e.target.value })}
            className={inputClasses}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className={labelClasses}>{t('common.current_balance')}</label>
          <input 
            type="number"
            step="0.01"
            required
            value={formData.currentBalance}
            onChange={e => setFormData({ ...formData, currentBalance: e.target.value })}
            className={inputClasses}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <div>
          <label className={labelClasses}>{t('common.closing_date')}</label>
          <input 
            type="number"
            min="1"
            max="31"
            value={formData.closingDay}
            onChange={e => setFormData({ ...formData, closingDay: e.target.value })}
            className={inputClasses}
            placeholder="1-31"
          />
        </div>
        <div>
          <label className={labelClasses}>{t('common.due_date')}</label>
          <input 
            type="number"
            min="1"
            max="31"
            value={formData.dueDay}
            onChange={e => setFormData({ ...formData, dueDay: e.target.value })}
            className={inputClasses}
            placeholder="1-31"
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
          {isSubmitting ? '...' : t('common.save')}
        </button>
      </div>
    </form>
  );
};

export default CreditCardForm;
