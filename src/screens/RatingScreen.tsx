import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ArrowLeft, Star, Camera, X } from 'lucide-react-native';
import { useRating } from '../contexts/RatingContext';
import { useAuth } from '../contexts/AuthContext';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';

type RootStackParamList = {
    Rating: {
        bookingId: string;
        vehicleId: string;
        vehicleName: string;
        vehicleImage?: string;
    };
};

type RatingScreenRouteProp = RouteProp<RootStackParamList, 'Rating'>;

const RatingScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<RatingScreenRouteProp>();
    const { bookingId, vehicleId, vehicleName, vehicleImage } = route.params;
    const { addReview } = useRating();
    const { user } = useAuth();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImagePick = async () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            selectionLimit: 1,
        };

        const result = await launchImageLibrary(options);

        if (result.didCancel) {
            console.log('User cancelled image picker');
        } else if (result.errorMessage) {
            console.error('ImagePicker Error: ', result.errorMessage);
            Alert.alert('Error', 'Failed to pick image');
        } else if (result.assets && result.assets.length > 0) {
            setSelectedImage(result.assets[0].uri || null);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            Alert.alert('Rating Required', 'Please select a star rating.');
            return;
        }

        setLoading(true);
        try {
            const success = await addReview({
                vehicleId,
                userId: user?.id || 'anonymous',
                userName: user?.firstName
                    ? `${user.firstName} ${user.lastName || ''}`.trim()
                    : 'User',
                rating,
                comment,
                photos: selectedImage ? [selectedImage] : [],
            });

            if (success) {
                Alert.alert('Thank You!', 'Your review has been submitted.', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                ]);
            } else {
                Alert.alert('Error', 'Failed to submit review. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            Alert.alert('Error', 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const StarRating = () => {
        return (
            <View className="flex-row justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map(star => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => setRating(star)}
                        activeOpacity={0.7}
                    >
                        <Star
                            size={40}
                            color={star <= rating ? '#fbbf24' : '#d1d5db'}
                            fill={star <= rating ? '#fbbf24' : 'transparent'}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="px-4 py-4 flex-row items-center border-b border-gray-100">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 rounded-full bg-gray-50 mr-3"
                >
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900">Rate Your Ride</Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                {/* Vehicle Info */}
                <View className="items-center mb-8">
                    {vehicleImage ? (
                        <Image
                            source={{ uri: vehicleImage }}
                            className="w-32 h-32 rounded-xl mb-4"
                            resizeMode="contain"
                        />
                    ) : (
                        <View className="w-32 h-32 bg-gray-100 rounded-xl mb-4 items-center justify-center">
                            <Text className="text-gray-400">No Image</Text>
                        </View>
                    )}
                    <Text className="text-2xl font-bold text-gray-900 text-center">
                        {vehicleName}
                    </Text>
                    <Text className="text-gray-500 mt-1">How was your experience?</Text>
                </View>

                {/* Star Rating */}
                <StarRating />

                {/* Comment Input */}
                <View className="mb-6">
                    <Text className="text-gray-700 font-semibold mb-2 ml-1">
                        Write a Review (Optional)
                    </Text>
                    <TextInput
                        value={comment}
                        onChangeText={setComment}
                        placeholder="Tell us about your ride..."
                        multiline
                        numberOfLines={4}
                        className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-900 h-32"
                        textAlignVertical="top"
                    />
                </View>

                {/* Photo Upload Placeholder */}
                {selectedImage ? (
                    <View className="mb-8 relative rounded-xl overflow-hidden border border-gray-200 self-start">
                        <Image
                            source={{ uri: selectedImage }}
                            className="w-24 h-24 rounded-lg"
                            resizeMode="cover"
                        />
                        <TouchableOpacity
                            onPress={handleRemoveImage}
                            className="absolute -top-2 -right-2 bg-black/50 p-1 rounded-full"
                        >
                            <X size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={handleImagePick}
                        className="flex-row items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-xl mb-8 bg-gray-50 active:bg-gray-100"
                    >
                        <Camera size={24} color="#6b7280" />
                        <Text className="text-gray-600 font-medium ml-2">Add Photos</Text>
                    </TouchableOpacity>
                )}

                {/* Submit Button */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    className={`py-4 rounded-xl items-center justify-center shadow-sm mb-10 ${loading ? 'bg-gray-300' : 'bg-yellow-400'
                        }`}
                >
                    {loading ? (
                        <ActivityIndicator color="black" />
                    ) : (
                        <Text className="text-black font-bold text-lg">Submit Review</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default RatingScreen;

const styles = StyleSheet.create({});
