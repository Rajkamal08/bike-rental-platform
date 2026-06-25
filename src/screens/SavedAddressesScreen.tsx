import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
    ArrowLeft,
    Plus,
    MapPin,
    MoreVertical,
    Trash2,
    Edit2,
    CheckCircle2,
} from 'lucide-react-native';
import { useAddress, Address } from '../contexts/AddressContext';
import ROUTES from '../navigation/routes/Routes';

const SavedAddressesScreen = () => {
    const navigation = useNavigation<any>();
    const { addresses, deleteAddress, setDefaultAddress } = useAddress();

    const handleAddAddress = () => {
        navigation.navigate(ROUTES.ADD_EDIT_ADDRESS);
    };

    const handleEditAddress = (address: Address) => {
        navigation.navigate(ROUTES.ADD_EDIT_ADDRESS, { address });
    };

    const handleDeleteAddress = (id: string) => {
        Alert.alert(
            'Delete Address',
            'Are you sure you want to delete this address?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteAddress(id),
                },
            ]
        );
    };

    const handleSetDefault = (id: string) => {
        setDefaultAddress(id);
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
                <Text className="text-xl font-bold text-gray-900 flex-1">
                    Saved Addresses
                </Text>
                <TouchableOpacity
                    onPress={handleAddAddress}
                    className="flex-row items-center bg-yellow-400 px-3 py-2 rounded-lg"
                >
                    <Plus size={18} color="black" />
                    <Text className="font-semibold ml-1">Add New</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4 pt-4">
                {addresses.length === 0 ? (
                    <View className="items-center justify-center py-20">
                        <View className="bg-yellow-100 p-6 rounded-full mb-4">
                            <MapPin size={48} color="#fbbf24" />
                        </View>
                        <Text className="text-xl font-bold text-gray-800 mb-2">
                            No Addresses Saved
                        </Text>
                        <Text className="text-gray-500 text-center px-10 mb-6">
                            Save your favorite locations for faster checkout.
                        </Text>
                        <TouchableOpacity
                            onPress={handleAddAddress}
                            className="bg-yellow-400 px-8 py-3 rounded-xl"
                        >
                            <Text className="font-bold text-black">Add Address</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    addresses.map(address => (
                        <View
                            key={address._id}
                            className={`bg-white rounded-xl p-4 mb-4 shadow-sm border ${address.isDefault ? 'border-yellow-400' : 'border-transparent'
                                }`}
                        >
                            <View className="flex-row justify-between items-start mb-2">
                                <View className="flex-row items-center">
                                    <View className="bg-gray-100 p-2 rounded-full mr-3">
                                        <MapPin size={20} color="#4b5563" />
                                    </View>
                                    <View>
                                        <View className="flex-row items-center">
                                            <Text className="font-bold text-lg text-gray-900 mr-2">
                                                {address.label}
                                            </Text>
                                            {address.isDefault && (
                                                <View className="bg-yellow-100 px-2 py-0.5 rounded text-xs">
                                                    <Text className="text-yellow-800 text-[10px] font-bold uppercase">
                                                        Default
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <Text className="text-gray-600 ml-11 mb-3 leading-5">
                                {address.line1}
                                {address.line2 ? `, ${address.line2}` : ''}
                                {'\n'}
                                {address.city}, {address.state} - {address.pincode}
                                {address.landmark ? `\nLandmark: ${address.landmark}` : ''}
                            </Text>

                            <View className="flex-row justify-end border-t border-gray-100 pt-3 gap-3">
                                {!address.isDefault && (
                                    <TouchableOpacity
                                        onPress={() => handleSetDefault(address._id)}
                                        className="flex-row items-center px-3 py-1.5 rounded-lg bg-gray-50"
                                    >
                                        <CheckCircle2 size={14} color="#6b7280" />
                                        <Text className="text-gray-600 text-xs font-medium ml-1">
                                            Set Default
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    onPress={() => handleEditAddress(address)}
                                    className="flex-row items-center px-3 py-1.5 rounded-lg bg-blue-50"
                                >
                                    <Edit2 size={14} color="#2563eb" />
                                    <Text className="text-blue-600 text-xs font-medium ml-1">
                                        Edit
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleDeleteAddress(address._id)}
                                    className="flex-row items-center px-3 py-1.5 rounded-lg bg-red-50"
                                >
                                    <Trash2 size={14} color="#dc2626" />
                                    <Text className="text-red-600 text-xs font-medium ml-1">
                                        Delete
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default SavedAddressesScreen;

const styles = StyleSheet.create({});
