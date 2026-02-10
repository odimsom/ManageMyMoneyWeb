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

  const inputClasses = "w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white placeholder:text-white/20 focus:border-accent-purple/50 focus:bg-white/[0.08] outline-none transition-all font-medium";
  const labelClasses = "text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block ml-4";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>{t('common.card_name') || 'Card Name'}</label>
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
          <label className={labelClasses}>{t('common.bank_name') || 'Bank Name'}</label>
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
          <label className={labelClasses}>{t('common.credit_limit') || 'Credit Limit'}</label>
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
          <label className={labelClasses}>{t('common.current_balance') || 'Current Balance'}</label>
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
            <option value="USD">USD</option>
            <option value="DOP">DOP</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <div>
          <label className={labelClasses}>{t('common.closing_date') || 'Closing Day'}</label>
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
          <label className={labelClasses}>{t('common.due_date') || 'Due Day'}</label>
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
          className="flex-1 h-16 rounded-2xl border border-white/5 font-black text-white/40 hover:bg-white/5 hover:text-white transition-all uppercase tracking-widest text-xs"
        >
          {t('common.cancel')}
        </button>
        <button 
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-16 rounded-2xl bg-white text-black font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-white/5 uppercase tracking-widest text-xs disabled:opacity-50"
        >
          {isSubmitting ? '...' : (t('common.save') || 'Save Card')}
        </button>
      </div>
    </form>
  );
};

export default CreditCardForm;
