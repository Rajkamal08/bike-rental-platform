import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ArrowLeft, Calendar, Clock, Info } from 'lucide-react-native';
import api from '../utils/api';
import dayjs from 'dayjs';
import { useStripe } from '@stripe/stripe-react-native';

const ExtendBookingScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { booking } = route.params;
    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const [days, setDays] = useState(1);
    const [loading, setLoading] = useState(false);

    const bookingDurationDays = dayjs(booking.endDate).diff(dayjs(booking.startDate), 'day');
    const pricePerDay = bookingDurationDays > 0 ? booking.totalPrice / bookingDurationDays : 500;
    const additionalPrice = pricePerDay * days;

    const handleExtend = async () => {
        setLoading(true);
        try {
            // 1. Create PaymentIntent for the extension
            const intentRes = await api.post('payment/create-payment-intent', {
                amount: additionalPrice,
                metadata: {
                    bookingId: booking._id,
                    type: 'extension',
                    extraDays: days
                }
            });
            const { clientSecret } = intentRes.data;

            // 2. Stripe Payment
            const { error: initError } = await initPaymentSheet({
                paymentIntentClientSecret: clientSecret,
                merchantDisplayName: 'Rent Ride',
                defaultBillingDetails: {
                    address: { country: 'IN' }
                },
                appearance: {
                    colors: { primary: '#fbbf24' }
                }
            });

            if (initError) {
                Alert.alert('Error', initError.message);
                setLoading(false);
                return;
            }

            const { error: presentError } = await presentPaymentSheet();
            if (presentError) {
                if (presentError.code !== 'Canceled') {
                    Alert.alert('Payment Failed', presentError.message);
                }
                setLoading(false);
                return;
            }

            // 3. Confirm and Update Booking on Backend
            const newEndDate = dayjs(booking.endDate).add(days, 'day').toISOString();

            const response = await api.post(`bookings/${booking._id}/extend`, {
                newEndDate,
                newEndTime: booking.endTime,
                additionalPrice,
            });

            if (response.data.booking) {
                Alert.alert('Success', 'Your booking has been extended!', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            }
        } catch (error) {
            console.error('Extension error:', error);
            Alert.alert('Error', 'Could not process extension. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-black ml-4">Extend Booking</Text>
            </View>

            <ScrollView className="flex-1 px-4 py-6">
                <View className="bg-yellow-50 p-4 rounded-xl mb-6">
                    <Text className="text-yellow-800 font-semibold mb-1">Current End Date</Text>
                    <Text className="text-lg font-bold text-black">
                        {dayjs(booking.endDate).format('DD MMM YYYY')} at {booking.endTime}
                    </Text>
                </View>

                <Text className="text-gray-700 font-bold text-lg mb-4">Extend by</Text>
                <View className="flex-row justify-between mb-8">
                    {[1, 2, 3, 5].map((d) => (
                        <TouchableOpacity
                            key={d}
                            onPress={() => setDays(d)}
                            className={`w-[22%] py-3 rounded-xl border-2 items-center ${days === d ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
                                }`}
                        >
                            <Text className={`font-bold ${days === d ? 'text-black' : 'text-gray-500'}`}>
                                {d} Day{d > 1 ? 's' : ''}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="bg-gray-50 p-6 rounded-2xl mb-8">
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-500">New End Date</Text>
                        <Text className="text-black font-semibold">
                            {dayjs(booking.endDate).add(days, 'day').format('DD MMM YYYY')}
                        </Text>
                    </View>
                    <View className="flex-row justify-between pt-4 border-t border-gray-200">
                        <Text className="text-gray-800 font-bold text-lg">Additional Cost</Text>
                        <Text className="text-black font-bold text-xl">₹{additionalPrice}</Text>
                    </View>
                </View>

                <View className="flex-row items-start bg-blue-50 p-4 rounded-xl mb-10">
                    <Info size={20} color="#3b82f6" />
                    <Text className="text-blue-800 text-xs flex-1 ml-2 leading-4">
                        Extension is subject to availability. The payment will be processed via Stripe.
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={handleExtend}
                    disabled={loading}
                    className={`bg-yellow-400 py-4 rounded-xl items-center justify-center shadow-md ${loading ? 'opacity-70' : ''
                        }`}
                >
                    {loading ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text className="text-black font-bold text-lg">Confirm & Pay Extension</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ExtendBookingScreen;

const styles = StyleSheet.create({});
