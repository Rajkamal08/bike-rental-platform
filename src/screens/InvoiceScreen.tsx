import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React from 'react';
import {
  useRoute,
  RouteProp,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Download,
  Share2,
  CheckCircle,
  Calendar,
  MapPin,
  Clock,
  User,
  Phone,
  Mail,
} from 'lucide-react-native';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import api, { getImageUrl } from '../utils/api';

dayjs.extend(customParseFormat);

type RootStackParamList = {
  Invoice: {
    booking: any;
  };
};

type InvoiceRouteProp = RouteProp<RootStackParamList, 'Invoice'>;
type InvoiceNavigationProp = NavigationProp<RootStackParamList>;

const InvoiceScreen = () => {
  const route = useRoute<InvoiceRouteProp>();
  const navigation = useNavigation<InvoiceNavigationProp>();
  const { booking } = route.params;

  const safeBooking = booking || {};
  const vehicle = safeBooking.vehicleId || {};

  // Date formatting
  const createdAt = safeBooking.createdAt
    ? new Date(safeBooking.createdAt)
    : new Date();
  const startDate = safeBooking.startDate
    ? new Date(safeBooking.startDate)
    : new Date();
  const endDate = safeBooking.endDate
    ? new Date(safeBooking.endDate)
    : new Date();

  // Calculate rental duration in days
  const durationDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Price calculations
  const totalPrice = safeBooking.totalPrice || 0;

  // Check if booking can be cancelled (before end time)
  const isCompletedBooking = (endDateStr: string, endTimeStr: string) => {
    if (!endDateStr || !endTimeStr) return false;
    const bookingEndDateTime = dayjs(
      `${dayjs(endDateStr).format('YYYY-MM-DD')} ${endTimeStr}`,
      'YYYY-MM-DD hh:mm A',
    );
    const now = dayjs();
    return bookingEndDateTime.isBefore(now);
  };

  const canCancel =
    (safeBooking.status === 'confirmed' || safeBooking.status === 'pending') &&
    !isCompletedBooking(safeBooking.endDate, safeBooking.endTime);

  const handleCancelBooking = async () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.patch(`bookings/${safeBooking._id}/cancel`, {});
              Alert.alert('Success', 'Booking cancelled successfully', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (err: any) {
              Alert.alert(
                'Error',
                err.response?.data?.error || 'Failed to cancel booking',
              );
            }
          },
        },
      ],
    );
  };
  const taxRate = 0.18; // 18% GST
  const subtotal = totalPrice / (1 + taxRate);
  const taxAmount = totalPrice - subtotal;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    return time || 'N/A';
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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

  const handleShare = () => {
    // TODO: Implement share functionality
    Alert.alert(
      'Share Invoice',
      'Share functionality will be implemented soon!',
    );
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
    Alert.alert(
      'Download Invoice',
      'Download functionality will be implemented soon!',
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-yellow-400 px-6 py-8 rounded-b-3xl">
          <View className="items-center mb-4">
            <View className="bg-white rounded-full p-2 mb-3 overflow-hidden shadow-sm">
              <Image
                source={require('../../assets/images/app_logo.png')}
                className="w-16 h-16"
                resizeMode="contain"
              />
            </View>
            <Text className="text-3xl font-bold text-white">INVOICE</Text>
            <Text className="text-white text-sm mt-1">
              Invoice #{safeBooking._id?.slice(-8).toUpperCase()}
            </Text>
          </View>

          {/* Status Badge */}
          <View className="items-center">
            <View
              className={`px-4 py-2 rounded-full ${getStatusColor(safeBooking.status)}`}
            >
              <Text className="font-semibold uppercase text-xs">
                {safeBooking.status || 'PENDING'}
              </Text>
            </View>
          </View>
        </View>

        <View className="px-4 pt-6">
          {/* Booking Date */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-gray-500 text-sm mb-1">Booking Date</Text>
            <Text className="text-gray-900 font-semibold text-base">
              {formatDate(createdAt)}
            </Text>
          </View>

          {/* Customer Details */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Customer Details
            </Text>

            <View className="flex-row items-center mb-2">
              <User size={16} color="#6b7280" />
              <Text className="text-gray-700 ml-2">
                {safeBooking.userId?.firstName || 'N/A'}{' '}
                {safeBooking.userId?.lastName || ''}
              </Text>
            </View>

            <View className="flex-row items-center mb-2">
              <Phone size={16} color="#6b7280" />
              <Text className="text-gray-700 ml-2">
                {safeBooking.userId?.phone || 'N/A'}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Mail size={16} color="#6b7280" />
              <Text className="text-gray-700 ml-2">
                {safeBooking.userId?.email || 'N/A'}
              </Text>
            </View>
          </View>

          {/* Vehicle Details */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Vehicle Details
            </Text>

            {vehicle.imageUrl || vehicle.image ? (
              <Image
                source={{ uri: getImageUrl(vehicle.imageUrl || vehicle.image) }}
                resizeMode="contain"
                className="w-full h-40 rounded-lg mb-3 bg-gray-50"
              />
            ) : null}

            <Text className="text-xl font-bold text-gray-900">
              {vehicle.name || 'Vehicle'}
            </Text>
            <Text className="text-gray-600 text-sm">
              {vehicle.type || 'Two Wheeler'}
            </Text>
          </View>

          {/* Rental Period */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Rental Period
            </Text>

            {/* Pickup */}
            <View className="mb-3">
              <Text className="text-gray-500 text-xs mb-1">PICKUP</Text>
              <View className="flex-row items-center mb-1">
                <Calendar size={16} color="#6b7280" />
                <Text className="text-gray-900 ml-2 font-medium">
                  {formatDate(startDate)}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Clock size={16} color="#6b7280" />
                <Text className="text-gray-700 ml-2">
                  {formatTime(safeBooking.startTime)}
                </Text>
              </View>
            </View>

            {/* Return */}
            <View className="mb-3">
              <Text className="text-gray-500 text-xs mb-1">RETURN</Text>
              <View className="flex-row items-center mb-1">
                <Calendar size={16} color="#6b7280" />
                <Text className="text-gray-900 ml-2 font-medium">
                  {formatDate(endDate)}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Clock size={16} color="#6b7280" />
                <Text className="text-gray-700 ml-2">
                  {formatTime(safeBooking.endTime)}
                </Text>
              </View>
            </View>

            {/* Duration */}
            <View className="bg-yellow-50 p-3 rounded-lg mb-3">
              <Text className="text-yellow-900 font-semibold">
                Duration: {durationDays} {durationDays === 1 ? 'Day' : 'Days'}
              </Text>
            </View>

            {/* Location */}
            <View className="flex-row items-center">
              <MapPin size={16} color="#6b7280" />
              <Text className="text-gray-700 ml-2">
                {safeBooking.location || 'N/A'}
              </Text>
            </View>
          </View>

          {/* Price Breakdown */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Price Breakdown
            </Text>

            <View className="space-y-2">
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">
                  Rental ({durationDays} {durationDays === 1 ? 'day' : 'days'})
                </Text>
                <Text className="text-gray-900">₹{subtotal.toFixed(2)}</Text>
              </View>

              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">GST (18%)</Text>
                <Text className="text-gray-900">₹{taxAmount.toFixed(2)}</Text>
              </View>

              <View className="border-t border-gray-200 pt-3 mt-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-lg font-bold text-gray-900">
                    Total Amount
                  </Text>
                  <Text className="text-2xl font-bold text-yellow-600">
                    ₹{totalPrice.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Payment Information */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Payment Information
            </Text>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Payment Method</Text>
              <Text className="text-gray-900 font-medium">
                {safeBooking.paymentMethod || 'Online Payment'}
              </Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Transaction ID</Text>
              <Text className="text-gray-900 font-medium">
                {safeBooking.transactionId || 'N/A'}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-600">Payment Status</Text>
              <Text className="text-green-600 font-semibold">
                {safeBooking.paymentStatus || 'Completed'}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3 mb-4">
            <TouchableOpacity
              onPress={handleShare}
              className="flex-1 bg-blue-500 py-4 rounded-xl flex-row items-center justify-center"
            >
              <Share2 size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDownload}
              className="flex-1 bg-green-500 py-4 rounded-xl flex-row items-center justify-center"
            >
              <Download size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Download</Text>
            </TouchableOpacity>
          </View>

          {/* Cancel Booking Button */}
          {canCancel && (
            <TouchableOpacity
              onPress={handleCancelBooking}
              className="bg-red-500 py-4 rounded-xl mb-4"
            >
              <Text className="text-white font-bold text-center text-lg">
                Cancel Booking
              </Text>
            </TouchableOpacity>
          )}

          {/* Footer */}
          <View className="bg-gray-100 rounded-xl p-4 mb-6">
            <Text className="text-gray-600 text-xs text-center mb-2">
              Thank you for choosing our service!
            </Text>
            <Text className="text-gray-500 text-xs text-center">
              For support, contact us at support@rentbike.com
            </Text>
            <Text className="text-gray-500 text-xs text-center mt-1">
              📞 +91 1800-123-4567
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InvoiceScreen;

const styles = StyleSheet.create({});
