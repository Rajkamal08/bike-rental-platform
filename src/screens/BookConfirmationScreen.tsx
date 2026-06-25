import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
} from 'react-native';
import React from 'react';
import {
  useNavigation,
  useRoute,
  RouteProp,
  NavigationProp,
} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ConfettiCannon from 'react-native-confetti-cannon';
import { getImageUrl } from '../utils/api';

type RootStackParamList = {
  MainTabs: undefined;
  BookConfirmation: {
    booking: any;
  };
  Invoice: {
    booking: any;
  };
};

type BookConfirmationRouteProp = RouteProp<
  RootStackParamList,
  'BookConfirmation'
>;
type BookConfirmationNavigationProp = NavigationProp<RootStackParamList>;

const BookConfirmationScreen = () => {
  const route = useRoute<BookConfirmationRouteProp>();
  const navigation = useNavigation<BookConfirmationNavigationProp>();
  const { booking } = route.params;

  const safeBooking = booking || {};
  const vehicle = safeBooking.vehicleId || {};

  const createdAt = safeBooking.createdAt
    ? new Date(safeBooking.createdAt)
    : new Date();

  const startDate = safeBooking.startDate
    ? new Date(safeBooking.startDate)
    : new Date();

  const endDate = safeBooking.endDate
    ? new Date(safeBooking.endDate)
    : new Date();



  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-yellow-100 to-white">
      <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} autoStart fadeOut />

      <ScrollView>
        {/* Top Section */}
        <View className="items-center mb-6">
          <Image
            source={{
              uri: 'https://img.icons8.com/color/96/000000/check-circle.png',
            }}
            className="w-24 h-24"
            resizeMode="contain"
          />

          <Text className="text-3xl font-bold text-green-600 mt-4">
            Booking Confirmed !
          </Text>
          <Text className="text-lg text-gray-600 mt-2">
            Your ride is ready to roll !
          </Text>
        </View>

        {/* Booking ID Card */}
        <View className="bg-white rounded-xl shadow-md p-4 mb-4">
          <Text className="text-xl font-semibold text-black mb-2">
            Booking ID: {safeBooking._id}
          </Text>
          <Text className="text-gray-500">
            Booking on: {createdAt.toLocaleDateString()}
          </Text>
        </View>

        {/* Vehicle Details */}
        <View className="bg-white rounded-xl shadow-md p-4 mb-4">
          <Text className="text-lg font-semibold text-black mb-2">
            Vehicle Details
          </Text>

          <Image
            source={{ uri: getImageUrl(vehicle.imageUrl || vehicle.image) }}
            resizeMode="contain"
            className="w-full h-40 rounded-lg mb-4"
          />

          <Text className="text-lg font-bold text-black">{vehicle.name}</Text>

          <Text className="text-gray-500">
            Price: ₹{safeBooking.totalPrice?.toFixed(2)}
          </Text>
        </View>

        {/* Booking Details */}
        <View className="bg-white rounded-xl shadow-md p-4 mb-4">
          <Text className="text-xl font-semibold text-black mb-4">
            Booking Details
          </Text>

          {/* Pickup */}
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Pickup :</Text>
            <Text className="text-black">
              {startDate.toLocaleDateString()} at{' '}
              {safeBooking.startTime || 'N/A'}
            </Text>
          </View>

          {/* Dropoff */}
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Dropoff :</Text>
            <Text className="text-black">
              {endDate.toLocaleDateString()} at {safeBooking.endTime || 'N/A'}
            </Text>
          </View>

          {/* Location  ✅ Added */}
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Location :</Text>
            <Text className="text-black">{safeBooking.location || 'N/A'}</Text>
          </View>

          {/* Status  ✅ Added */}
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Status :</Text>
            <Text className="text-green-600 font-semibold">
              {(safeBooking.status || 'PENDING').toUpperCase()}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Invoice', { booking: safeBooking });
          }}
          className="bg-yellow-400 rounded-xl py-4 mb-4"
        >
          <Text className="text-black text-center font-bold text-lg">
            View Invoice
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('MainTabs')}
          className="bg-blue-500 rounded-xl py-4 mb-8"
        >
          <Text className="text-white text-center font-bold text-lg">
            Back to Home
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookConfirmationScreen;

const styles = StyleSheet.create({});
