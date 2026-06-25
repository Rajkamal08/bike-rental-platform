import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Review {
    id: string;
    vehicleId: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
    photos?: string[];
}

interface RatingContextType {
    reviews: Review[];
    loading: boolean;
    addReview: (review: Omit<Review, 'id' | 'date'>) => Promise<boolean>;
    getReviewsByVehicleId: (vehicleId: string) => Review[];
    getAverageRating: (vehicleId: string) => number;
}

const RatingContext = createContext<RatingContextType | undefined>(undefined);

export const useRating = () => {
    const context = useContext(RatingContext);
    if (!context) {
        throw new Error('useRating must be used within a RatingProvider');
    }
    return context;
};

export const RatingProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const STORAGE_KEY = '@vehicle_reviews';

    const loadReviews = async () => {
        try {
            const storedReviews = await AsyncStorage.getItem(STORAGE_KEY);
            if (storedReviews) {
                setReviews(JSON.parse(storedReviews));
            } else {
                // Add some dummy reviews for demonstration
                const dummyReviews: Review[] = [
                    {
                        id: '1',
                        vehicleId: 'dummy_1', // Replace with actual IDs if known or generic
                        userId: 'user_1',
                        userName: 'Rahul Kumar',
                        rating: 5,
                        comment: 'Amazing bike! Very smooth ride and good mileage.',
                        date: new Date().toISOString(),
                    },
                    {
                        id: '2',
                        vehicleId: 'dummy_1',
                        userId: 'user_2',
                        userName: 'Priya Singh',
                        rating: 4,
                        comment: 'Good condition but pickup location was a bit far.',
                        date: new Date(Date.now() - 86400000).toISOString(),
                    },
                ];
                setReviews(dummyReviews);
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dummyReviews));
            }
        } catch (error) {
            console.error('Failed to load reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, []);

    const saveReviews = async (newReviews: Review[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newReviews));
            setReviews(newReviews);
        } catch (error) {
            console.error('Failed to save reviews:', error);
        }
    };

    const addReview = async (
        reviewData: Omit<Review, 'id' | 'date'>
    ): Promise<boolean> => {
        try {
            const newReview: Review = {
                ...reviewData,
                id: Date.now().toString(),
                date: new Date().toISOString(),
            };

            const newReviews = [newReview, ...reviews];
            await saveReviews(newReviews);
            return true;
        } catch (error) {
            console.error('Failed to add review:', error);
            return false;
        }
    };

    const getReviewsByVehicleId = (vehicleId: string) => {
        return reviews.filter(review => review.vehicleId === vehicleId);
    };

    const getAverageRating = (vehicleId: string) => {
        const vehicleReviews = getReviewsByVehicleId(vehicleId);
        if (vehicleReviews.length === 0) return 0;
        const sum = vehicleReviews.reduce((acc, review) => acc + review.rating, 0);
        return parseFloat((sum / vehicleReviews.length).toFixed(1));
    };

    return (
        <RatingContext.Provider
            value={{
                reviews,
                loading,
                addReview,
                getReviewsByVehicleId,
                getAverageRating,
            }}
        >
            {children}
        </RatingContext.Provider>
    );
};
