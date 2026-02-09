import api from './api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'Info' | 'Warning' | 'Error' | 'Success';
  createdAt: string;
  isRead: boolean;
  link?: string;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  isCompleted: boolean;
  status: 'Pending' | 'Completed' | 'Overdue';
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  createdAt: string;
  isAcknowledged: boolean;
}

export interface CreateReminderRequest {
  title: string;
  description?: string;
  dueDate: string;
}

const getNotifications = async (unreadOnly = false) => {
  const response = await api.get<{ data: Notification[] }>('/api/Notifications', {
    params: { unreadOnly }
  });
  return response.data.data || [];
};

const getUnreadCount = async () => {
  const response = await api.get<{ data: { count: number } }>('/api/Notifications/unread-count');
  return response.data.data.count;
};

const markAsRead = async (id: string) => {
  await api.put(`/api/Notifications/${id}/read`);
};

const markAllAsRead = async () => {
  await api.put('/api/Notifications/read-all');
};

const deleteNotification = async (id: string) => {
  await api.delete(`/api/Notifications/${id}`);
};

const getReminders = async (pendingOnly = true) => {
  const response = await api.get<{ data: Reminder[] }>('/api/Notifications/reminders', {
    params: { pendingOnly }
  });
  return response.data.data || [];
};

const createReminder = async (data: CreateReminderRequest) => {
  const response = await api.post<{ data: Reminder }>('/api/Notifications/reminders', data);
  return response.data.data;
};

const completeReminder = async (id: string) => {
  await api.put(`/api/Notifications/reminders/${id}/complete`);
};

const deleteReminder = async (id: string) => {
  await api.delete(`/api/Notifications/reminders/${id}`);
};

const getAlerts = async (unacknowledgedOnly = true) => {
  const response = await api.get<{ data: Alert[] }>('/api/Notifications/alerts', {
    params: { unacknowledgedOnly }
  });
  return response.data.data || [];
};

const acknowledgeAlert = async (id: string) => {
  await api.put(`/api/Notifications/alerts/${id}/acknowledge`);
};

export const notificationService = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getReminders,
  createReminder,
  completeReminder,
  deleteReminder,
  getAlerts,
  acknowledgeAlert
};
