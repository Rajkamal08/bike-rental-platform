import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import api, { getImageUrl } from '../utils/api';

import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CheckCheck,
  Calendar,
  MapPin,
  Clock,
  Star,
  Zap,
} from 'lucide-react-native';
import ROUTES from '../navigation/routes/Routes';

interface Vehicle {
  _id: string;
  name?: string;
  image: string;
}

interface Booking {
  _id: string;
  vehicleId?: Vehicle;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled' | string;
}

const BookingsScreen = () => {
  const { token } = useAuth();
  const navigation = useNavigation<NavigationProp<any>>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const response = await api.get('bookings/user');

      console.log('Bookings fetched:', response.data);
      if (Array.isArray(response.data)) {
        setBookings(response.data);
      } else {
        setBookings([]);
      }
      setError(null);
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isPastBooking = (startDate: string, startTime: string) => {
    if (!startDate || !startTime) return true;

    const dayjs = require('dayjs');
    const customParseFormat = require('dayjs/plugin/customParseFormat');
    dayjs.extend(customParseFormat);

    const bookingDateTime = dayjs(
      `${dayjs(startDate).format('YYYY-MM-DD')} ${startTime}`,
      'YYYY-MM-DD hh:mm A',
    );
    const now = dayjs();

    return bookingDateTime.isBefore(now);
  };

  const isCompletedBooking = (endDate: string, endTime: string) => {
    if (!endDate || !endTime) return false;

    const dayjs = require('dayjs');
    const customParseFormat = require('dayjs/plugin/customParseFormat');
    dayjs.extend(customParseFormat);

    const bookingEndDateTime = dayjs(
      `${dayjs(endDate).format('YYYY-MM-DD')} ${endTime}`,
      'YYYY-MM-DD hh:mm A',
    );
    const now = dayjs();

    return bookingEndDateTime.isBefore(now);
  };

  const canCancelBooking = (booking: Booking) => {
    return (
      (booking.status === 'confirmed' || booking.status === 'pending') &&
      !isCompletedBooking(booking.endDate, booking.endTime)
    );
  };

  const handleCancelBooking = async (bookingId: string) => {
    Alert.alert(
      'Cancel Booking',
      'Cancellation Policy: Free cancellation up to 24 hours before pickup.\n\nAre you sure you want to cancel this booking?',
      [
        {
          text: 'Go Back',
          style: 'cancel',
        },
        {
          text: 'Cancel Booking',
          style: 'destructive',
          onPress: async () => {
            setCancellingId(bookingId);
            try {
              await api.patch(`bookings/${bookingId}/cancel`, {});

              // Refresh bookings after successful cancellation
              await fetchBookings();

              Alert.alert('Success', 'Booking cancelled successfully');
            } catch (err: any) {
              console.error('Error cancelling booking:', err);
              Alert.alert(
                'Error',
                err.response?.data?.error ||
                  'Failed to cancel booking. Please try again.',
              );
            } finally {
              setCancellingId(null);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-center bg-yellow-500 py-6 rounded-b-3xl">
        <Text className="text-3xl font-extrabold text-white">My Bookings</Text>
        <CheckCheck size={26} color="white" className="ml-3" />
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#fbbf24']}
            tintColor="#fbbf24"
          />
        }
      >
        {loading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#fbbf24" />
            <Text className="text-gray-500 mt-4">Loading your bookings...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-red-500 text-lg font-semibold">Error</Text>
            <Text className="text-gray-600 mt-2">{error}</Text>
          </View>
        ) : bookings.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <View className="bg-yellow-100 rounded-full p-6 mb-4">
              <CheckCheck size={64} color="#fbbf24" />
            </View>
            <Text className="text-gray-700 text-xl font-bold mb-2">
              No Bookings Yet
            </Text>
            <Text className="text-gray-500 text-center px-8 mb-6">
              Start your journey! Book your first ride and explore the city.
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}
              className="bg-yellow-400 px-8 py-3 rounded-xl"
            >
              <Text className="text-black font-semibold text-base">
                Browse Bikes
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          bookings.map((booking, index) => {
            const isCancelled = booking.status === 'cancelled';
            const canCancel =
              (booking.status === 'confirmed' ||
                booking.status === 'pending') &&
              !isPastBooking(booking.startDate, booking.startTime);

            return (
              <View
                key={booking._id || index}
                className={`bg-white rounded-2xl mb-4 overflow-hidden shadow-md ${isCancelled ? 'opacity-50' : ''}`}
              >
                {/* Vehicle Image */}
                {booking?.vehicleId?.image ? (
                  <Image
                    resizeMode="contain"
                    className="w-full h-48 bg-gray-100"
                    source={{ uri: getImageUrl(booking.vehicleId.image) }}
                    onError={e => {
                      console.log(
                        'Image load error for:',
                        booking?.vehicleId?.image,
                      );
                      console.log('Error details:', e.nativeEvent.error);
                    }}
                  />
                ) : (
                  <View className="w-full h-48 bg-gray-200 items-center justify-center">
                    <Text className="text-gray-400">No image available</Text>
                  </View>
                )}

                {/* Booking Details */}
                <View className="p-4">
                  {/* Vehicle Name & Status */}
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-xl font-bold text-gray-900">
                      {booking?.vehicleId?.name || 'Vehicle'}
                    </Text>
                    <View
                      className={`px-3 py-1 rounded-full ${getStatusColor(booking.status)}`}
                    >
                      <Text className="text-xs font-semibold uppercase">
                        {booking.status}
                      </Text>
                    </View>
                  </View>

                  {/* Date & Time */}
                  <View className="flex-row items-center mb-2">
                    <Calendar size={16} color="#6b7280" />
                    <Text className="text-gray-600 ml-2">
                      {formatDate(booking.startDate)} -{' '}
                      {formatDate(booking.endDate)}
                    </Text>
                  </View>

                  <View className="flex-row items-center mb-2">
                    <Clock size={16} color="#6b7280" />
                    <Text className="text-gray-600 ml-2">
                      {booking.startTime} - {booking.endTime}
                    </Text>
                  </View>

                  {/* Location */}
                  <View className="flex-row items-center mb-3">
                    <MapPin size={16} color="#6b7280" />
                    <Text className="text-gray-600 ml-2">
                      {booking.location}
                    </Text>
                  </View>

                  {/* Price */}
                  <View className="border-t border-gray-200 pt-3 mt-2">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-gray-600">Total Amount</Text>
                      <Text className="text-2xl font-bold text-gray-900">
                        ₹{booking.totalPrice}
                      </Text>
                    </View>

                    {/* Cancel Button */}
                    {canCancel && (
                      <TouchableOpacity
                        onPress={() => handleCancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                        className={`mt-3 bg-red-500 py-3 rounded-xl ${cancellingId === booking._id ? 'opacity-50' : ''}`}
                      >
                        {cancellingId === booking._id ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text className="text-white text-center font-semibold">
                            Cancel Booking
                          </Text>
                        )}
                      </TouchableOpacity>
                    )}

                    {/* Report Issue Button (Always visible for confirmed/active bookings) */}
                    {(booking.status === 'confirmed' ||
                      booking.status === 'completed') &&
                      !isCancelled && (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate(ROUTES.DAMAGE_REPORT, {
                              bookingId: booking._id,
                              vehicleName: booking.vehicleId?.name,
                            })
                          }
                          className="mt-3 border border-red-200 bg-red-50 py-3 rounded-xl flex-row justify-center items-center"
                        >
                          <Text className="text-red-700 font-semibold">
                            Report Issue / Damage
                          </Text>
                        </TouchableOpacity>
                      )}

                    {/* Extend Booking Button (Active/Confirmed Only) */}
                    {booking.status === 'confirmed' &&
                      !isCompletedBooking(booking.endDate, booking.endTime) && (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate(ROUTES.EXTEND_BOOKING, {
                              booking,
                            })
                          }
                          className="mt-3 bg-blue-600 py-3 rounded-xl flex-row justify-center items-center"
                        >
                          <Zap size={18} color="white" className="mr-2" />
                          <Text className="text-white text-center font-bold ml-2">
                            Extend Ride
                          </Text>
                        </TouchableOpacity>
                      )}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingsScreen;

const styles = StyleSheet.create({});
