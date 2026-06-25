import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
    ArrowLeft,
    Bell,
    CheckCircle,
    CreditCard,
    Info,
    Tag,
    Trash2,
} from 'lucide-react-native';
import { useNotification, Notification } from '../contexts/NotificationContext';

const NotificationsScreen = () => {
    const navigation = useNavigation();
    const {
        notifications,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        loading,
        refreshNotifications,
    } = useNotification();

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refreshNotifications();
        setRefreshing(false);
    };

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'booking':
                return <CheckCircle size={24} color="#16a34a" />;
            case 'wallet':
                return <CreditCard size={24} color="#fbbf24" />;
            case 'promo':
                return <Tag size={24} color="#ec4899" />;
            case 'system':
            default:
                return <Info size={24} color="#3b82f6" />;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            });
        } else if (days === 1) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
        }
    };

    const renderItem = ({ item }: { item: Notification }) => (
        <TouchableOpacity
            onPress={() => markAsRead(item._id)}
            className={`flex-row p-4 border-b border-gray-100 ${item.read ? 'bg-white' : 'bg-blue-50'
                }`}
        >
            <View className="mr-4 mt-1">{getIcon(item.type)}</View>
            <View className="flex-1">
                <View className="flex-row justify-between items-start mb-1">
                    <Text
                        className={`text-base text-gray-900 ${item.read ? 'font-medium' : 'font-bold'
                            }`}
                    >
                        {item.title}
                    </Text>
                    <Text className="text-xs text-gray-500 ml-2">
                        {formatDate(item.date)}
                    </Text>
                </View>
                <Text className="text-gray-600 leading-5">{item.message}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="px-4 py-4 flex-row items-center justify-between border-b border-gray-100 bg-white">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="p-2 rounded-full bg-gray-50 mr-3"
                    >
                        <ArrowLeft size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-900">Notifications</Text>
                </View>
                <View className="flex-row gap-2">
                    <TouchableOpacity
                        onPress={markAllAsRead}
                        className="p-2 rounded-full bg-gray-50"
                    >
                        <CheckCircle size={20} color="#6b7280" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={clearNotifications}
                        className="p-2 rounded-full bg-gray-50"
                    >
                        <Trash2 size={20} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* List */}
            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={item => item._id || item.id}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View className="flex-1 items-center justify-center py-20 px-10">
                        <View className="bg-gray-100 p-6 rounded-full mb-4">
                            <Bell size={48} color="#9ca3af" />
                        </View>
                        <Text className="text-lg font-bold text-gray-900 mb-2">
                            No Notifications
                        </Text>
                        <Text className="text-gray-500 text-center">
                            You're all caught up! Check back later for updates.
                        </Text>
                    </View>
                }
                contentContainerStyle={{ flexGrow: 1 }}
            />
        </SafeAreaView>
    );
};

export default NotificationsScreen;

const styles = StyleSheet.create({});
