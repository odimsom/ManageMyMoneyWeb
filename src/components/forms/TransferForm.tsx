import React, { useState, useEffect } from 'react';
import { accountService } from '../../services/accountService';
import type { Account, TransferRequest } from '../../services/accountService';
import { useToast } from '../../hooks/useToast';

interface TransferFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const TransferForm: React.FC<TransferFormProps> = ({ onSuccess, onCancel }) => {
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
        showToast('Error loading accounts', 'error');
      }
    };
    fetchAccounts();
  }, [showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fromAccountId === formData.toAccountId) {
      showToast('Source and destination accounts must be different', 'error');
      return;
    }
    if (formData.amount <= 0) {
      showToast('Amount must be greater than zero', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await accountService.transfer(formData);
      showToast('Transfer completed successfully', 'success');
      onSuccess();
    } catch {
      showToast('Failed to complete transfer', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-4">From Account</label>
          <select
            required
            className="w-full h-14 bg-[#0a0a0a] rounded-2xl px-6 border border-white/5 focus:border-accent-purple/50 outline-none font-bold text-sm transition-all appearance-none"
            value={formData.fromAccountId}
            onChange={(e) => setFormData({ ...formData, fromAccountId: e.target.value })}
          >
            <option value="">Select Account</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>{acc.name} ({acc.currency} {acc.balance})</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-4">To Account</label>
          <select
            required
            className="w-full h-14 bg-[#0a0a0a] rounded-2xl px-6 border border-white/5 focus:border-accent-purple/50 outline-none font-bold text-sm transition-all appearance-none"
            value={formData.toAccountId}
            onChange={(e) => setFormData({ ...formData, toAccountId: e.target.value })}
          >
            <option value="">Select Account</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>{acc.name} ({acc.currency} {acc.balance})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-4">Amount</label>
          <input
            type="number"
            step="0.01"
            required
            className="w-full h-14 bg-[#0a0a0a] rounded-2xl px-6 border border-white/5 focus:border-accent-purple/50 outline-none font-bold text-sm transition-all"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-4">Date</label>
          <input
            type="date"
            required
            className="w-full h-14 bg-[#0a0a0a] rounded-2xl px-6 border border-white/5 focus:border-accent-purple/50 outline-none font-bold text-sm transition-all"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-4">Description (Optional)</label>
        <textarea
          className="w-full h-32 bg-[#0a0a0a] rounded-2xl p-6 border border-white/5 focus:border-accent-purple/50 outline-none font-bold text-sm transition-all resize-none"
          placeholder="What's this transfer for?"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-14 bg-white/5 text-white font-black rounded-full hover:bg-white/10 transition-all border border-white/5 uppercase tracking-widest text-xs"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-14 bg-accent-purple text-white font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent-purple/20 uppercase tracking-widest text-xs disabled:opacity-50 disabled:hover:scale-100"
        >
          {isSubmitting ? 'Processing...' : 'Complete Transfer'}
        </button>
      </div>
    </form>
  );
};

export default TransferForm;
