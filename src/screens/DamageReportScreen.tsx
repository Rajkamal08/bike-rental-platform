import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    Alert,
    ScrollView,
    ActivityIndicator,
    FlatList
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ArrowLeft, Camera, X } from 'lucide-react-native';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import api from '../utils/api';

type RootStackParamList = {
    DamageReport: {
        bookingId: string;
        vehicleName?: string;
    };
};

type DamageReportRouteProp = RouteProp<RootStackParamList, 'DamageReport'>;

const DamageReportScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<DamageReportRouteProp>();
    const { bookingId, vehicleName } = route.params;

    const [description, setDescription] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [reportType, setReportType] = useState<'pre-ride' | 'post-ride' | 'accident'>('pre-ride');

    const handleImagePick = async () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            selectionLimit: 3 - images.length, // Limit to 3 images total
            includeBase64: true,
        };

        if (images.length >= 3) {
            Alert.alert('Limit Reached', 'You can upload up to 3 photos.');
            return;
        }

        const result = await launchImageLibrary(options);

        if (result.assets && result.assets.length > 0) {
            const newImages = result.assets.map(asset => `data:image/jpeg;base64,${asset.base64}`);
            setImages([...images, ...newImages]);
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleSubmit = async () => {
        if (!description.trim()) {
            Alert.alert('Required', 'Please describe the issue.');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('damage', {
                bookingId,
                description,
                images,
                reportType
            });
            Alert.alert('Success', 'Damage report submitted successfully.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error('Report error:', error);
            Alert.alert('Error', 'Failed to submit report.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-4 py-4 flex-row items-center border-b border-gray-100">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 rounded-full bg-gray-50 mr-3"
                >
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <View>
                    <Text className="text-xl font-bold text-gray-900">Report Damage</Text>
                    <Text className="text-xs text-gray-500">{vehicleName || 'Booking Issue'}</Text>
                </View>
            </View>

            <ScrollView className="flex-1 p-6">

                <Text className="font-bold text-gray-900 mb-3">When did you notice this?</Text>
                <View className="flex-row gap-2 mb-6">
                    {['pre-ride', 'post-ride', 'accident'].map((type) => (
                        <TouchableOpacity
                            key={type}
                            onPress={() => setReportType(type as any)}
                            className={`px-4 py-2 rounded-full border ${reportType === type
                                    ? 'bg-black border-black'
                                    : 'bg-white border-gray-300'
                                }`}
                        >
                            <Text className={`capitalize ${reportType === type ? 'text-white' : 'text-gray-700'
                                }`}>
                                {type.replace('-', ' ')}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text className="font-bold text-gray-900 mb-3">Describe the Issue</Text>
                <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="E.g., Scratches on the left side tank..."
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-900 mb-6 h-32"
                />

                <Text className="font-bold text-gray-900 mb-3">Photos (Max 3)</Text>
                <View className="flex-row flex-wrap gap-4 mb-8">
                    {images.map((uri, index) => (
                        <View key={index} className="w-24 h-24 relative">
                            <Image source={{ uri }} className="w-full h-full rounded-xl" />
                            <TouchableOpacity
                                onPress={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                            >
                                <X size={12} color="white" />
                            </TouchableOpacity>
                        </View>
                    ))}
                    {images.length < 3 && (
                        <TouchableOpacity
                            onPress={handleImagePick}
                            className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl items-center justify-center bg-gray-50"
                        >
                            <Camera size={24} color="#9ca3af" />
                        </TouchableOpacity>
                    )}
                </View>

            </ScrollView>

            <View className="p-4 border-t border-gray-100">
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={submitting}
                    className={`py-4 rounded-xl items-center justify-center ${submitting ? 'bg-gray-300' : 'bg-red-500'
                        }`}
                >
                    {submitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Submit Report</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default DamageReportScreen;
