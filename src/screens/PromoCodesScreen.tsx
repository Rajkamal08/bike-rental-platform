import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Clipboard,
    Alert,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Tag, Copy, Calendar } from 'lucide-react-native';
import { usePromo, PromoCode } from '../contexts/PromoContext';

const PromoCodesScreen = () => {
    const navigation = useNavigation();
    const { promoCodes, loading } = usePromo();

    const handleCopyCode = (code: string) => {
        Clipboard.setString(code);
        Alert.alert('Copied', `Promo code ${code} copied to clipboard!`);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const renderItem = ({ item }: { item: PromoCode }) => (
        <View className="bg-white rounded-xl mb-4 p-4 shadow-sm border border-gray-100 overflow-hidden relative">
            {/* Left border accent */}
            <View className="absolute left-0 top-0 bottom-0 w-2 bg-yellow-400" />

            <View className="flex-row justify-between items-start ml-2">
                <View className="flex-1 mr-4">
                    <View className="flex-row items-center mb-1">
                        <Tag size={16} color="#fbbf24" className="mr-1" />
                        <Text className="text-lg font-bold text-gray-900 tracking-wider">
                            {item.code}
                        </Text>
                    </View>
                    <Text className="text-gray-600 mb-2">{item.description}</Text>

                    <View className="flex-row items-center">
                        <Calendar size={12} color="#9ca3af" />
                        <Text className="text-xs text-gray-400 ml-1">
                            Expires: {formatDate(item.expiryDate)}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => handleCopyCode(item.code)}
                    className="bg-gray-50 p-2 rounded-lg border border-gray-200"
                >
                    <Copy size={20} color="#4b5563" />
                </TouchableOpacity>
            </View>

            {/* Dotted line decoration (optional visual flair) */}
            <View className="absolute -left-2 top-1/2 w-4 h-4 bg-gray-50 rounded-full" />
            <View className="absolute -right-2 top-1/2 w-4 h-4 bg-gray-50 rounded-full" />
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-4 py-4 flex-row items-center border-b border-gray-100">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 rounded-full bg-gray-50 mr-3"
                >
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900">Offers & Coupons</Text>
            </View>

            <FlatList
                data={promoCodes}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={
                    <View className="items-center justify-center py-20">
                        <Text className="text-gray-500">No promo codes available right now.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default PromoCodesScreen;

const styles = StyleSheet.create({});
