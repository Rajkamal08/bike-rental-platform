import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
    ArrowLeft,
    Plus,
    History,
    CreditCard,
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
} from 'lucide-react-native';
import { useWallet, Transaction } from '../contexts/WalletContext';
import ROUTES from '../navigation/routes/Routes';

const WalletScreen = () => {
    const navigation = useNavigation<any>();
    const { balance, transactions } = useWallet();

    const handleAddMoney = () => {
        navigation.navigate(ROUTES.ADD_MONEY);
    };

    const handleViewHistory = () => {
        navigation.navigate(ROUTES.TRANSACTION_HISTORY);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

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
                <Text className="text-xl font-bold text-gray-900">RB Wallet</Text>
            </View>

            <ScrollView className="flex-1">
                {/* Balance Card */}
                <View className="m-4">
                    <View className="bg-gray-900 rounded-2xl p-6 shadow-lg overflow-hidden relative">
                        {/* Decorative circles */}
                        <View className="absolute -top-10 -right-10 w-40 h-40 bg-gray-800 rounded-full opacity-50" />
                        <View className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-500 rounded-tr-full opacity-20" />

                        <View className="flex-row items-center mb-2">
                            <Wallet size={20} color="#fbbf24" />
                            <Text className="text-gray-400 ml-2 font-medium">
                                Total Balance
                            </Text>
                        </View>

                        <Text className="text-4xl font-bold text-white mb-6">
                            ₹{balance.toFixed(2)}
                        </Text>

                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={handleAddMoney}
                                className="flex-1 bg-yellow-400 py-3 rounded-xl flex-row items-center justify-center"
                            >
                                <Plus size={20} color="black" />
                                <Text className="text-black font-bold ml-2">Add Money</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <View className="px-4 mb-6">
                    <Text className="text-gray-800 font-bold text-lg mb-3">
                        Quick Actions
                    </Text>
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={handleAddMoney}
                            className="flex-1 bg-white p-4 rounded-xl shadow-sm items-center border border-gray-100"
                        >
                            <View className="bg-green-100 p-3 rounded-full mb-2">
                                <CreditCard size={24} color="#16a34a" />
                            </View>
                            <Text className="font-medium text-gray-800">Top Up</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleViewHistory}
                            className="flex-1 bg-white p-4 rounded-xl shadow-sm items-center border border-gray-100"
                        >
                            <View className="bg-blue-100 p-3 rounded-full mb-2">
                                <History size={24} color="#2563eb" />
                            </View>
                            <Text className="font-medium text-gray-800">History</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Recent Transactions */}
                <View className="px-4 pb-6">
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-gray-800 font-bold text-lg">
                            Recent Transactions
                        </Text>
                        <TouchableOpacity onPress={handleViewHistory}>
                            <Text className="text-yellow-600 font-semibold">View All</Text>
                        </TouchableOpacity>
                    </View>

                    {transactions.length === 0 ? (
                        <View className="bg-white p-8 rounded-xl items-center justify-center shadow-sm">
                            <History size={40} color="#d1d5db" />
                            <Text className="text-gray-500 mt-3 text-center">
                                No transactions yet
                            </Text>
                        </View>
                    ) : (
                        transactions.slice(0, 5).map(transaction => (
                            <View
                                key={transaction._id || transaction.id}
                                className="bg-white p-4 rounded-xl mb-3 shadow-sm flex-row items-center justify-between"
                            >
                                <View className="flex-row items-center flex-1">
                                    <View
                                        className={`p-3 rounded-full mr-3 ${transaction.type === 'credit'
                                            ? 'bg-green-100'
                                            : 'bg-red-100'
                                            }`}
                                    >
                                        {transaction.type === 'credit' ? (
                                            <ArrowDownLeft
                                                size={20}
                                                color={transaction.type === 'credit' ? '#16a34a' : '#dc2626'}
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
                                            {transaction.description}
                                        </Text>
                                        <Text className="text-gray-500 text-xs">
                                            {formatDate(transaction.date)}
                                        </Text>
                                    </View>
                                </View>
                                <Text
                                    className={`font-bold text-base ${transaction.type === 'credit'
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                        }`}
                                >
                                    {transaction.type === 'credit' ? '+' : '-'}₹
                                    {transaction.amount.toFixed(2)}
                                </Text>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default WalletScreen;

const styles = StyleSheet.create({});
