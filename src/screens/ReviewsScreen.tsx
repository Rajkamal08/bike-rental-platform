import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ArrowLeft, Star, User } from 'lucide-react-native';
import { useRating, Review } from '../contexts/RatingContext';

type RootStackParamList = {
    Reviews: {
        vehicleId: string;
        vehicleName: string;
    };
};

type ReviewsScreenRouteProp = RouteProp<RootStackParamList, 'Reviews'>;

const ReviewsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<ReviewsScreenRouteProp>();
    const { vehicleId, vehicleName } = route.params;
    const { getReviewsByVehicleId, getAverageRating } = useRating();

    const [reviews, setReviews] = useState<Review[]>([]);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        const vehicleReviews = getReviewsByVehicleId(vehicleId);
        setReviews(vehicleReviews);
        setAverageRating(getAverageRating(vehicleId));
    }, [vehicleId]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const renderReviewItem = ({ item }: { item: Review }) => (
        <View className="bg-white p-4 rounded-xl mb-3 border border-gray-100 shadow-sm">
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center mr-3">
                        <User size={20} color="#6b7280" />
                    </View>
                    <View>
                        <Text className="font-bold text-gray-900">{item.userName}</Text>
                        <Text className="text-xs text-gray-500">{formatDate(item.date)}</Text>
                    </View>
                </View>
                <View className="flex-row items-center bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star size={14} color="#fbbf24" fill="#fbbf24" />
                    <Text className="ml-1 font-bold text-yellow-700">{item.rating}</Text>
                </View>
            </View>
            <Text className="text-gray-700 leading-5">{item.comment}</Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-4 py-4 flex-row items-center shadow-sm z-10">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 rounded-full bg-gray-100 mr-3"
                >
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <View>
                    <Text className="text-xl font-bold text-gray-900">Reviews</Text>
                    <Text className="text-xs text-gray-500">{vehicleName}</Text>
                </View>
            </View>

            {/* Summary Card */}
            <View className="bg-white m-4 p-5 rounded-2xl shadow-sm flex-row items-center justify-between">
                <View>
                    <Text className="text-4xl font-bold text-gray-900">
                        {averageRating}
                        <Text className="text-lg text-gray-400 font-normal">/5</Text>
                    </Text>
                    <Text className="text-gray-500 text-sm mt-1">
                        Based on {reviews.length} reviews
                    </Text>
                </View>
                <View className="items-end">
                    <View className="flex-row mb-1">
                        {[1, 2, 3, 4, 5].map(star => (
                            <Star
                                key={star}
                                size={18}
                                color={star <= Math.round(averageRating) ? '#fbbf24' : '#e5e7eb'}
                                fill={star <= Math.round(averageRating) ? '#fbbf24' : 'transparent'}
                                className="ml-0.5"
                            />
                        ))}
                    </View>
                    <Text className="text-yellow-600 font-medium text-xs">
                        Customer Satisfaction
                    </Text>
                </View>
            </View>

            {/* Reviews List */}
            <FlatList
                data={reviews}
                renderItem={renderReviewItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
                ListHeaderComponent={
                    <Text className="text-lg font-bold text-gray-800 mb-3 ml-1">
                        All Reviews
                    </Text>
                }
                ListEmptyComponent={
                    <View className="items-center justify-center py-10">
                        <Text className="text-gray-500">No reviews yet for this vehicle.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default ReviewsScreen;

const styles = StyleSheet.create({});
