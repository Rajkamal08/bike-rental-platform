import {
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  Switch,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../utils/api';
import ROUTES from '../navigation/routes/Routes';
import { useWallet } from '../contexts/WalletContext';
import { Wallet, Tag, X } from 'lucide-react-native';
import { usePromo } from '../contexts/PromoContext';

import { useStripe } from '@stripe/stripe-react-native';
import { useAddress } from '../contexts/AddressContext';
import { MapPin as MapPinIcon } from 'lucide-react-native';

const RideConfirmationScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  type RootStackParamList = {
    RideConfirmation: {
      selectedVehicle: {
        _id: string;
        name: string;
        calculatedPrice: number;
        calculatedIncludedKm: number;
        image: string;
      };
      pickupDate: string;
      pickupTime: string;
      dropoffDate: string;
      dropoffTime: string;
      location?: string;
    };
  };

  type RideConfirmationRouteProp = RouteProp<
    RootStackParamList,
    'RideConfirmation'
  >;

  const route = useRoute<RideConfirmationRouteProp>();
  const {
    selectedVehicle,
    pickupDate = '',
    pickupTime = '',
    dropoffDate = '',
    dropoffTime = '',
    location = '',
  } = route.params ?? {};

  const { balance, deductMoney } = useWallet();
  const { applyPromo, removePromo, appliedPromo, getDiscountAmount } = usePromo();
  const { addresses } = useAddress();

  const defaultAddress = addresses.find(a => a.isDefault);

  const [useWalletBalance, setUseWalletBalance] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Calculations
  const rentalCharges = selectedVehicle?.calculatedPrice || 0;
  const taxes = rentalCharges * 0.28;
  const securityDeposit = 1500; // Fixed for now, match backend
  const subTotal = rentalCharges + taxes;
  const discountAmount = getDiscountAmount(subTotal);
  // Total = Subtotal (Rent+Tax) - Discount + Deposit
  const totalAmount = Math.max(0, subTotal - discountAmount) + securityDeposit;

  const handleApplyPromo = () => {
    if (!promoCodeInput.trim()) {
      Alert.alert('Error', 'Please enter a promo code');
      return;
    }

    const result = applyPromo(promoCodeInput, subTotal);
    if (result.success) {
      Alert.alert('Success', result.message);
      setPromoCodeInput('');
    } else {
      Alert.alert('Invalid Code', result.message);
    }
  };

  const handleRemovePromo = () => {
    removePromo();
    Alert.alert('Removed', 'Promo code removed successfully');
  };

  const handleProceedtoPay = async () => {
    try {
      setLoading(true);

      if (useWalletBalance) {
        if (balance < totalAmount) {
          Alert.alert(
            'Insufficient Balance',
            'Please add money to your wallet or choose another payment method.',
            [
              {
                text: 'Add Money',
                onPress: () => navigation.navigate(ROUTES.ADD_MONEY),
              },
              { text: 'Cancel', style: 'cancel' },
            ]
          );
          setLoading(false);
          return;
        }

        const success = await deductMoney(
          totalAmount,
          `Booking for ${selectedVehicle.name}`
        );
        if (!success) {
          Alert.alert('Payment Failed', 'Could not deduct from wallet.');
          setLoading(false);
          return;
        }

        // Proceed to create booking immediately if wallet used
        const response = await api.post('bookings/create', {
          vehicleId: selectedVehicle._id,
          startDate: pickupDate,
          startTime: pickupTime,
          endDate: dropoffDate,
          endTime: dropoffTime,
          location,
          totalPrice: totalAmount,
          promoCode: appliedPromo?.code,
          discountAmount: discountAmount,
        });

        if (appliedPromo) removePromo();
        navigation.navigate(ROUTES.BOOKCONFIMRAITON, {
          booking: response.data.booking,
        });
      } else {
        // Stripe Flow
        // 1. Create PaymentIntent on Backend
        const intentRes = await api.post('payment/create-payment-intent', {
          amount: totalAmount,
          metadata: {
            vehicleName: selectedVehicle.name,
            pickupDate,
            dropoffDate
          }
        });
        const { clientSecret } = intentRes.data;

        // 2. Initialize Payment Sheet
        const { error: initError } = await initPaymentSheet({
          paymentIntentClientSecret: clientSecret,
          merchantDisplayName: 'Rent Ride',
          defaultBillingDetails: {
            name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
            email: user?.email || '',
            phone: user?.phone || '',
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

        // 4. Payment Success - Confirm on backend and Create Booking
        // In a real app, we'd wait for webhook, but here we can confirm manually for simplicity
        const confirmRes = await api.post('payment/confirm', {
          paymentIntentId: clientSecret.split('_secret')[0], // Extract ID from secret
        });

        if (confirmRes.data.success) {
          const response = await api.post('bookings/create', {
            vehicleId: selectedVehicle._id,
            startDate: pickupDate,
            startTime: pickupTime,
            endDate: dropoffDate,
            endTime: dropoffTime,
            location,
            totalPrice: totalAmount,
            promoCode: appliedPromo?.code,
            discountAmount: discountAmount,
          });

          if (appliedPromo) removePromo();
          Alert.alert('Success', 'Payment Successful! Your booking is confirmed.');
          navigation.navigate(ROUTES.BOOKCONFIMRAITON, {
            booking: response.data.booking,
          });
        } else {
          Alert.alert('Processing Error', "Payment was successful but we couldn't confirm it. Please contact support.");
        }
      }
    } catch (err: any) {
      console.error('Error creating booking:', err);
      Alert.alert('Booking Failed', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1">
        <View className="bg-yellow-400 rounded-b-3xl px-5 pt-4 pb-6">
          <Text className="text-black text-lg font-semibold text-center">
            SUMMARY
          </Text>

          <Image
            resizeMode="contain"
            className="w-full h-40 mt-4"
            source={{ uri: selectedVehicle?.image }}
          />
        </View>
        <View className="bg-white rounded-2xl shadow mx-4 mt-4 p-4">
          <Text className="text-gray-700 text-base font-semibold mb-3">
            Booking Details
          </Text>
          <View className="bg-gray-50 p-3 rounded-lg mb-3">
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row items-center">
                <Text className="text-gray-500 text-sm mr-2">Pickup :</Text>
                <Text className="text-black font-medium">{pickupDate}</Text>
                <Text className="text-black font-medium ml-1">
                  {pickupTime}
                </Text>
              </View>
              <Text className="text-gray-400 text-xs"> 📍</Text>
            </View>
          </View>
          <View className="bg-gray-50 p-3 rounded-lg mb-3">
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row items-center">
                <Text className="text-gray-500 text-sm mr-2">Dropoff :</Text>
                <Text className="text-black font-medium">{dropoffDate}</Text>
                <Text className="text-black font-medium ml-1">
                  {dropoffTime}
                </Text>
              </View>
              <Text className="text-gray-400 text-xs"> 📍</Text>
            </View>
          </View>

          <View className="bg-gray-50 p-3 rounded-lg mb-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-500 text-sm">Location</Text>
              <Text className="text-black font-medium">{location}</Text>
            </View>
          </View>

          <View className="bg-gray-50 p-3 rounded-lg mb-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-500 text-sm">Km Included</Text>
              <Text className="text-black font-medium">
                {selectedVehicle?.calculatedIncludedKm} Km
              </Text>
            </View>
          </View>
          <View className="bg-red-50 rounded-lg p-3">
            <Text className="text-gray-700 text-sm font-medium">Excludes:</Text>
            <Text className="text-red-600 text-sm mt-1">
              Exceeding KM limit is chargeable at Rs 4/Km
            </Text>
            <Text className="text-red-600 text-sm">
              Fuel is not included as part of the booking
            </Text>
          </View>
        </View>

        {/* Offers/Coupons Section */}
        <View className="bg-white rounded-2xl shadow mx-4 mt-4 p-4">
          <Text className="text-black text-lg font-semibold mb-3">
            Offers & Coupons
          </Text>

          {appliedPromo ? (
            <View className="bg-green-50 border border-green-200 rounded-lg p-3 flex-row justify-between items-center">
              <View className="flex-row items-center flex-1">
                <Tag size={20} color="#16a34a" />
                <View className="ml-2">
                  <Text className="text-green-700 font-bold">{appliedPromo.code}</Text>
                  <Text className="text-green-600 text-xs">
                    Saved ₹{discountAmount.toFixed(2)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleRemovePromo} className="p-1">
                <X size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-row items-center gap-2">
              <TextInput
                value={promoCodeInput}
                onChangeText={setPromoCodeInput}
                placeholder="Enter Promo Code"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black"
                autoCapitalize="characters"
              />
              <TouchableOpacity
                onPress={handleApplyPromo}
                className="bg-gray-900 px-4 py-2.5 rounded-lg"
              >
                <Text className="text-white font-medium">Apply</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.PROMO_CODES)}
            className="mt-3 bg-yellow-50 py-2 rounded-lg border border-yellow-100"
          >
            <Text className="text-yellow-700 text-center text-sm font-medium">
              View Available Coupons
            </Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-2xl shadow mx-4 mt-4 p-4">
          <Text className="text-black text-lg font-semibold">Addons</Text>

          <TouchableOpacity className="flex-row justify-between items-center mt-2 border border-gray-300 rounded-lg px-3 py-2">
            <Text className="text-blue-500">Customize your ride</Text>
            <Text className="text-black">+</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-2xl shadow mx-4 mt-4 p-4">
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-600">Rental Charges</Text>
            <Text className="text-black">
              ₹{rentalCharges.toFixed(2)}
            </Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-600">Taxes & Fees</Text>
            <Text className="text-black">
              ₹{taxes.toFixed(2)}
            </Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-600">Security Deposit (Refundable)</Text>
            <Text className="text-black">
              ₹{securityDeposit.toFixed(2)}
            </Text>
          </View>

          {appliedPromo && (
            <View className="flex-row justify-between mb-1">
              <Text className="text-green-600">Coupon Discount</Text>
              <Text className="text-green-600">
                - ₹{discountAmount.toFixed(2)}
              </Text>
            </View>
          )}

          <View className="border-b border-gray-200 my-2" />

          <View className="flex-row justify-between">
            <Text className="text-black font-bold text-lg">
              Total Payable
            </Text>
            <Text className="text-black font-bold text-lg">
              ₹{totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>

        <View className="bg-white rounded-2xl shadow mx-4 mt-4 p-4">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <Wallet size={20} color="#fbbf24" />
              <Text className="text-black font-semibold ml-2">RB Wallet</Text>
            </View>
            <Text className="text-gray-600">Balance: ₹{balance.toFixed(2)}</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-700">Pay from Wallet</Text>
            <Switch
              value={useWalletBalance}
              onValueChange={setUseWalletBalance}
              trackColor={{ false: '#d1d5db', true: '#facc15' }}
              thumbColor={useWalletBalance ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </View>

        <View className="h-4" />

        <View className="bg-white rounded-2xl shadow mx-4 mt-4 p-4">
          <Text className="text-black text-lg font-semibold mb-3">
            Pick-up Address
          </Text>
          {defaultAddress ? (
            <View className="flex-row items-start bg-gray-50 p-3 rounded-xl border border-gray-100">
              <View className="bg-yellow-100 p-2 rounded-full mr-3">
                <MapPinIcon size={18} color="#854d0e" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold mb-0.5">{defaultAddress.label}</Text>
                <Text className="text-gray-600 text-xs leading-4">
                  {defaultAddress.line1}, {defaultAddress.city}
                </Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate(ROUTES.SAVED_ADDRESSES)}>
                <Text className="text-blue-600 text-xs font-bold">CHANGE</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.SAVED_ADDRESSES)}
              className="flex-row justify-between items-center bg-gray-50 border border-gray-200 border-dashed rounded-xl p-3"
            >
              <Text className="text-gray-500 text-sm">No default address set</Text>
              <Text className="text-blue-600 text-xs font-bold">ADD ADDRESS</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          onPress={handleProceedtoPay}
          disabled={loading}
          className="rounded-xl mx-4 mt-4 mb-8 p-4 shadow-md bg-yellow-400"
        >
          <Text className="text-black text-center font-bold text-lg">
            PROCEED TO PAY ₹{totalAmount.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView >
  );
};

export default RideConfirmationScreen;

const styles = StyleSheet.create({});
