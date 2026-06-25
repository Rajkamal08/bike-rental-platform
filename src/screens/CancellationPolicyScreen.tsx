import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, XCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const CancellationPolicyScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="bg-yellow-400 p-4 flex-row items-center border-b border-yellow-500">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-black flex-1">
                    Cancellation & Refund Policy
                </Text>
                <XCircle size={24} color="black" />
            </View>

            <ScrollView className="flex-1 p-5">
                <View className="mb-6">
                    <View className="bg-red-50 p-4 rounded-xl border border-red-100 mb-6">
                        <Text className="text-red-700 font-semibold text-center">
                            Review carefully before cancelling your booking.
                        </Text>
                    </View>

                    <Text className="text-lg font-bold text-gray-900 mb-2">1. Free Cancellation</Text>
                    <Text className="text-gray-700 leading-6 mb-4">
                        • You can cancel your booking for free up to 24 hours before the scheduled pickup time.{'\n'}
                        • 100% of the booking amount will be refunded to your wallet/source.
                    </Text>

                    <Text className="text-lg font-bold text-gray-900 mb-2">2. Late Cancellation Charges</Text>
                    <Text className="text-gray-700 leading-6 mb-4">
                        • <Text className="font-bold">24h - 4h before pickup:</Text> 50% cancellation fee applies.{'\n'}
                        • <Text className="font-bold">Less than 4h before pickup:</Text> No refund (100% fee).
                    </Text>

                    <Text className="text-lg font-bold text-gray-900 mb-2">3. No Show Policy</Text>
                    <Text className="text-gray-700 leading-6 mb-4">
                        • If you fail to pick up the vehicle within 2 hours of the start time without prior notice, the booking will be treated as a "No Show" and no refund will be issued.
                    </Text>

                    <Text className="text-lg font-bold text-gray-900 mb-2">4. Refund Process</Text>
                    <Text className="text-gray-700 leading-6 mb-4">
                        • Refunds are processed within 5-7 business days.{'\n'}
                        • Wallet refunds are instant.{'\n'}
                        • Security deposits (if any) are always fully refunded upon cancellation, regardless of timing.
                    </Text>
                </View>

                <View className="h-10" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default CancellationPolicyScreen;

const styles = StyleSheet.create({});
