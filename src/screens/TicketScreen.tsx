import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView,
    Image,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Upload, X } from 'lucide-react-native';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';

const TicketScreen = () => {
    const navigation = useNavigation();
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
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
        if (!subject.trim() || !description.trim()) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        setLoading(true);
        // Simulate API call with image
        setTimeout(() => {
            setLoading(false);
            Alert.alert(
                'Ticket Raised',
                'Your support ticket has been created successfully. We will contact you shortly.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        }, 1500);
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
                <Text className="text-xl font-bold text-gray-900">Raise a Ticket</Text>
            </View>

            <ScrollView className="flex-1 p-6">
                <View className="mb-6">
                    <Text className="text-gray-700 font-semibold mb-2 ml-1">Subject</Text>
                    <TextInput
                        value={subject}
                        onChangeText={setSubject}
                        placeholder="Briefly describe the issue"
                        className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-900"
                    />
                </View>

                <View className="mb-6">
                    <Text className="text-gray-700 font-semibold mb-2 ml-1">
                        Description
                    </Text>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Provide more details..."
                        multiline
                        numberOfLines={6}
                        className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-900 h-40"
                        textAlignVertical="top"
                    />
                </View>

                {selectedImage ? (
                    <View className="mb-8 relative rounded-xl overflow-hidden border border-gray-200">
                        <Image
                            source={{ uri: selectedImage }}
                            className="w-full h-48"
                            resizeMode="cover"
                        />
                        <TouchableOpacity
                            onPress={handleRemoveImage}
                            className="absolute top-2 right-2 bg-black/50 p-2 rounded-full"
                        >
                            <X size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={handleImagePick}
                        className="flex-row items-center justify-center border-2 border-dashed border-gray-300 p-8 rounded-xl mb-8 bg-gray-50 active:bg-gray-100"
                    >
                        <Upload size={24} color="#6b7280" />
                        <Text className="text-gray-600 font-medium ml-2">
                            Upload Screenshot (Optional)
                        </Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    className={`py-4 rounded-xl items-center justify-center shadow-sm ${loading ? 'bg-gray-300' : 'bg-yellow-400'
                        }`}
                >
                    {loading ? (
                        <ActivityIndicator color="black" />
                    ) : (
                        <Text className="text-black font-bold text-lg">Submit Ticket</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default TicketScreen;

const styles = StyleSheet.create({});
