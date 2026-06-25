import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

export interface Notification {
    _id: string; // MongoDB _id
    id?: string; // Compat
    title: string;
    message: string;
    createdAt: string; // MongoDB timestamp
    read: boolean;
    type: 'booking' | 'wallet' | 'system' | 'promo';
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    addNotification: (
        title: string,
        message: string,
        type: Notification['type']
    ) => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    clearNotifications: () => Promise<void>;
    refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined
);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const loadNotifications = async () => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }
        try {
            const response = await api.get('notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, [isAuthenticated]);

    const addNotification = async (
        title: string,
        message: string,
        type: Notification['type']
    ) => {
        try {
            const response = await api.post('notifications', { title, message, type });
            setNotifications(prev => [response.data, ...prev]);
        } catch (error) {
            console.error('Failed to add notification:', error);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            const response = await api.patch(`notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => (n._id === id ? response.data : n))
            );
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.patch('notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const clearNotifications = async () => {
        try {
            await api.delete('notifications/clear');
            setNotifications([]);
        } catch (error) {
            console.error('Failed to clear notifications:', error);
        }
    };

    const refreshNotifications = async () => {
        await loadNotifications();
    };


    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                loading,
                addNotification,
                markAsRead,
                markAllAsRead,
                clearNotifications,
                refreshNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
