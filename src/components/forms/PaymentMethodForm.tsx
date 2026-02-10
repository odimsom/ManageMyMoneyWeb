import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { accountService } from '../../services/accountService';
import { useToast } from '../../hooks/useToast';

interface PaymentMethodFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'BankAccount',
    isDefault: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await accountService.createPaymentMethod(formData);
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
      <div>
        <label className={labelClasses}>{t('common.name') || 'Payment Method Name'}</label>
        <input 
          type="text"
          required
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className={inputClasses}
          placeholder="e.g. My Debit Card, Payroll"
        />
      </div>

      <div>
        <label className={labelClasses}>{t('common.type') || 'Type'}</label>
        <select 
          required
          value={formData.type}
          onChange={e => setFormData({ ...formData, type: e.target.value })}
          className={inputClasses}
        >
          <option value="BankAccount">Bank Account</option>
          <option value="Cash">Cash</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="flex items-center gap-3 px-4">
        <input 
          type="checkbox"
          id="isDefault"
          checked={formData.isDefault}
          onChange={e => setFormData({ ...formData, isDefault: e.target.checked })}
          className="w-5 h-5 rounded border-white/10 bg-white/5 text-accent-purple focus:ring-accent-purple/50"
        />
        <label htmlFor="isDefault" className="text-xs font-bold text-white/60 cursor-pointer">
          Set as default payment method
        </label>
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
          {isSubmitting ? '...' : (t('common.save') || 'Save Method')}
        </button>
      </div>
    </form>
  );
};

export default PaymentMethodForm;
