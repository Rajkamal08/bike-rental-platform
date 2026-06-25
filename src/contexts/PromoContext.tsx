import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PromoCode {
    id: string;
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minOrderValue: number;
    maxDiscount?: number;
    expiryDate: string;
    isActive: boolean;
}

interface PromoContextType {
    promoCodes: PromoCode[];
    appliedPromo: PromoCode | null;
    loading: boolean;
    applyPromo: (code: string, orderValue: number) => { success: boolean; message: string; discount?: number };
    removePromo: () => void;
    getDiscountAmount: (orderValue: number) => number;
}

const PromoContext = createContext<PromoContextType | undefined>(undefined);

export const usePromo = () => {
    const context = useContext(PromoContext);
    if (!context) {
        throw new Error('usePromo must be used within a PromoProvider');
    }
    return context;
};

export const PromoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
    const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
    const [loading, setLoading] = useState(true);

    const STORAGE_KEY = '@promo_codes';

    const loadPromoCodes = async () => {
        try {
            // In a real app, fetch from API. Here we mock some codes.
            const mockCodes: PromoCode[] = [
                {
                    id: '1',
                    code: 'WELCOME50',
                    description: 'Get 50% off on your first ride',
                    discountType: 'percentage',
                    discountValue: 50,
                    minOrderValue: 200,
                    maxDiscount: 150,
                    expiryDate: '2025-12-31',
                    isActive: true,
                },
                {
                    id: '2',
                    code: 'RENT100',
                    description: 'Flat ₹100 off on bookings above ₹500',
                    discountType: 'fixed',
                    discountValue: 100,
                    minOrderValue: 500,
                    expiryDate: '2025-06-30',
                    isActive: true,
                },
                {
                    id: '3',
                    code: 'WEEKEND20',
                    description: '20% off on weekend rides',
                    discountType: 'percentage',
                    discountValue: 20,
                    minOrderValue: 300,
                    maxDiscount: 100,
                    expiryDate: '2025-12-31',
                    isActive: true,
                }
            ];
            setPromoCodes(mockCodes);
        } catch (error) {
            console.error('Failed to load promo codes', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPromoCodes();
    }, []);

    const applyPromo = (code: string, orderValue: number) => {
        const promo = promoCodes.find(p => p.code.toUpperCase() === code.toUpperCase());

        if (!promo) {
            return { success: false, message: 'Invalid promo code' };
        }

        if (!promo.isActive) {
            return { success: false, message: 'This promo code has expired' };
        }

        if (orderValue < promo.minOrderValue) {
            return { success: false, message: `Minimum booking amount of ₹${promo.minOrderValue} required` };
        }

        setAppliedPromo(promo);
        const discount = calculateDiscount(promo, orderValue);
        return { success: true, message: 'Promo code applied successfully!', discount };
    };

    const removePromo = () => {
        setAppliedPromo(null);
    };

    const calculateDiscount = (promo: PromoCode, orderValue: number) => {
        let discount = 0;
        if (promo.discountType === 'percentage') {
            discount = (orderValue * promo.discountValue) / 100;
            if (promo.maxDiscount) {
                discount = Math.min(discount, promo.maxDiscount);
            }
        } else {
            discount = promo.discountValue;
        }
        return Math.min(discount, orderValue); // Cannot exceed order value
    };

    const getDiscountAmount = (orderValue: number) => {
        if (!appliedPromo) return 0;
        return calculateDiscount(appliedPromo, orderValue);
    };

    return (
        <PromoContext.Provider value={{
            promoCodes,
            appliedPromo,
            loading,
            applyPromo,
            removePromo,
            getDiscountAmount
        }}>
            {children}
        </PromoContext.Provider>
    );
};
