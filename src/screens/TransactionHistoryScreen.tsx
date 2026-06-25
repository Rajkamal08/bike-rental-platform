import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Filter } from 'lucide-react-native';
import { useWallet, Transaction } from '../contexts/WalletContext';

const TransactionHistoryScreen = () => {
    const navigation = useNavigation();
    const { transactions } = useWallet();
    const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');

    const filteredTransactions = transactions.filter(t => {
        if (filter === 'all') return true;
        return t.type === filter;
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const FilterChip = ({
        title,
        value,
    }: {
        title: string;
        value: 'all' | 'credit' | 'debit';
    }) => (
        <TouchableOpacity
            onPress={() => setFilter(value)}
            className={`px-4 py-2 rounded-full mr-2 border ${filter === value
                ? 'bg-yellow-400 border-yellow-400'
                : 'bg-white border-gray-200'
                }`}
        >
            <Text
                className={`font-medium ${filter === value ? 'text-black' : 'text-gray-600'
                    }`}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );

    const renderItem = ({ item }: { item: Transaction }) => (
        <View className="bg-white p-4 rounded-xl mb-3 shadow-sm flex-row items-center justify-between mx-4">
            <View className="flex-row items-center flex-1">
                <View
                    className={`p-3 rounded-full mr-3 ${item.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                        }`}
                >
                    {item.type === 'credit' ? (
                        <ArrowDownLeft
                            size={20}
                            color={item.type === 'credit' ? '#16a34a' : '#dc2626'}
                        />
                    ) : (
                        <ArrowUpRight
                            size={20}
                            color="#dc2626"
                        />
                    )}
                </View>
                <View className="flex-1">
                    <Text className="font-semibold text-gray-900 text-base">
                        {item.description}
                    </Text>
                    <Text className="text-gray-500 text-xs">{formatDate(item.date)}</Text>
                </View>
            </View>
            <View className="items-end">
                <Text
                    className={`font-bold text-base ${item.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}
                >
                    {item.type === 'credit' ? '+' : '-'}₹{item.amount.toFixed(2)}
                </Text>
                <Text className="text-xs text-gray-400 capitalize">{item.status}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-4 py-4 flex-row items-center shadow-sm z-10">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 rounded-full bg-gray-100 mr-3"
                >
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900">Transactions</Text>
            </View>

            {/* Filters */}
            <View className="px-4 py-4">
                <View className="flex-row">
                    <FilterChip title="All" value="all" />
                    <FilterChip title="Credit" value="credit" />
                    <FilterChip title="Debit" value="debit" />
                </View>
            </View>

            {/* List */}
            <FlatList
                data={filteredTransactions}
                renderItem={renderItem}
                keyExtractor={item => item._id || Math.random().toString()}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={
                    <View className="items-center justify-center py-20 px-4">
                        <View className="bg-gray-100 p-6 rounded-full mb-4">
                            <Filter size={48} color="#9ca3af" />
                        </View>
                        <Text className="text-xl font-bold text-gray-800 mb-2">
                            No Transactions Found
                        </Text>
                        <Text className="text-gray-500 text-center">
                            {filter === 'all'
                                ? "You haven't made any transactions yet."
                                : `No ${filter} transactions found.`}
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default TransactionHistoryScreen;

const styles = StyleSheet.create({});
