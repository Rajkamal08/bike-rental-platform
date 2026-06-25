import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import api, { getImageUrl } from '../utils/api';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/routes/types';
import { Animated } from 'react-native';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image } from 'react-native';
import { Modal } from 'react-native';
import ROUTES from '../navigation/routes/Routes';
import { useRating } from '../contexts/RatingContext';
import { Star } from 'lucide-react-native';
import Skeleton from '../components/Skeleton';
import TouchableScale from '../components/TouchableScale';

interface Vehicle {
  _id: string;
  name: string;
  image?: string;
  locations: string[];
  calculatedPrice: number;
  calculatedIncludedKm: number;
  availability: { [key: string]: boolean };
}

type SearchScreenRouteProp = RouteProp<RootStackParamList, typeof ROUTES.SEARCH>;
const HEADER_EXPANDED_HEIGHT = 200;
const HEADER_COLLAPSED_HEIGHT = 120;

const SearchScreen = () => {
  const scrollY = new Animated.Value(0);
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
    outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
    extrapolate: 'clamp',
  });

  const route = useRoute<SearchScreenRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { getAverageRating } = useRating();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { pickupDate, pickupTime, dropoffDate, dropoffTime } = route.params;

  // ✅ Correct useState syntax
  const [selectedLocations, setSelectedLocations] = useState<{
    [key: string]: string;
  }>({});

  const [dropdownVisible, setDropdownVisible] = useState<string | null>(null);

  const [searchOverlayVisible, setSearchOverlayVisible] =
    useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { width, height } = Dimensions.get('window');

  const formattedPickupDate = pickupDate
    ? dayjs(pickupDate).format(' MMM D, YYYY')
    : 'N/A';
  const formattedDropoffDate = dropoffDate
    ? dayjs(dropoffDate).format('MMM D, YYYY')
    : 'N/A';

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.post(
          'vehicles/search',
          {
            startDate: pickupDate,
            endDate: dropoffDate,
            startTime: pickupTime,
            endTime: dropoffTime,
          },
        );
        const fetchedVehicles: Vehicle[] = response.data;
        setVehicles(fetchedVehicles);
        setFilteredVehicles(fetchedVehicles);

        const initialLocations = fetchedVehicles.reduce(
          (acc: { [key: string]: string }, vehicle: Vehicle) => {
            acc[vehicle._id] = vehicle.locations[0] || '';
            return acc;
          },
          {},
        );
        setSelectedLocations(initialLocations); // ❗ Update state
        setLoading(false);
      } catch (error) {
        console.log('Error fetching vehicles:', error);
        setLoading(false);
      }
    };
    if (pickupDate && dropoffDate && pickupTime && dropoffTime) {
      fetchVehicles(); // Call only when all values exist
    }
  }, [pickupDate, pickupTime, dropoffDate, dropoffTime]);
  console.log('Data', filteredVehicles);

  const isSoldOut = (vehicleId: string, location: string) => {
    const vehicle = vehicles.find((v: Vehicle) => v._id === vehicleId);
    if (!vehicle || !location || !vehicle.availability) return false;
    return !vehicle.availability[location];
  };

  const popularVehicles = vehicles.slice(0, 6); // Example: top 5 vehicles as popular
  const handleVehicleSelect = (model: string) => {
    setSearchQuery(model);
    setFilteredVehicles(
      vehicles.filter((vehicle: Vehicle) => vehicle.name === model),
    );
    setSearchOverlayVisible(false);
  };

  const handleLocationSelect = (vehicleId: string, location: string) => {
    setSelectedLocations(prev => ({
      ...prev,
      [vehicleId]: location,
    }));

    setDropdownVisible(null);
  };

  const renderDropdown = (vehicleId: string, locations: string[]) => (
    <Modal
      transparent={true}
      visible={dropdownVisible === vehicleId}
      animationType="fade"
      onRequestClose={() => setDropdownVisible(null)}
    >
      <TouchableWithoutFeedback onPress={() => setDropdownVisible(null)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableWithoutFeedback>
            <View
              style={{
                backgroundColor: 'white',
                width: width * 0.8,
                maxHeight: height * 0.4,
                borderRadius: 10,
                padding: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <FlatList
                data={locations}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleLocationSelect(vehicleId, item)}
                    style={{
                      padding: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: '#e5e7eb',
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Animated.View>
        <View className="flex-row items-center justify-between mb-4 px-5">
          <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={24}
            color="black"
          />
          <Text className="text-xl font-bold text-black">RENTAL BIKES</Text>
          <Ionicons name="options-outline" size={24} color="black" />
        </View>

        <View className="bg-white rounded-2xl shadow-lg p-4 flex-row items-center border border-gray-100 gap-2">
          <View className="flex-1 pr-2">
            <Text className="text-gray-500 text-sm font-medium mb-1">
              Pickup
            </Text>
            <Text className="text-base font-semibold text-black">
              {formattedPickupDate} <Text>at {pickupTime}</Text>
            </Text>
          </View>

          {/* <View className="w-px bg-gray-200 h-10 my-auto" /> */}

          <View>
            <Text className="text-gray-500 text-sm font-medium mb-1">
              Dropoff
            </Text>
            <Text className="text-base font-semibold text-black">
              {formattedDropoffDate} <Text>at {dropoffTime}</Text>
            </Text>
          </View>
        </View>
      </Animated.View>
      <ScrollView className="px-4">
        {loading ? (
          // Skeleton Loading State
          [1, 2, 3].map((i) => (
            <View key={i} className="bg-white rounded-3xl mb-6 p-5 shadow-sm border border-gray-100">
              <View className="flex-row justify-between mb-4">
                <View>
                  <Skeleton width={120} height={24} />
                  <Skeleton width={100} height={12} style={{ marginTop: 8 }} />
                </View>
                <Skeleton width={60} height={30} borderRadius={15} />
              </View>
              <Skeleton width="100%" height={150} style={{ marginVertical: 10 }} />
              <View className="flex-row justify-between mt-4">
                <Skeleton width={100} height={40} borderRadius={12} />
                <Skeleton width={120} height={50} borderRadius={16} />
              </View>
            </View>
          ))
        ) : filteredVehicles.length > 0 ? (
          filteredVehicles.map((item: Vehicle) => (
            <View
              className="bg-white rounded-3xl mb-6 overflow-hidden border border-gray-100"
              key={item._id}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.08,
                shadowRadius: 20,
                elevation: 10,
              }}
            >
              <View className="flex-row items-center justify-between px-5 pt-5">
                <View>
                  <Text className="text-xl font-extrabold text-gray-900 tracking-tight">{item?.name}</Text>
                  <View className="flex-row items-center mt-1">
                    <View className="bg-blue-50 px-2 py-0.5 rounded-md">
                      <Text className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">
                        {item?.calculatedIncludedKm} KM FREE
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(ROUTES.REVIEWS, {
                      vehicleId: item._id,
                      vehicleName: item.name,
                    })
                  }
                  className="flex-row items-center bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full"
                >
                  <Star size={14} color="#fbbf24" fill="#fbbf24" />
                  <Text className="ml-1.5 font-bold text-gray-900 text-sm">
                    {getAverageRating(item._id) > 0
                      ? getAverageRating(item._id).toFixed(1)
                      : 'New'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="relative py-2">
                <Image
                  className="w-full h-48"
                  resizeMode="contain"
                  source={{ uri: getImageUrl(item.image) }}
                />
              </View>

              <View className="px-5 pb-6">
                <View className="mb-5">
                  <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-[2px] mb-2.5 ml-1">Location</Text>
                  <TouchableOpacity
                    onPress={() => setDropdownVisible(item._id)}
                    className="flex-row items-center justify-between border border-gray-100 rounded-2xl px-4 py-3.5 bg-gray-50/30"
                  >
                    <View className="flex-row items-center">
                      <Ionicons name="location" size={18} color="#f59e0b" />
                      <Text className="text-gray-900 ml-2 text-base font-semibold">
                        {selectedLocations[item._id] || 'Select Pickup Hub'}
                      </Text>
                    </View>
                    <Ionicons name="chevron-down" size={18} color="#cbd5e1" />
                  </TouchableOpacity>
                  {renderDropdown(item._id, item.locations)}
                </View>

                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-[2px] mb-1">Total Pay</Text>
                    <View className="flex-row items-baseline">
                      <Text className="text-3xl font-black text-gray-900">₹{item?.calculatedPrice}</Text>
                      <Text className="text-gray-400 text-xs ml-1 font-bold">/ride</Text>
                    </View>
                  </View>

                  {selectedLocations[item._id] &&
                    isSoldOut(item._id, selectedLocations[item._id]) ? (
                    <View className="bg-red-50 px-6 py-3 rounded-2xl">
                      <Text className="text-red-500 font-black">SOLD OUT</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate(ROUTES.RIDECONFIRMATION, {
                          selectedVehicle: item,
                          pickupDate,
                          pickupTime,
                          dropoffDate,
                          dropoffTime,
                          location: selectedLocations[item._id],
                        })
                      }
                      activeOpacity={0.8}
                      className={`bg-yellow-400 px-8 py-4 rounded-2xl shadow-xl shadow-yellow-200 ${!selectedLocations[item._id] ? 'opacity-40' : ''}`}
                      disabled={!selectedLocations[item._id]}
                      style={{ elevation: 5 }}
                    >
                      <Text className="font-black text-black text-base uppercase tracking-wider">Book Now</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))
        ) : (
          <View className="flex-1 items-center justify-center py-24">
            <View className="bg-gray-50 p-10 rounded-full mb-6">
              <Ionicons name="bicycle" size={80} color="#e2e8f0" />
            </View>
            <Text className="text-gray-900 font-black text-xl mb-2">No Rides Found</Text>
            <Text className="text-gray-500 text-center text-base px-10">We couldn't find any vehicles for these dates. Try different timings.</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        onPress={() => setSearchOverlayVisible(true)}
        className="absolute bottom-7 left-5 bg-gray-700 flex-row items-center px-4 py-3 rounded-full shadow-lg"
      >
        <Ionicons name="search" size={20} color="white" />
        <Text className="text-white ml-2">Search by Model </Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={searchOverlayVisible}
        animationType="fade"
        onRequestClose={() => setSearchOverlayVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.98)' }}>
          <SafeAreaView className="flex-1">
            <View className="flex-1 px-6 pt-6">
              {/* Header with Search Input */}
              <View className="flex-row items-center gap-3 mb-8">
                <View className="flex-1 flex-row items-center bg-gray-100 rounded-2xl px-4 py-1.5 border border-gray-100">
                  <Ionicons name="search" size={20} color="#94a3b8" />
                  <TextInput
                    autoFocus
                    className="flex-1 py-3 ml-2 text-gray-900 font-bold text-base"
                    placeholder="Search bike models..."
                    placeholderTextColor="#94a3b8"
                    value={searchQuery}
                    onChangeText={text => setSearchQuery(text)}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => setSearchOverlayVisible(false)}
                  className="bg-gray-100 p-3 rounded-2xl border border-gray-100"
                >
                  <Ionicons name="close" size={24} color="#1e293b" />
                </TouchableOpacity>
              </View>

              {searchQuery.length === 0 ? (
                <View className="flex-1">
                  <Text className="text-sm font-black text-gray-400 uppercase tracking-[2px] mb-6">
                    Popular Vehicles
                  </Text>

                  <FlatList
                    data={popularVehicles}
                    numColumns={3}
                    columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 20 }}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) => (
                      <TouchableScale
                        onPress={() => handleVehicleSelect(item.name)}
                        className="w-[31%] bg-white rounded-2xl p-2 items-center justify-center border border-gray-50"
                        style={{
                          elevation: 8,
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.05,
                          shadowRadius: 10,
                        }}
                      >
                        <Image
                          resizeMode="contain"
                          className="w-full h-20"
                          source={{ uri: getImageUrl(item.image) }}
                        />
                        <Text className="text-center mt-2 text-[11px] font-bold text-gray-800" numberOfLines={1}>
                          {item.name}
                        </Text>
                      </TouchableScale>
                    )}
                  />
                </View>
              ) : (
                <View className="flex-1">
                  <Text className="text-sm font-black text-gray-400 uppercase tracking-[2px] mb-6">
                    Search Results
                  </Text>
                  <FlatList
                    data={vehicles
                      .map((v: Vehicle) => v.name)
                      .filter((name: string) =>
                        name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()),
                      )}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        className="flex-row items-center justify-between py-4 border-b border-gray-50"
                        onPress={() => handleVehicleSelect(item)}
                      >
                        <View className="flex-row items-center">
                          <View className="bg-yellow-100 p-2 rounded-xl mr-3">
                            <Ionicons name="bicycle" size={20} color="#f59e0b" />
                          </View>
                          <Text className="text-lg font-bold text-gray-800">{item}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({});
