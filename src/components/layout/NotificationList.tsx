import React, { useEffect, useState } from 'react';
import { notificationService } from '../../services/notificationService';
import type { Notification } from '../../services/notificationService';
import { useTranslation } from 'react-i18next';

const NotificationList: React.FC = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = React.useCallback(async () => {
    try {
      const [data, count] = await Promise.all([
        notificationService.getNotifications(),
        notificationService.getUnreadCount()
      ]);
      setNotifications(data);
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Polling every minute
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group"
      >
        <svg className="w-6 h-6 text-white/60 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#0a0a0a] animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-4 w-96 bg-card border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden z-50 animate-fade-in-down">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-black text-white uppercase tracking-widest text-sm">{t('notifications.title')}</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-[10px] font-black uppercase text-accent-purple hover:text-white transition-colors"
                >
                  {t('notifications.mark_all_read')}
                </button>
              )}
            </div>
            
            <div className="max-h-[30rem] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-10 text-center text-white/20 font-black uppercase text-xs italic">
                  {t('notifications.empty')}
                </div>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={`p-6 border-b border-white/5 hover:bg-white/[0.02] transition-all group ${!n.isRead ? 'bg-accent-purple/5' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`font-black text-sm ${!n.isRead ? 'text-white' : 'text-white/60'}`}>{n.title}</h4>
                      <span className="text-[9px] font-bold text-white/20">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-white/40 mb-3">{n.message}</p>
                    {!n.isRead && (
                      <button 
                        onClick={() => handleMarkAsRead(n.id)}
                        className="text-[9px] font-black uppercase text-accent-purple hover:text-white transition-colors"
                      >
                        {t('notifications.mark_read')}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationList;
