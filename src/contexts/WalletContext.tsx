import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

export interface Transaction {
    _id?: string; // MongoDB generates _id
    id?: string; // For backward compatibility if needed, or mapped from _id
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: string;
    status: 'success' | 'failed' | 'pending';
}

interface WalletContextType {
    balance: number;
    transactions: Transaction[];
    loading: boolean;
    addMoney: (amount: number, description?: string) => Promise<boolean>;
    deductMoney: (amount: number, description: string) => Promise<boolean>;
    refreshWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { isAuthenticated } = useAuth();
    const [balance, setBalance] = useState<number>(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const loadWalletData = async () => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }
        try {
            const response = await api.get('wallet');
            const { balance, transactions } = response.data;
            setBalance(balance);
            setTransactions(transactions);
        } catch (error) {
            console.error('Failed to load wallet data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWalletData();
    }, [isAuthenticated]);

    const addMoney = async (
        amount: number,
        description: string = 'Added to wallet'
    ): Promise<boolean> => {
        try {
            const response = await api.post('wallet/add', { amount, description });
            setBalance(response.data.balance);
            setTransactions(response.data.transactions);
            return true;
        } catch (error) {
            console.error('Failed to add money:', error);
            return false;
        }
    };

    const deductMoney = async (
        amount: number,
        description: string
    ): Promise<boolean> => {
        try {
            const response = await api.post('wallet/deduct', { amount, description });
            setBalance(response.data.balance);
            setTransactions(response.data.transactions);
            return true;
        } catch (error) {
            console.error('Failed to deduct money:', error);
            return false;
        }
    };

    const refreshWallet = async () => {
        await loadWalletData();
    };

    return (
        <WalletContext.Provider
            value={{
                balance,
                transactions,
                loading,
                addMoney,
                deductMoney,
                refreshWallet,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};
