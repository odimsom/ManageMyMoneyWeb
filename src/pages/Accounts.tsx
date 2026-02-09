import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { accountService } from '../services/accountService';
import type { Account, PaymentMethod, CreditCard, TransferResponse } from '../services/accountService';
import { useToast } from '../hooks/useToast';
import Modal from '../components/ui/Modal';
import AccountForm from '../components/forms/AccountForm';
import TransferForm from '../components/forms/TransferForm';

const Accounts: React.FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [transfers, setTransfers] = useState<TransferResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeModal, setActiveModal] = useState<'account' | 'transfer' | 'payment-method' | 'credit-card' | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [accs, pm, cc, tf] = await Promise.all([
        accountService.getAccounts(),
        accountService.getPaymentMethods(),
        accountService.getCreditCards(),
        accountService.getTransfers()
      ]);
      setAccounts(accs);
      setPaymentMethods(pm);
      setCreditCards(cc);
      setTransfers(tf);
    } catch {
      showToast('Error loading accounts data', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-40 bg-white/5 rounded-[2.5rem]"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 animate-fade-in-up pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-white">{t('accounts.title', { defaultValue: 'My Accounts' })}</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveModal('transfer')}
            className="px-6 h-12 bg-white/5 text-white font-black rounded-full hover:bg-white/10 transition-all border border-white/5"
          >
            {t('accounts.transfer', { defaultValue: 'Transfer' })}
          </button>
          <button 
            onClick={() => setActiveModal('account')}
            className="px-8 h-12 bg-accent-purple text-white font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent-purple/20"
          >
            {t('accounts.add_account', { defaultValue: 'Add Account' })}
          </button>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((acc) => (
          <div key={acc.id} className="bg-card rounded-[2.5rem] p-8 border border-white/5 hover:border-accent-purple/30 transition-all group overflow-hidden relative">
            <div className="flex items-center justify-between mb-6">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner"
                style={{ backgroundColor: acc.color || '#333' }}
              >
                {acc.icon || '💰'}
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">{acc.type}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-3 py-1 rounded-full">{acc.status}</div>
              </div>
            </div>
            
            <h3 className="text-xl font-black text-white group-hover:text-accent-purple transition-colors mb-1">{acc.name}</h3>
            <p className="text-xs text-white/40 mb-6">{acc.institutionName || 'Personal Account'}</p>
            
            <div className="text-3xl font-black text-white tracking-tighter">
              {formatCurrency(acc.balance, acc.currency)}
            </div>
            
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-purple/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Payment Methods & Credit Cards */}
        <div className="flex flex-col gap-10">
          <div className="bg-card rounded-[2.5rem] p-8 border border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black">{t('accounts.payment_methods', { defaultValue: 'Payment Methods' })}</h3>
              <button 
                onClick={() => setActiveModal('payment-method')}
                className="text-xs font-black text-accent-purple hover:text-white transition-colors uppercase tracking-widest"
              >
                + Add
              </button>
            </div>
            <div className="space-y-4">
              {paymentMethods.length === 0 ? (
                <div className="text-center py-10 text-white/10 font-black uppercase text-xs italic">No payment methods found</div>
              ) : (
                paymentMethods.map(pm => (
                  <div key={pm.id} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#0a0a0a] rounded-xl flex items-center justify-center text-white/40 group-hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-black text-sm">{pm.name}</div>
                        <div className="text-[10px] font-black uppercase text-white/20">{pm.type} {pm.lastFourDigits ? `•••• ${pm.lastFourDigits}` : ''}</div>
                      </div>
                    </div>
                    {pm.isDefault && (
                      <span className="text-[9px] font-black uppercase tracking-widest bg-accent-purple/20 text-accent-purple px-2 py-1 rounded-md">Default</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-card rounded-[2.5rem] p-8 border border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black">{t('accounts.credit_cards', { defaultValue: 'Credit Cards' })}</h3>
              <button 
                onClick={() => setActiveModal('credit-card')}
                className="text-xs font-black text-accent-purple hover:text-white transition-colors uppercase tracking-widest"
              >
                + Add
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {creditCards.length === 0 ? (
                <div className="text-center py-10 text-white/10 font-black uppercase text-xs italic">No credit cards found</div>
              ) : (
                creditCards.map(cc => (
                  <div key={cc.id} className="relative group overflow-hidden p-8 rounded-[2rem] border border-white/5 bg-gradient-to-br from-white/5 to-transparent hover:border-accent-purple/30 transition-all">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-tighter text-white/20 mb-1">{cc.bankName}</div>
                          <div className="text-lg font-black">{cc.name}</div>
                        </div>
                        <div className="w-10 h-6 bg-white/10 rounded-sm"></div>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Current Balance</div>
                          <div className="text-2xl font-black">{formatCurrency(cc.currentBalance)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Limit</div>
                          <div className="text-sm font-black text-white/60">{formatCurrency(cc.creditLimit)}</div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent-purple/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Transfers History */}
        <div className="bg-card rounded-[2.5rem] p-8 border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black">{t('accounts.recent_transfers', { defaultValue: 'Recent Transfers' })}</h3>
          </div>
          <div className="space-y-4">
            {transfers.length === 0 ? (
              <div className="text-center py-20 text-white/10 font-black uppercase text-sm italic">No transfers history</div>
            ) : (
              transfers.map(tf => (
                <div key={tf.id} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/20">{new Date(tf.date).toLocaleDateString()}</div>
                    <div className="text-lg font-black text-white">{formatCurrency(tf.amount)}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 text-center p-2 rounded-xl bg-[#0a0a0a] text-xs font-black truncate">{tf.fromAccountName}</div>
                    <div className="text-accent-purple">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                    <div className="flex-1 text-center p-2 rounded-xl bg-[#0a0a0a] text-xs font-black truncate">{tf.toAccountName}</div>
                  </div>
                  {tf.description && <p className="mt-4 text-[10px] text-white/40 italic">"{tf.description}"</p>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal 
        isOpen={activeModal === 'account'} 
        onClose={() => setActiveModal(null)}
        title={t('accounts.add_account', { defaultValue: 'Add New Account' })}
      >
        <AccountForm onCancel={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); fetchData(); }} />
      </Modal>

      <Modal 
        isOpen={activeModal === 'transfer'} 
        onClose={() => setActiveModal(null)}
        title={t('accounts.new_transfer', { defaultValue: 'New Fund Transfer' })}
      >
        <TransferForm onSuccess={() => { setActiveModal(null); fetchData(); }} onCancel={() => setActiveModal(null)} />
      </Modal>
    </div>
  );
};

export default Accounts;
