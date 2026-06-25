import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Calendar,
  Clock,
  Check,
  ChevronRight,
  Wallet,
  MapPin,
  Star,
  Shield,
  Wrench,
  Phone,
  X,
} from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import { useWallet } from '../contexts/WalletContext';
import { useAddress } from '../contexts/AddressContext';
import { useNavigation } from '@react-navigation/native';
import ROUTES from '../navigation/routes/Routes';

interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  color: string;
  benefits: string[];
  popular?: boolean;
}

interface Vehicle {
  id: string;
  name: string;
  image: any;
  basePrice: number;
}

const SubscriptionScreen = () => {
  const navigation = useNavigation<any>();
  const { balance } = useWallet();
  const { addresses } = useAddress();

  const [duration, setDuration] = useState(3);
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('activa');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const def = addresses.find(a => a.isDefault) || addresses[0];
      setSelectedAddress(def);
    }
  }, [addresses]);

  const plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      monthlyPrice: 2999,
      color: '#9ca3af',
      benefits: ['100 km/day limit', 'Basic maintenance', 'Email support'],
    },
    {
      id: 'premium',
      name: 'Premium',
      monthlyPrice: 3999,
      color: '#fbbf24',
      benefits: [
        'Unlimited km',
        'Free maintenance',
        '24/7 support',
        'Free doorstep delivery',
      ],
      popular: true,
    },
    {
      id: 'vip',
      name: 'VIP',
      monthlyPrice: 5499,
      color: '#a855f7',
      benefits: [
        'Unlimited km',
        'Premium maintenance',
        'Priority support',
        'Free doorstep delivery',
        'Insurance included',
        'Free helmet & accessories',
      ],
    },
  ];

  const vehicles: Vehicle[] = [
    {
      id: 'activa',
      name: 'Honda Activa 6G',
      image: require('../../assets/images/icon.jpg'),
      basePrice: 0,
    },
    {
      id: 'jupiter',
      name: 'TVS Jupiter',
      image: require('../../assets/images/icon.jpg'),
      basePrice: 200,
    },
    {
      id: 'access',
      name: 'Suzuki Access 125',
      image: require('../../assets/images/icon.jpg'),
      basePrice: 300,
    },
  ];

  const calculatePrice = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    const basePrice = (plan?.monthlyPrice || 0) + (vehicle?.basePrice || 0);
    const discount = duration >= 6 ? 0.1 : duration >= 3 ? 0.05 : 0;
    const subtotal = basePrice * duration;
    const discountAmount = subtotal * discount;
    const total = subtotal - discountAmount;

    return { subtotal, discountAmount, total, monthlyPrice: basePrice };
  };

  const handleSubscribe = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Missing Information', 'Please select date and time.');
      return;
    }
    if (!selectedAddress) {
      Alert.alert('Missing Address', 'Please select a delivery address.');
      return;
    }

    const { total } = calculatePrice();
    Alert.alert(
      'Subscription Confirmation',
      `Total: ₹${total.toFixed(0)}\\n\\nProceed to payment?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay Now',
          onPress: () => {
            Alert.alert('Success', 'Subscription activated successfully!');
          },
        },
      ]
    );
  };

  const pricing = calculatePrice();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white p-4 border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            <Image
              source={require('../../assets/images/log.jpg')}
              className="w-24 h-10"
              resizeMode="contain"
            />
            <Text className="text-xs font-semibold text-gray-700">
              Monthly Rental Subscription
            </Text>
          </View>
        </View>

        {/* Hero Image */}
        <View className="relative">
          <Image
            source={vehicles.find(v => v.id === selectedVehicle)?.image}
            className="w-full h-48"
            resizeMode="cover"
          />
          <View className="absolute bottom-3 right-4 bg-yellow-400 px-3 py-2 rounded-lg flex-row items-center">
            <Star size={16} color="black" fill="black" />
            <Text className="ml-1 text-black font-bold text-xs">
              DOORSTEP DELIVERY
            </Text>
          </View>
        </View>

        <View className="p-4">
          {/* Title */}
          <Text className="text-2xl font-bold text-center mb-2">
            Start Your Subscription
          </Text>
          <Text className="text-gray-500 text-center mb-6">
            Choose your plan and enjoy hassle-free riding
          </Text>

          {/* Subscription Plans */}
          <Text className="text-lg font-bold mb-3">Choose Your Plan</Text>
          <View className="flex-row gap-3 mb-6">
            {plans.map(plan => (
              <TouchableOpacity
                key={plan.id}
                onPress={() => setSelectedPlan(plan.id)}
                className={`flex-1 rounded-xl p-3 border-2 ${selectedPlan === plan.id
                  ? 'border-yellow-400 bg-yellow-50'
                  : 'border-gray-200 bg-white'
                  }`}
              >
                {plan.popular && (
                  <View className="absolute -top-2 right-2 bg-yellow-400 px-2 py-1 rounded-full">
                    <Text className="text-xs font-bold text-black">
                      POPULAR
                    </Text>
                  </View>
                )}
                <Text className="font-bold text-gray-900 mb-1">
                  {plan.name}
                </Text>
                <Text className="text-xl font-bold text-gray-900">
                  ₹{plan.monthlyPrice}
                </Text>
                <Text className="text-xs text-gray-500">/month</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Benefits */}
          <View className="bg-white rounded-xl p-4 mb-6 border border-gray-100">
            <Text className="font-bold mb-3 text-gray-900">
              Plan Benefits
            </Text>
            {plans
              .find(p => p.id === selectedPlan)
              ?.benefits.map((benefit, index) => (
                <View key={index} className="flex-row items-center mb-2">
                  <Check size={16} color="#22c55e" />
                  <Text className="ml-2 text-gray-700 text-sm">{benefit}</Text>
                </View>
              ))}
          </View>

          {/* Vehicle Selection */}
          <Text className="text-lg font-bold mb-3">Select Vehicle</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {vehicles.map(vehicle => (
              <TouchableOpacity
                key={vehicle.id}
                onPress={() => setSelectedVehicle(vehicle.id)}
                className={`mr-3 rounded-xl p-3 border-2 w-40 ${selectedVehicle === vehicle.id
                  ? 'border-yellow-400 bg-yellow-50'
                  : 'border-gray-200 bg-white'
                  }`}
              >
                <Image
                  source={vehicle.image}
                  className="w-full h-20 mb-2"
                  resizeMode="contain"
                />
                <Text className="font-semibold text-gray-900 text-sm">
                  {vehicle.name}
                </Text>
                {vehicle.basePrice > 0 && (
                  <Text className="text-xs text-gray-500">
                    +₹{vehicle.basePrice}/mo
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Date & Time */}
          <Text className="text-lg font-bold mb-3 mt-6">
            Delivery Schedule
          </Text>
          <View className="flex-row gap-3 mb-6">
            <TouchableOpacity
              onPress={() => setSelectedDate('2025-12-10')}
              className="flex-1 flex-row items-center bg-white border border-gray-200 rounded-xl px-3 py-3"
            >
              <Calendar size={18} color="gray" />
              <Text className="ml-2 font-medium text-gray-700">
                {selectedDate || 'Select Date'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedTime('10:00 AM')}
              className="flex-1 flex-row items-center bg-white border border-gray-200 rounded-xl px-3 py-3"
            >
              <Clock size={18} color="gray" />
              <Text className="ml-2 font-medium text-gray-700">
                {selectedTime || 'Select Time'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Duration Slider */}
          <Text className="text-lg font-bold mb-3">Subscription Duration</Text>
          <View className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-2xl font-bold text-gray-900">
                {duration} {duration === 1 ? 'month' : 'months'}
              </Text>
              {duration >= 3 && (
                <View className="bg-green-100 px-2 py-1 rounded-lg">
                  <Text className="text-green-700 font-bold text-xs">
                    {duration >= 6 ? '10% OFF' : '5% OFF'}
                  </Text>
                </View>
              )}
            </View>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={1}
              maximumValue={12}
              step={1}
              value={duration}
              minimumTrackTintColor="#facc15"
              maximumTrackTintColor="#e5e7eb"
              thumbTintColor="#fbbf24"
              onValueChange={value => setDuration(value)}
            />
            <View className="flex-row justify-between">
              <Text className="text-xs text-gray-500">1 month</Text>
              <Text className="text-xs text-gray-500">12 months</Text>
            </View>
          </View>

          {/* Delivery Address */}
          <Text className="text-lg font-bold mb-3">Delivery Address</Text>
          <TouchableOpacity
            onPress={() => setShowAddressModal(true)}
            className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex-row items-center justify-between"
          >
            <View className="flex-row items-center flex-1">
              <MapPin size={20} color="#6b7280" />
              <View className="ml-3 flex-1">
                <Text className="font-semibold text-gray-900">
                  {selectedAddress?.label || 'Select Address'}
                </Text>
                {selectedAddress && (
                  <Text className="text-sm text-gray-500" numberOfLines={1}>
                    {selectedAddress.line1}, {selectedAddress.city}
                  </Text>
                )}
              </View>
            </View>
            <ChevronRight size={20} color="#9ca3af" />
          </TouchableOpacity>

          {/* Wallet Balance */}
          <View className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-4 mb-6 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Wallet size={24} color="black" />
              <View className="ml-3">
                <Text className="text-xs text-gray-800">Wallet Balance</Text>
                <Text className="text-xl font-bold text-black">
                  ₹{balance.toFixed(0)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.ADD_MONEY)}
              className="bg-black px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-bold text-sm">Add Money</Text>
            </TouchableOpacity>
          </View>

          {/* Price Breakdown */}
          <View className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
            <Text className="font-bold mb-3 text-gray-900">
              Price Breakdown
            </Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">
                {duration} months × ₹{pricing.monthlyPrice}
              </Text>
              <Text className="font-semibold text-gray-900">
                ₹{pricing.subtotal.toFixed(0)}
              </Text>
            </View>
            {pricing.discountAmount > 0 && (
              <View className="flex-row justify-between mb-2">
                <Text className="text-green-600">Discount</Text>
                <Text className="font-semibold text-green-600">
                  -₹{pricing.discountAmount.toFixed(0)}
                </Text>
              </View>
            )}
            <View className="border-t border-gray-200 pt-2 mt-2">
              <View className="flex-row justify-between">
                <Text className="font-bold text-lg text-gray-900">Total</Text>
                <Text className="font-bold text-xl text-gray-900">
                  ₹{pricing.total.toFixed(0)}
                </Text>
              </View>
            </View>
          </View>

          {/* Subscribe Button */}
          <TouchableOpacity
            onPress={handleSubscribe}
            className="bg-yellow-400 py-4 rounded-xl items-center shadow-lg"
          >
            <Text className="font-bold text-black text-lg">
              Subscribe Now
            </Text>
          </TouchableOpacity>

          {/* Trust Badges */}
          <View className="flex-row justify-around mt-6 mb-4">
            <View className="items-center">
              <Shield size={24} color="#22c55e" />
              <Text className="text-xs text-gray-600 mt-1">Insured</Text>
            </View>
            <View className="items-center">
              <Wrench size={24} color="#3b82f6" />
              <Text className="text-xs text-gray-600 mt-1">Maintained</Text>
            </View>
            <View className="items-center">
              <Phone size={24} color="#f59e0b" />
              <Text className="text-xs text-gray-600 mt-1">24/7 Support</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Address Selection Modal */}
      <Modal
        visible={showAddressModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddressModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-96">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">Select Address</Text>
              <TouchableOpacity onPress={() => setShowAddressModal(false)}>
                <X size={24} color="black" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {addresses.map(address => (
                <TouchableOpacity
                  key={address._id}
                  onPress={() => {
                    setSelectedAddress(address);
                    setShowAddressModal(false);
                  }}
                  className="bg-gray-50 p-4 rounded-xl mb-3 border border-gray-200"
                >
                  <Text className="font-bold text-gray-900 mb-1">
                    {address.label}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {address.line1}, {address.city}, {address.state}{' '}
                    {address.pincode}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={() => {
                  setShowAddressModal(false);
                  navigation.navigate(ROUTES.ADD_EDIT_ADDRESS);
                }}
                className="bg-yellow-400 p-4 rounded-xl items-center"
              >
                <Text className="font-bold text-black">Add New Address</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({});
