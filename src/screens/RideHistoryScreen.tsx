import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Calendar, Clock, MapPin, ChevronRight, History } from 'lucide-react-native';
import api from '../utils/api';
import ROUTES from '../navigation/routes/Routes';
import dayjs from 'dayjs';

const RideHistoryScreen = () => {
    const navigation = useNavigation<any>();
    const [rides, setRides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRideHistory();
    }, []);

    const fetchRideHistory = async () => {
        try {
            const response = await api.get('bookings/user');
            // Filter for past or completed rides if needed, or just show all
            setRides(response.data);
        } catch (error) {
            console.error('Error fetching ride history:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderRideItem = ({ item }: { item: any }) => {
        const rideEndDateTime = dayjs(`${dayjs(item.endDate).format('YYYY-MM-DD')} ${item.endTime}`, 'YYYY-MM-DD hh:mm A');
        const isCompleted = item.status === 'completed' || rideEndDateTime.isBefore(dayjs());

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate(ROUTES.INVOICE, { booking: item })}
                className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100"
            >
                <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                        <Text className="text-lg font-bold text-black">{item.vehicleId?.name}</Text>
                        <View className="flex-row items-center mt-1">
                            <Calendar size={14} color="#6b7280" />
                            <Text className="text-gray-500 text-xs ml-1">
                                {dayjs(item.startDate).format('DD MMM')} - {dayjs(item.endDate).format('DD MMM, YYYY')}
                            </Text>
                        </View>
                    </View>
                    <View className={`px-3 py-1 rounded-full ${isCompleted ? 'bg-green-100' : 'bg-blue-100'}`}>
                        <Text className={`text-xs font-semibold ${isCompleted ? 'text-green-700' : 'text-blue-700'}`}>
                            {item.status?.toUpperCase()}
                        </Text>
                    </View>
                </View>

                <View className="flex-row items-center justify-between border-t border-gray-50 pt-3">
                    <View className="flex-row items-center">
                        <Text className="text-gray-400 text-xs">Total Paid:</Text>
                        <Text className="text-black font-bold ml-1 text-base">₹{item.totalPrice}</Text>
                    </View>
                    <View className="flex-row items-center">
                        <Text className="text-blue-500 font-semibold mr-1">View Details</Text>
                        <ChevronRight size={18} color="#3b82f6" />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-black ml-4">Ride History</Text>
            </View>

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#fbbf24" />
                </View>
            ) : rides.length > 0 ? (
                <FlatList
                    data={rides}
                    keyExtractor={(item) => item._id}
                    renderItem={renderRideItem}
                    className="flex-1 px-4 py-4"
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View className="flex-1 justify-center items-center px-10">
                    <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                        <History size={40} color="#9ca3af" />
                    </View>
                    <Text className="text-xl font-bold text-gray-800 text-center">No Rides Yet</Text>
                    <Text className="text-gray-500 text-center mt-2">
                        Your past bookings will appear here. Start your first journey today!
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate(ROUTES.HOME)}
                        className="bg-yellow-400 px-8 py-3 rounded-xl mt-6 shadow-sm"
                    >
                        <Text className="text-black font-bold">Book a Ride</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

export default RideHistoryScreen;

const styles = StyleSheet.create({});
