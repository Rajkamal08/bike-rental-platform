import {
  ScrollView,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/routes/types';
import dayjs from 'dayjs';
import { Calendar } from 'react-native-calendars';
import ROUTES from '../navigation/routes/Routes';

import TouchableScale from '../components/TouchableScale';
import { MapPin, Tag, ChevronDown, Calendar as CalendarIcon, Clock } from 'lucide-react-native';

const HomeScreen = () => {
  const [pickupDate, setPickupDate] = useState<string | null>(null);
  const [pickupTime, setPickupTime] = useState<string | null>(null);
  const [dropoffDate, setDropoffDate] = useState<string | null>(null);
  const [dropoffTime, setDropoffTime] = useState<string | null>(null);

  const [showPickupDate, setShowPickupDate] = useState(false);
  const [showPickupTime, setShowPickupTime] = useState(false);
  const [showDropoffDate, setShowDropoffDate] = useState(false);
  const [showDropoffTime, setShowDropoffTime] = useState(false);
  const [showOffersModal, setShowOffersModal] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const generateTimeSlots = (selectedDate: string | null) => {
    const times: string[] = [];

    // generate 12AM → 11:30PM slots
    let start = dayjs().startOf('day');
    const end = dayjs().endOf('day');

    while (start.isBefore(end)) {
      times.push(start.format('hh:mm A'));
      start = start.add(30, 'minute');
    }

    if (!selectedDate) return times;

    const selected = dayjs(selectedDate);
    const now = dayjs();

    // If selected date is today → remove past time
    if (selected.isSame(now, 'day')) {
      return times.filter(t => {
        const slot = dayjs(t, 'hh:mm A');
        return slot.isAfter(now);
      });
    }

    // If selected date is tomorrow or future → return ALL 12AM-11PM slots
    return times;
  };

  const pickupTimes = generateTimeSlots(pickupDate);
  const dropoffTimes = generateTimeSlots(dropoffDate);

  const handleSearch = () => {
    if (pickupDate && pickupTime && dropoffDate && dropoffTime) {
      navigation.navigate(ROUTES.SEARCH, {
        pickupDate,
        pickupTime,
        dropoffDate,
        dropoffTime,
      });
    } else {
      console.log('Please select all dates and times');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-50 bg-white">
        <View className="flex-row items-center">
          <Image
            source={require('../../assets/images/app_logo.png')}
            className="w-10 h-10 mr-3"
            resizeMode="contain"
          />
          <TouchableOpacity className="flex-row items-center">
            <Text className="text-xl font-extrabold text-gray-900 mr-1.5 tracking-tight">Jharkhand</Text>
            <ChevronDown size={18} color="#94a3b8" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          className="flex-row items-center bg-gray-50 px-4 py-2 rounded-full border border-gray-100"
          onPress={() => setShowOffersModal(true)}
        >
          <Tag size={16} color="#ef4444" />
          <Text className="text-sm font-bold text-gray-900 ml-2">Offers</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View className="px-6 mt-6">
          <Text className="text-3xl font-black mb-4 tracking-tighter text-gray-900">
            Book Now, Ride AnyWhere
          </Text>
          <View className="bg-white rounded-[32px] shadow-2xl shadow-yellow-100 border border-yellow-400/30 p-5">
            <Text className="font-bold text-gray-900 mb-3 ml-1 uppercase tracking-widest text-[10px]">Pick Up Details</Text>
            <View className="flex-row mb-5 gap-3">
              <TouchableOpacity
                onPress={() => {
                  setShowPickupDate(true);
                  setShowPickupTime(false);
                }}
                className=" flex-1 flex-row items-center border border-gray-100 rounded-2xl px-4 py-3.5 bg-gray-50/50"
              >
                <Ionicons name="calendar-outline" size={18} color="#f59e0b" />
                <Text className="ml-2.5 text-sm font-bold text-gray-900">
                  {pickupDate || 'Select Date'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setShowPickupTime(true);
                  setShowPickupDate(false);
                }}
                className=" flex-1 flex-row items-center border border-gray-100 rounded-2xl px-4 py-3.5 bg-gray-50/50"
              >
                <Ionicons name="time-outline" size={18} color="#f59e0b" />
                <Text className="ml-2.5 text-sm font-bold text-gray-900">
                  {pickupTime || 'Select Time'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text className="font-bold text-gray-900 mb-3 ml-1 uppercase tracking-widest text-[10px]">Drop Off Details</Text>
            <View className="flex-row mb-6 gap-3">
              <TouchableOpacity
                onPress={() => {
                  setShowDropoffDate(true);
                  setShowDropoffTime(false);
                }}
                className=" flex-1 flex-row items-center border border-gray-100 rounded-2xl px-4 py-3.5 bg-gray-50/50"
              >
                <Ionicons name="calendar-outline" size={18} color="#f59e0b" />
                <Text className="ml-2.5 text-sm font-bold text-gray-900">
                  {dropoffDate || 'Select Date'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setShowDropoffTime(true);
                  setShowDropoffDate(false);
                }}
                className=" flex-1 flex-row items-center border border-gray-100 rounded-2xl px-4 py-3.5 bg-gray-50/50"
              >
                <Ionicons name="time-outline" size={18} color="#f59e0b" />
                <Text className="ml-2.5 text-sm font-bold text-gray-900">
                  {dropoffTime || 'Select Time'}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableScale
              onPress={handleSearch}
              className="bg-yellow-400 rounded-2xl py-4.5 shadow-xl shadow-yellow-200"
              style={{ elevation: 8 }}
            >
              <Text className="text-center text-black font-black text-lg uppercase tracking-wider">
                Find My Ride
              </Text>
            </TouchableScale>
          </View>
        </View>
        <View className="mt-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate('MainTabs', { screen: 'Subscription' })}
              className="w-48 mr-4 rounded-xl"
            >
              <Image
                source={require('../../assets/images/bike_1.jpg')}
                className="w-48 h-32 rounded-xl"
                resizeMode="cover"
              />
              <Text className="text-center font-semibold mt-2 mb-3 px-1" numberOfLines={1} adjustsFontSizeToFit>
                RBX Subscription
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.SEARCH, {
                pickupDate: dayjs().format('YYYY-MM-DD'),
                pickupTime: '09:00 AM',
                dropoffDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
                dropoffTime: '09:00 AM'
              })}
              className="w-48 mr-4 rounded-xl"
            >
              <Image
                source={require('../../assets/images/bike_2.jpg')}
                className="w-48 h-32 rounded-xl"
                resizeMode="cover"
              />
              <Text className="text-center font-semibold mt-2 mb-3">
                Low Prices
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.SEARCH, {
                pickupDate: dayjs().format('YYYY-MM-DD'),
                pickupTime: '09:00 AM',
                dropoffDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
                dropoffTime: '09:00 AM'
              })}
              className="w-48 mr-4 rounded-xl"
            >
              <Image
                source={require('../../assets/images/bike_3.jpg')}
                className="w-48 h-32 rounded-xl"
                resizeMode="cover"
              />
              <Text className="text-center font-semibold mt-2 mb-3 px-1" numberOfLines={1} adjustsFontSizeToFit>
                Adventures by RB
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <View className="mt-6 px-4">
          <View className="bg-white rounded-xl shadow-md overflow-hidden">
            <Image
              source={require('../../assets/images/Royal_Ride_Banner_Final.jpg')}
              className="w-full h-52"
              resizeMode="cover"
            />
          </View>
        </View>

        <View className="mt-6">
          <View className="flex-row items-center justify-between px-4 mb-3">
            <Text className="text-lg font-bold">Exclusive Offers</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {[1, 2].map((_, index) => (
              <View key={index} className="mr-4 bg-red-50 rounded-xl p-4 border border-red-100 w-64">
                <View className="flex-row items-center mb-2">
                  <View className="bg-red-500 px-2 py-1 rounded text-white">
                    <Text className="text-white font-bold text-xs">LIMITED</Text>
                  </View>
                  <Text className="ml-2 font-bold text-red-600">30% OFF</Text>
                </View>
                <Text className="font-bold text-lg mb-1">Summer Sale</Text>
                <Text className="text-gray-600 text-xs">Get flat 30% off on all weekend rides. Use code: SUMMER30</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View className="mt-6">
          <View className="flex-row items-center justify-between px-4 mb-3">
            <Text className="text-lg font-bold">User's Top Picks</Text>
            <TouchableOpacity onPress={() => navigation.navigate(ROUTES.SEARCH, {
              pickupDate: dayjs().format('YYYY-MM-DD'),
              pickupTime: '09:00 AM',
              dropoffDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
              dropoffTime: '09:00 AM'
            })}>
              <Text className="text-sm font-semibold text-blue-600">
                View All
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          <View className="w-40 bg-white rounded-xl shadow-md">
            <Image
              source={require('../../assets/images/Activa.jpg')}
              className="w-full h-28"
              resizeMode="contain"
            />
            <Text className="text-center font-semibold mt-2 mb-3">
              Honda Active 6g
            </Text>
          </View>

          <View className="w-40 bg-white rounded-xl shadow-md">
            <Image
              source={require('../../assets/images/Royal.jpg')}
              className="w-full h-28"
              resizeMode="contain"
            />
            <Text className="text-center font-semibold mt-2 mb-3">
              Royal Enfield Himayalan
            </Text>
          </View>

          <View className="w-40 bg-white rounded-xl shadow-md">
            <Image
              source={require('../../assets/images/Tvs.jpg')}
              className="w-full h-28"
              resizeMode="contain"
            />
            <Text className="text-center font-semibold mt-2 mb-3">
              TVS Ntorq 125
            </Text>
          </View>
        </ScrollView>
      </ScrollView>

      {/* OFFERS MODAL */}
      <Modal
        visible={showOffersModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowOffersModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <View className="bg-white rounded-t-[40px] px-6 pt-8 pb-10 h-auto max-h-[70%]">
            <View className="flex-row justify-between items-center mb-8 px-2">
              <View>
                <Text className="text-2xl font-black text-gray-900 tracking-tight">Voucher Center</Text>
                <Text className="text-gray-500 font-bold text-sm">Save big on your next ride</Text>
              </View>
              <TouchableOpacity onPress={() => setShowOffersModal(false)} className="bg-gray-100 p-2.5 rounded-full">
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {[1, 2, 3].map((_, index) => (
                <View key={index} className="mb-6 overflow-hidden">
                  <View className="bg-yellow-50 rounded-[32px] border-2 border-dashed border-yellow-300 p-6 flex-row items-center">
                    <View className="flex-1">
                      <View className="flex-row items-center mb-1.5">
                        <View className="bg-red-500 px-2.5 py-1 rounded-lg">
                          <Text className="text-white font-black text-[10px] tracking-widest">OFFER</Text>
                        </View>
                        <Text className="ml-3 font-black text-red-600 text-lg">30% DISCOUNT</Text>
                      </View>
                      <Text className="font-extrabold text-[17px] text-gray-900 mb-1">Summer Weekend {index + 1}</Text>
                      <Text className="text-gray-500 text-xs font-bold">Valid until 30th Jan • Weekend Only</Text>

                      <View className="flex-row items-center mt-5">
                        <View className="bg-white border border-gray-200 border-dashed rounded-xl px-4 py-2 mr-3">
                          <Text className="font-black text-gray-800 text-sm tracking-widest">SUMMER30</Text>
                        </View>
                        <TouchableScale
                          className="bg-black px-5 py-2.5 rounded-xl"
                          onPress={() => {
                            setShowOffersModal(false);
                            Alert.alert('Success', 'Coupon code copied to clipboard!');
                          }}
                        >
                          <Text className="text-white font-black text-xs">COPY</Text>
                        </TouchableScale>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* PICKUP DATE  MODEL */}
      <Modal
        visible={showPickupDate}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowPickupDate(false)}
      >
        {/* changed this line */}
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}
        >
          <View className="bg-white rounded-xl p-4 w-11/12">
            <Calendar
              onDayPress={day => {
                setPickupDate(day.dateString);
                setShowPickupDate(false);
              }}
              markedDates={{
                [pickupDate || '']: {
                  selected: true,
                  selectedColor: '#FFD700',
                },
              }}
            />
          </View>
        </View>
      </Modal>
      {/* DROP OFFDATE  MODEL */}
      <Modal
        visible={showDropoffDate}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowDropoffDate(false)}
      >
        {/* changed this line */}
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}
        >
          <View className="bg-white rounded-xl p-4 w-11/12">
            <Calendar
              onDayPress={day => {
                setDropoffDate(day.dateString);
                setShowDropoffDate(false);
              }}
              markedDates={{
                [dropoffDate || '']: {
                  selected: true,
                  selectedColor: '#FFD700',
                },
              }}
            />
          </View>
        </View>
      </Modal>

      {/* PICK UP TIME MODAL */}
      <Modal
        visible={showPickupTime}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPickupTime(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}
        >
          <View className="bg-white rounded-xl p-4 w-11/12 max-h-80">
            <FlatList
              data={pickupTimes}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setPickupTime(item);
                    setShowPickupTime(false);
                  }}
                  className="px-4 py-3 border-b border-gray-100"
                >
                  <Text className="text-base">{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* DROP OFF TIME MODAL */}
      <Modal
        visible={showDropoffTime}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPickupTime(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}
        >
          <View className="bg-white rounded-xl p-4 w-11/12 max-h-80">
            <FlatList
              data={dropoffTimes}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setDropoffTime(item);
                    setShowDropoffTime(false);
                  }}
                  className="px-4 py-3 border-b border-gray-100"
                >
                  <Text className="text-base">{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
