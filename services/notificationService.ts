//services/notificationService.ts
import { create } from 'zustand';

export type NotificationType = 'alert' | 'info' | 'transaction';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'time' | 'read'>) => void;
  markAllAsRead: () => void;
  markAsRead: (id: number) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [
    {
      id: 1,
      type: 'alert',
      title: 'Unusual Login Activity',
      message: 'We detected a login from a new device. Please verify if this was you.',
      time: '5 minutes ago',
      read: false,
      icon: 'AlertCircle'
    },
    {
      id: 2,
      type: 'info',
      title: 'Account Verified',
      message: 'Your account has been successfully verified. You now have full access to all features.',
      time: '2 hours ago',
      read: false,
      icon: 'Info'
    },
    {
      id: 3,
      type: 'transaction',
      title: 'Payment Received',
      message: 'You received a payment of $250.00 from John Smith.',
      time: '1 day ago',
      read: true,
      icon: 'Bell'
    },
    {
      id: 4,
      type: 'info',
      title: 'New Feature Available',
      message: 'Check out our new budgeting tools available in your dashboard.',
      time: '2 days ago',
      read: true,
      icon: 'Gift'
    },
    {
      id: 5,
      type: 'alert',
      title: 'Low Balance Alert',
      message: 'Your account balance is below your set threshold of $100.',
      time: '3 days ago',
      read: true,
      icon: 'AlertCircle'
    }
  ],
  unreadCount: 2,
  
  addNotification: (notification) => 
    set((state) => {
      const newNotification = {
        ...notification,
        id: Date.now(),
        time: 'Just now',
        read: false,
      };
      
      return {
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    }),
    
  markAllAsRead: () => 
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0,
    })),
    
  markAsRead: (id) => 
    set((state) => {
      const notifications = state.notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      );
      
      const unreadCount = notifications.filter(n => !n.read).length;
      
      return { notifications, unreadCount };
    }),
    
  clearAll: () => 
    set({ notifications: [], unreadCount: 0 }),
}));
