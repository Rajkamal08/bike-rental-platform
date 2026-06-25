import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

export interface KYCData {
    _id?: string;
    userId: string;
    documentType: 'aadhaar' | 'license';
    documentNumber: string;
    frontImage: string;
    backImage?: string;
    status: 'pending' | 'verified' | 'rejected';
    adminComment?: string;
}

interface KYCContextType {
    kycStatus: 'not_submitted' | 'pending' | 'verified' | 'rejected';
    kycData: KYCData | null;
    loading: boolean;
    submitKYC: (data: {
        documentType: 'aadhaar' | 'license';
        documentNumber: string;
        frontImage: string;
        backImage?: string;
    }) => Promise<boolean>;
    refreshKYC: () => Promise<void>;
}

const KYCContext = createContext<KYCContextType | undefined>(undefined);

export const useKYC = () => {
    const context = useContext(KYCContext);
    if (!context) {
        throw new Error('useKYC must be used within a KYCProvider');
    }
    return context;
};

export const KYCProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { isAuthenticated } = useAuth();
    const [kycData, setKycData] = useState<KYCData | null>(null);
    const [kycStatus, setKycStatus] = useState<
        'not_submitted' | 'pending' | 'verified' | 'rejected'
    >('not_submitted');
    const [loading, setLoading] = useState<boolean>(true);

    const loadKYC = async () => {
        if (!isAuthenticated) return;
        try {
            const response = await api.get('kyc/status');
            if (response.data.status === 'not_submitted') {
                setKycStatus('not_submitted');
                setKycData(null);
            } else {
                setKycData(response.data);
                setKycStatus(response.data.status);
            }
        } catch (error) {
            console.error('Failed to load KYC status:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadKYC();
        } else {
            setKycData(null);
            setKycStatus('not_submitted');
            setLoading(false);
        }
    }, [isAuthenticated]);

    const submitKYC = async (data: {
        documentType: 'aadhaar' | 'license';
        documentNumber: string;
        frontImage: string;
        backImage?: string;
    }): Promise<boolean> => {
        try {
            const response = await api.post('kyc/submit', data);
            setKycData(response.data.kyc);
            setKycStatus(response.data.kyc.status);
            return true;
        } catch (error) {
            console.error('Failed to submit KYC:', error);
            return false;
        }
    };

    const refreshKYC = async () => {
        await loadKYC();
    };

    return (
        <KYCContext.Provider
            value={{
                kycStatus,
                kycData,
                loading,
                submitKYC,
                refreshKYC,
            }}
        >
            {children}
        </KYCContext.Provider>
    );
};
