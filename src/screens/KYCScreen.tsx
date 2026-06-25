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
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Upload, Camera, FileText } from 'lucide-react-native';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import { useKYC } from '../contexts/KYCContext';

const KYCScreen = () => {
    const navigation = useNavigation();
    const { submitKYC, loading: kycLoading, kycStatus, kycData } = useKYC();

    const [documentType, setDocumentType] = useState<'aadhaar' | 'license'>('aadhaar');
    const [documentNumber, setDocumentNumber] = useState('');
    const [frontImage, setFrontImage] = useState<string | null>(null);
    const [backImage, setBackImage] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // If verified, show success state
    if (kycStatus === 'verified') {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center p-6">
                <View className="bg-green-100 p-6 rounded-full mb-6">
                    <FileText size={64} color="#16a34a" />
                </View>
                <Text className="text-2xl font-bold text-gray-900 mb-2">Verified!</Text>
                <Text className="text-gray-500 text-center mb-8">
                    Your KYC documents have been verified. You are all set to book rides.
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="bg-gray-900 w-full py-4 rounded-xl items-center"
                >
                    <Text className="text-white font-bold text-lg">Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    // If pending, show pending state
    if (kycStatus === 'pending') {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center p-6">
                <View className="bg-yellow-100 p-6 rounded-full mb-6">
                    <FileText size={64} color="#ca8a04" />
                </View>
                <Text className="text-2xl font-bold text-gray-900 mb-2">Verification Pending</Text>
                <Text className="text-gray-500 text-center mb-8">
                    We are reviewing your documents. This usually takes 24-48 hours.
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="bg-gray-900 w-full py-4 rounded-xl items-center"
                >
                    <Text className="text-white font-bold text-lg">Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }


    const handleImagePick = async (side: 'front' | 'back') => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            selectionLimit: 1,
            includeBase64: true, // In real app, upload to S3/Cloudinary. Here using base64 for demo simplicity/local.
        };

        const result = await launchImageLibrary(options);

        if (result.assets && result.assets.length > 0) {
            // For real backend, you'd upload here. For now, we simulate a URL or use base64 data URI
            // NOTE: Sending large base64 strings to backend might hit body limit. 
            // Ideally: Upload to server -> Get URL -> Send URL.
            // Simplified: utilizing base64 data URI directly if backend supports it or simple URI.
            // IMPORTANT: To make this robust, we will just use the URI. The backend logic assumed it's a string.
            // If backend is local it can't read local device URI. 
            // But since this is a demo environment, I will just send a placeholder or the base64 string if it's small enough.
            // Let's assume we send the base64 string as the "Image URL" for this prototype.

            const imageUri = `data:image/jpeg;base64,${result.assets[0].base64}`;

            if (side === 'front') setFrontImage(imageUri);
            else setBackImage(imageUri);
        }
    };

    const handleSubmit = async () => {
        if (!documentNumber || !frontImage) {
            Alert.alert('Missing Info', 'Please provide document number and front image.');
            return;
        }

        setSubmitting(true);
        const success = await submitKYC({
            documentType,
            documentNumber,
            frontImage,
            backImage: backImage || undefined,
        });
        setSubmitting(false);

        if (success) {
            Alert.alert('Submitted', 'Your KYC documents have been submitted for verification.');
        } else {
            Alert.alert('Error', 'Failed to submit KYC. Please try again.');
        }
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
                <Text className="text-xl font-bold text-gray-900">KYC Verification</Text>
            </View>

            <ScrollView className="flex-1 p-6">
                <Text className="text-gray-500 mb-6">
                    To ensure the safety of our vehicles, we require a valid government ID and Driving License.
                </Text>

                {/* Document Type */}
                <Text className="font-bold text-gray-900 mb-3">Document Type</Text>
                <View className="flex-row gap-4 mb-6">
                    <TouchableOpacity
                        onPress={() => setDocumentType('aadhaar')}
                        className={`flex-1 p-4 rounded-xl border items-center ${documentType === 'aadhaar'
                                ? 'bg-yellow-50 border-yellow-400'
                                : 'bg-white border-gray-200'
                            }`}
                    >
                        <Text className={`font-semibold ${documentType === 'aadhaar' ? 'text-yellow-800' : 'text-gray-600'}`}>
                            Aadhaar Card
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setDocumentType('license')}
                        className={`flex-1 p-4 rounded-xl border items-center ${documentType === 'license'
                                ? 'bg-yellow-50 border-yellow-400'
                                : 'bg-white border-gray-200'
                            }`}
                    >
                        <Text className={`font-semibold ${documentType === 'license' ? 'text-yellow-800' : 'text-gray-600'}`}>
                            Driving License
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Document Number */}
                <Text className="font-bold text-gray-900 mb-3">Document Number</Text>
                <TextInput
                    value={documentNumber}
                    onChangeText={setDocumentNumber}
                    placeholder={`Enter ${documentType === 'aadhaar' ? 'Aadhaar' : 'License'} Number`}
                    className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-900 mb-6"
                />

                {/* Front Image */}
                <Text className="font-bold text-gray-900 mb-3">Front Side Photo</Text>
                <TouchableOpacity
                    onPress={() => handleImagePick('front')}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 items-center justify-center bg-gray-50 mb-6 h-48 overflow-hidden relative"
                >
                    {frontImage ? (
                        <Image source={{ uri: frontImage }} className="absolute w-full h-full" resizeMode="cover" />
                    ) : (
                        <>
                            <Camera size={32} color="#9ca3af" />
                            <Text className="text-gray-500 mt-2">Tap to Upload</Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* Back Image */}
                <Text className="font-bold text-gray-900 mb-3">Back Side Photo (Optional)</Text>
                <TouchableOpacity
                    onPress={() => handleImagePick('back')}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 items-center justify-center bg-gray-50 mb-8 h-48 overflow-hidden relative"
                >
                    {backImage ? (
                        <Image source={{ uri: backImage }} className="absolute w-full h-full" resizeMode="cover" />
                    ) : (
                        <>
                            <Camera size={32} color="#9ca3af" />
                            <Text className="text-gray-500 mt-2">Tap to Upload</Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* Submit Button */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={submitting || kycLoading}
                    className={`nav-button py-4 rounded-xl items-center justify-center mb-10 ${submitting || kycLoading ? 'bg-gray-300' : 'bg-yellow-400'
                        }`}
                >
                    {submitting ? (
                        <ActivityIndicator color="black" />
                    ) : (
                        <Text className="text-black font-bold text-lg">Submit for Verification</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default KYCScreen;
