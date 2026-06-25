import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Shield } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const PrivacyPolicyScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="bg-yellow-400 p-4 flex-row items-center border-b border-yellow-500">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-black flex-1">
                    Privacy Policy
                </Text>
                <Shield size={24} color="black" />
            </View>

            <ScrollView className="flex-1 p-5">
                <View className="mb-6">
                    <Text className="text-sm text-gray-500 mb-4">
                        Last Updated: Jan 2026
                    </Text>
                    <Text className="text-gray-700 leading-6 mb-4">
                        RB Bike Rentals respects your privacy. This policy explains how we collect, use, and protect your personal information.
                    </Text>

                    <Text className="text-lg font-bold text-gray-900 mb-2">1. Information We Collect</Text>
                    <Text className="text-gray-700 leading-6 mb-4">
                        • Personal details: Name, phone number, email.{'\n'}
                        • Verification documents: Driving license, ID proof.{'\n'}
                        • Location data: To provide nearby vehicles and track rides (during active bookings).
                    </Text>

                    <Text className="text-lg font-bold text-gray-900 mb-2">2. How We Use Information</Text>
                    <Text className="text-gray-700 leading-6 mb-4">
                        • To process bookings and payments.{'\n'}
                        • To verify identity and eligibility.{'\n'}
                        • To ensure vehicle security via GPS tracking.{'\n'}
                        • To improve our app and services.
                    </Text>

                    <Text className="text-lg font-bold text-gray-900 mb-2">3. Data Security</Text>
                    <Text className="text-gray-700 leading-6 mb-4">
                        • We use industry-standard encryption to protect your data.{'\n'}
                        • We do not sell your personal data to third parties.
                    </Text>

                    <Text className="text-lg font-bold text-gray-900 mb-2">4. Your Rights</Text>
                    <Text className="text-gray-700 leading-6 mb-4">
                        • You can request account deletion at any time.{'\n'}
                        • You can update your profile information within the app.
                    </Text>
                </View>

                <View className="h-10" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({});
