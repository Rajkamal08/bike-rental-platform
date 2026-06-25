import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

export interface Address {
    _id: string; // Changed from id to _id for MongoDB
    label: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    isDefault: boolean;
}

interface AddressContextType {
    addresses: Address[];
    loading: boolean;
    addAddress: (address: Omit<Address, '_id' | 'isDefault'>) => Promise<void>;
    updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
    deleteAddress: (id: string) => Promise<void>;
    setDefaultAddress: (id: string) => Promise<void>;
    refreshAddresses: () => Promise<void>;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const useAddress = () => {
    const context = useContext(AddressContext);
    if (!context) {
        throw new Error('useAddress must be used within an AddressProvider');
    }
    return context;
};

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { isAuthenticated } = useAuth();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const loadAddresses = async () => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }
        try {
            const response = await api.get('address');
            setAddresses(response.data);
        } catch (error) {
            console.error('Failed to load addresses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAddresses();
    }, [isAuthenticated]);

    const addAddress = async (addressData: Omit<Address, '_id' | 'isDefault'>) => {
        try {
            const response = await api.post('address', addressData);
            setAddresses(prev => [...prev, response.data]);
        } catch (error) {
            console.error('Failed to add address:', error);
            throw error;
        }
    };

    const updateAddress = async (id: string, updates: Partial<Address>) => {
        try {
            const response = await api.put(`address/${id}`, updates);
            setAddresses(prev =>
                prev.map(addr => (addr._id === id ? response.data : addr))
            );
            // If default was changed, we might need to reload all to reflect other changes
            if (updates.isDefault) {
                await loadAddresses();
            }
        } catch (error) {
            console.error('Failed to update address:', error);
            throw error;
        }
    };

    const deleteAddress = async (id: string) => {
        try {
            await api.delete(`address/${id}`);
            setAddresses(prev => prev.filter(addr => addr._id !== id));
        } catch (error) {
            console.error('Failed to delete address:', error);
            throw error;
        }
    };

    const setDefaultAddress = async (id: string) => {
        try {
            // We reuse update address logic, but just setting isDefault to true
            await updateAddress(id, { isDefault: true });
        } catch (error) {
            console.error('Failed to set default address:', error);
            throw error;
        }
    };

    const refreshAddresses = async () => {
        await loadAddresses();
    };

    return (
        <AddressContext.Provider
            value={{
                addresses,
                loading,
                addAddress,
                updateAddress,
                deleteAddress,
                setDefaultAddress,
                refreshAddresses,
            }}
        >
            {children}
        </AddressContext.Provider>
    );
};
