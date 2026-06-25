import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    Image,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, User, Mail, Phone, Camera } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';

const ProfileEditScreen = () => {
    const navigation = useNavigation<any>();
    const { user, updateUser } = useAuth();

    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [profileImage, setProfileImage] = useState(user?.profileImage || '');
    const [loading, setLoading] = useState(false);

    const handleImagePick = async () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            selectionLimit: 1,
            includeBase64: true,
        };

        const result = await launchImageLibrary(options);

        if (result.assets && result.assets.length > 0) {
            const imageUri = `data:image/jpeg;base64,${result.assets[0].base64}`;
            setProfileImage(imageUri);
        }
    };

    const handleUpdateProfile = async () => {
        if (!firstName || !email) {
            Alert.alert('Error', 'First name and Email are required');
            return;
        }

        setLoading(true);
        try {
            const response = await api.patch('auth/profile', {
                firstName,
                lastName,
                email,
                profileImage,
            });

            if (response.data.user) {
                updateUser(response.data.user);
                // Update local auth state if necessary - navigate back
                Alert.alert('Success', 'Profile updated successfully!', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            }
        } catch (error) {
            console.error('Update profile error:', error);
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-black ml-4">Edit Profile</Text>
            </View>

            <ScrollView className="flex-1 px-4 py-6">
                {/* Profile Image Placeholder */}
                <View className="items-center mb-8">
                    <View className="relative">
                        <View className="w-24 h-24 bg-yellow-100 rounded-full items-center justify-center overflow-hidden">
                            {profileImage ? (
                                <Image 
                                    source={{ uri: profileImage }} 
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            ) : (
                                <User size={48} color="#fbbf24" />
                            )}
                        </View>
                        <TouchableOpacity
                            className="absolute bottom-0 right-0 bg-yellow-400 p-2 rounded-full border-2 border-white"
                            onPress={handleImagePick}
                        >
                            <Camera size={16} color="#000" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-gray-500 mt-2">Change Profile Photo</Text>
                </View>

                {/* Form */}
                <View className="space-y-4">
                    <View>
                        <Text className="text-gray-700 font-semibold mb-2 ml-1">First Name</Text>
                        <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                            <User size={20} color="#9ca3af" />
                            <TextInput
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholder="Enter your first name"
                                className="flex-1 ml-3 text-black"
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-gray-700 font-semibold mb-2 ml-1">Last Name</Text>
                        <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                            <User size={20} color="#9ca3af" />
                            <TextInput
                                value={lastName}
                                onChangeText={setLastName}
                                placeholder="Enter your last name"
                                className="flex-1 ml-3 text-black"
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-gray-700 font-semibold mb-2 ml-1">Email Address</Text>
                        <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                            <Mail size={20} color="#9ca3af" />
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Enter your email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                className="flex-1 ml-3 text-black"
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-gray-700 font-semibold mb-2 ml-1">Phone Number (Verified)</Text>
                        <View className="flex-row items-center bg-gray-200 rounded-xl px-4 py-3 border border-gray-200 opacity-60">
                            <Phone size={20} color="#9ca3af" />
                            <Text className="flex-1 ml-3 text-gray-600">{user?.phone}</Text>
                        </View>
                        <Text className="text-xs text-gray-400 mt-1 ml-1">Phone number cannot be changed.</Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleUpdateProfile}
                    disabled={loading}
                    className={`bg-yellow-400 rounded-xl py-4 mt-10 mb-8 items-center justify-center shadow-sm ${loading ? 'opacity-70' : ''}`}
                >
                    {loading ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text className="text-black font-bold text-lg">Update Profile</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileEditScreen;

const styles = StyleSheet.create({});
