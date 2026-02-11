import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { notificationService } from '../services/notificationService';
import type { Reminder, Alert } from '../services/notificationService';
import { useToast } from '../hooks/useToast';
import Modal from '../components/ui/Modal';

const Reminders: React.FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0]
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [remindersData, alertsData] = await Promise.all([
        notificationService.getReminders(false),
        notificationService.getAlerts(false)
      ]);
      setReminders(remindersData);
      setAlerts(alertsData);
    } catch {
      showToast(t('common.error'), 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await notificationService.createReminder(newReminder);
      showToast(t('common.success'), 'success');
      setIsModalOpen(false);
      setNewReminder({ title: '', description: '', dueDate: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch {
      showToast(t('common.error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteReminder = async (id: string) => {
    try {
      await notificationService.completeReminder(id);
      showToast(t('common.success'), 'success');
      fetchData();
    } catch {
      showToast(t('common.error'), 'error');
    }
  };

  const handleAcknowledgeAlert = async (id: string) => {
    try {
      await notificationService.acknowledgeAlert(id);
      showToast(t('common.success'), 'success');
      fetchData();
    } catch {
      showToast(t('common.error'), 'error');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'High': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-white/5 text-white/40 border-white/10';
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
        <div className="h-96 bg-glass rounded-[2.5rem]"></div>
        <div className="h-96 bg-glass rounded-[2.5rem]"></div>
      </div>
    );
  }

  const inputClasses = "w-full h-14 bg-glass border border-border-subtle rounded-2xl px-6 text-base-content placeholder:text-base-content-muted focus:border-accent-purple/50 focus:bg-glass/20 outline-none transition-all font-medium";
  const labelClasses = "text-[10px] font-black uppercase tracking-widest text-base-content-muted mb-2 block ml-4";

  return (
    <div className="flex flex-col gap-20 animate-fade-in-up pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-base-content">{t('notifications.reminders')}</h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 h-12 bg-accent-purple text-white font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent-purple/20 text-xs uppercase tracking-widest"
            >
              {t('common.add')}
            </button>
          </div>
          <div className="space-y-4">
            {reminders.length === 0 ? (
              <p className="text-base-content-muted italic">{t('notifications.empty')}</p>
            ) : (
              reminders.map(reminder => (
                <div key={reminder.id} className={`bg-card p-6 rounded-3xl border border-border-subtle flex items-center justify-between transition-all ${reminder.isCompleted ? 'opacity-40' : 'hover:border-accent-purple/30'}`}>
                  <div>
                    <h4 className={`text-lg font-black ${reminder.isCompleted ? 'line-through text-base-content-muted' : 'text-base-content'}`}>{reminder.title}</h4>
                    <p className="text-sm text-base-content-muted">{reminder.description}</p>
                    <div className="text-[10px] font-black uppercase tracking-widest text-accent-purple mt-2">{new Date(reminder.dueDate).toLocaleDateString()}</div>
                  </div>
                  {!reminder.isCompleted && (
                    <button 
                      onClick={() => handleCompleteReminder(reminder.id)}
                      className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center text-base-content-muted hover:text-green-500 hover:border-green-500/40 hover:bg-green-500/10 transition-all font-black"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-black text-base-content mb-8">{t('notifications.alerts')}</h2>
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <p className="text-base-content-muted italic">{t('notifications.empty')}</p>
            ) : (
              alerts.map(alert => (
                <div key={alert.id} className={`bg-card p-6 rounded-3xl border border-border-subtle flex flex-col gap-4 transition-all ${alert.isAcknowledged ? 'opacity-40' : 'hover:border-border-subtle'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getSeverityColor(alert.severity)}`}>
                      {t(`notifications.${alert.severity.toLowerCase()}`)}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-base-content-muted">{new Date(alert.createdAt).toLocaleString()}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-base-content">{alert.title}</h4>
                    <p className="text-sm text-base-content-muted">{alert.message}</p>
                  </div>
                  {!alert.isAcknowledged && (
                    <button 
                      onClick={() => handleAcknowledgeAlert(alert.id)}
                      className="text-[10px] font-black uppercase tracking-widest text-accent-purple hover:text-base-content transition-colors self-end"
                    >
                      {t('notifications.mark_read')}
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t('notifications.reminders')}
      >
        <form onSubmit={handleCreateReminder} className="space-y-6">
          <div>
            <label className={labelClasses}>{t('common.name')}</label>
            <input 
              type="text"
              required
              value={newReminder.title}
              onChange={e => setNewReminder({ ...newReminder, title: e.target.value })}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>{t('common.description')}</label>
            <input 
              type="text"
              value={newReminder.description}
              onChange={e => setNewReminder({ ...newReminder, description: e.target.value })}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>{t('common.date')}</label>
            <input 
              type="date"
              required
              value={newReminder.dueDate}
              onChange={e => setNewReminder({ ...newReminder, dueDate: e.target.value })}
              className={inputClasses}
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 h-14 rounded-2xl border border-border-subtle bg-glass font-black text-base-content-muted hover:bg-glass/20 hover:text-base-content transition-all uppercase tracking-widest text-xs"
            >
              {t('common.cancel')}
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-14 rounded-2xl bg-accent-purple text-white font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent-purple/20 uppercase tracking-widest text-xs disabled:opacity-50"
            >
              {isSubmitting ? '...' : t('common.save')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Reminders;
