import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, FileText } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const TermsConditionsScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="bg-yellow-400 p-4 flex-row items-center border-b border-yellow-500">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-black flex-1">
                    Terms & Conditions
                </Text>
                <FileText size={24} color="black" />
            </View>

            <ScrollView className="flex-1 p-5">
                <View className="mb-6">
                    <Text className="text-sm text-gray-500 mb-4">
                        Last Updated: Jan 2026
                    </Text>
                    <Text className="text-gray-700 leading-6 mb-4">
                        Welcome to RB Bike Rentals. By accessing or using our mobile application, you agree to be bound by these Terms and Conditions.
                    </Text>

                    <Text className="text-lg font-bold text-gray-900 mb-2">1. Booking & Eligibility</Text>
                    <Text className="text-gray-700 leading-6 mb-4">
                        • Users must be at least 18 years old and possess a valid driving license.{'\n'}
                        • Bookings are subject to vehicle availability.{'\n'}
                        • We reserve the right to cancel bookings if verification fails.
                    </Text>

                    <Text className="text-lg font-bold text-gray-900 mb-2">2. Vehicle Usage</Text>
                    <Text className="text-gray-700 leading-6 mb-4">
                        • The vehicle must be used in accordance with traffic laws.{'\n'}
                        • Users are responsible for fuel and parking charges.{'\n'}
                        • Use of the vehicle for illegal activities or racing is strictly prohibited.
                    </Text>

                    <Text className="text-lg font-bold text-gray-900 mb-2">3. Damages & Penalties</Text>
                    <Text className="text-gray-700 leading-6 mb-4">
                        • Users are liable for any damages caused during the rental period.{'\n'}
                        • Detailed inspection will be done upon return.{'\n'}
                        • Late returns will incur additional charges as per our policy.
                    </Text>

                    <Text className="text-lg font-bold text-gray-900 mb-2">4. Liability</Text>
                    <Text className="text-gray-700 leading-6 mb-4">
                        • RB Bike Rentals is not liable for any personal injury or loss of belongings.{'\n'}
                        • We strongly recommend wearing helmets and safety gear at all times.
                    </Text>
                </View>

                <View className="h-10" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default TermsConditionsScreen;

const styles = StyleSheet.create({});
