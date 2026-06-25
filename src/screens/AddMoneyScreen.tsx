import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, CreditCard, Wallet, Smartphone } from 'lucide-react-native';
import { useWallet } from '../contexts/WalletContext';
import api from '../utils/api';
import { useStripe } from '@stripe/stripe-react-native';

const AddMoneyScreen = () => {
    const navigation = useNavigation<any>();
    const { refreshWallet } = useWallet();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('upi');

    const quickAmounts = [100, 200, 500, 1000];

    const handleAddMoney = async () => {
        const value = parseFloat(amount);
        if (!value || value <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0');
            return;
        }

        setLoading(true);

        try {
            // 1. Create PaymentIntent on Backend
            const intentRes = await api.post('payment/create-payment-intent', {
                amount: value,
                metadata: {
                    type: 'wallet_topup'
                }
            });
            const { clientSecret } = intentRes.data;

            // 2. Initialize Payment Sheet
            const { error: initError } = await initPaymentSheet({
                paymentIntentClientSecret: clientSecret,
                merchantDisplayName: 'Rent Ride',
                defaultBillingDetails: {
                    address: {
                        country: 'IN',
                    },
                },
                appearance: {
                    colors: {
                        primary: '#fbbf24', // yellow-400
                    },
                },
            });

            if (initError) {
                Alert.alert('Error', initError.message);
                setLoading(false);
                return;
            }

            // 3. Present Payment Sheet
            const { error: presentError } = await presentPaymentSheet();

            if (presentError) {
                if (presentError.code !== 'Canceled') {
                    Alert.alert('Payment Failed', presentError.message);
                }
                setLoading(false);
                return;
            }

            // 4. Payment Success - Confirm on backend
            const confirmRes = await api.post('payment/confirm', {
                paymentIntentId: clientSecret.split('_secret')[0],
                walletAmount: value
            });

            if (confirmRes.data.success) {
                await refreshWallet(); // Refresh balance
                Alert.alert(
                    'Success',
                    `₹${value} added to your wallet successfully!`,
                    [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
            } else {
                Alert.alert('Processing Error', "Payment was successful but we couldn't confirm it. Please contact support.");
            }

        } catch (err) {
            console.error('Stripe Integration Error:', err);
            Alert.alert('Error', 'Could not initiate payment. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const PaymentMethod = ({
        id,
        title,
        icon: Icon,
    }: {
        id: string;
        title: string;
        icon: any;
    }) => (
        <TouchableOpacity
            onPress={() => setSelectedMethod(id)}
            className={`flex-row items-center p-4 rounded-xl border mb-3 ${selectedMethod === id
                ? 'bg-yellow-50 border-yellow-400'
                : 'bg-white border-gray-200'
                }`}
        >
            <View
                className={`p-2 rounded-full mr-3 ${selectedMethod === id ? 'bg-yellow-200' : 'bg-gray-100'
                    }`}
            >
                <Icon
                    size={20}
                    color={selectedMethod === id ? '#854d0e' : '#6b7280'}
                />
            </View>
            <Text
                className={`font-semibold text-base ${selectedMethod === id ? 'text-gray-900' : 'text-gray-600'
                    }`}
            >
                {title}
            </Text>
            {selectedMethod === id && (
                <View className="ml-auto bg-yellow-400 w-4 h-4 rounded-full" />
            )}
        </TouchableOpacity>
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
                <Text className="text-xl font-bold text-gray-900">Add Money</Text>
            </View>

            <ScrollView className="flex-1 px-4 pt-6">
                {/* Amount Input */}
                <Text className="text-gray-600 font-medium mb-2">Enter Amount</Text>
                <View className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex-row items-center">
                    <Text className="text-2xl font-bold text-gray-900 mr-2">₹</Text>
                    <TextInput
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="0"
                        keyboardType="numeric"
                        className="flex-1 text-3xl font-bold text-gray-900 p-0"
                        autoFocus
                    />
                </View>

                {/* Quick Amounts */}
                <View className="flex-row gap-3 mb-8 flex-wrap">
                    {quickAmounts.map(val => (
                        <TouchableOpacity
                            key={val}
                            onPress={() => setAmount(val.toString())}
                            className="bg-white border border-gray-200 px-4 py-2 rounded-full"
                        >
                            <Text className="text-gray-700 font-medium">+ ₹{val}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Payment Methods */}
                <Text className="text-gray-800 font-bold text-lg mb-4">
                    Payment Method
                </Text>

                <PaymentMethod id="upi" title="UPI (GPay, PhonePe)" icon={Smartphone} />
                <PaymentMethod id="card" title="Credit / Debit Card" icon={CreditCard} />
                <PaymentMethod id="netbanking" title="Net Banking" icon={Wallet} />
            </ScrollView>

            {/* Footer Button */}
            <View className="p-4 bg-white border-t border-gray-100">
                <TouchableOpacity
                    onPress={handleAddMoney}
                    disabled={loading || !amount}
                    className={`py-4 rounded-xl items-center justify-center ${loading || !amount ? 'bg-gray-300' : 'bg-yellow-400'
                        }`}
                >
                    {loading ? (
                        <ActivityIndicator color="black" />
                    ) : (
                        <Text className="text-black font-bold text-lg">
                            Proceed to Pay ₹{amount || '0'}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default AddMoneyScreen;

const styles = StyleSheet.create({});
