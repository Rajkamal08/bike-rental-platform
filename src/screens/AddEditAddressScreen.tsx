import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Switch,
    Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ArrowLeft, MapPin, Home, Briefcase, Map } from 'lucide-react-native';
import { useAddress, Address } from '../contexts/AddressContext';

type RootStackParamList = {
    AddEditAddress: {
        address?: Address;
    };
};

type AddEditAddressRouteProp = RouteProp<RootStackParamList, 'AddEditAddress'>;

const AddEditAddressScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<AddEditAddressRouteProp>();
    const { addAddress, updateAddress } = useAddress();
    const editingAddress = route.params?.address;

    const [label, setLabel] = useState('Home');
    const [line1, setLine1] = useState('');
    const [line2, setLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [landmark, setLandmark] = useState('');
    const [isDefault, setIsDefault] = useState(false);
    const [customLabel, setCustomLabel] = useState('');

    useEffect(() => {
        if (editingAddress) {
            setLabel(
                ['Home', 'Work', 'Other'].includes(editingAddress.label)
                    ? editingAddress.label
                    : 'Other'
            );
            if (!['Home', 'Work'].includes(editingAddress.label)) {
                setCustomLabel(editingAddress.label);
            }
            setLine1(editingAddress.line1);
            setLine2(editingAddress.line2 || '');
            setCity(editingAddress.city);
            setState(editingAddress.state);
            setPincode(editingAddress.pincode);
            setLandmark(editingAddress.landmark || '');
            setIsDefault(editingAddress.isDefault);
        }
    }, [editingAddress]);

    const handleSave = async () => {
        if (!line1 || !city || !state || !pincode) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const finalLabel = label === 'Other' ? customLabel || 'Other' : label;

        const addressData = {
            label: finalLabel,
            line1,
            line2,
            city,
            state,
            pincode,
            landmark,
            isDefault,
        };

        try {
            if (editingAddress) {
                await updateAddress(editingAddress._id, addressData);
            } else {
                await addAddress(addressData);
            }
            navigation.goBack();
        } catch (error) {
            console.error('Error saving address:', error);
            Alert.alert('Error', 'Failed to save address. Please try again.');
        }
    };

    const LabelButton = ({
        title,
        icon: Icon,
    }: {
        title: string;
        icon: any;
    }) => (
        <TouchableOpacity
            onPress={() => setLabel(title)}
            className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border ${label === title
                ? 'bg-yellow-100 border-yellow-400'
                : 'bg-white border-gray-200'
                } mr-2`}
        >
            <Icon
                size={18}
                color={label === title ? '#854d0e' : '#6b7280'}
                className="mr-2"
            />
            <Text
                className={`font-medium ${label === title ? 'text-yellow-900' : 'text-gray-600'
                    }`}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="bg-white px-4 py-4 flex-row items-center shadow-sm z-10">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 rounded-full bg-gray-100 mr-3"
                >
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900">
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                </Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-4 pt-6">
                    {/* Label Selection */}
                    <Text className="text-gray-700 font-semibold mb-3">Save as</Text>
                    <View className="flex-row mb-4">
                        <LabelButton title="Home" icon={Home} />
                        <LabelButton title="Work" icon={Briefcase} />
                        <LabelButton title="Other" icon={MapPin} />
                    </View>

                    {label === 'Other' && (
                        <View className="mb-4">
                            <Text className="text-gray-500 text-xs mb-1 ml-1">
                                Custom Label (e.g. Gym, Parents Home)
                            </Text>
                            <TextInput
                                value={customLabel}
                                onChangeText={setCustomLabel}
                                placeholder="Enter label"
                                className="bg-white p-4 rounded-xl border border-gray-200 text-gray-900"
                            />
                        </View>
                    )}

                    {/* Address Fields */}
                    <View className="space-y-4 mb-6">
                        <View>
                            <Text className="text-gray-700 font-medium mb-1 ml-1">
                                Flat / House No / Building <Text className="text-red-500">*</Text>
                            </Text>
                            <TextInput
                                value={line1}
                                onChangeText={setLine1}
                                placeholder="e.g. Flat 101, Galaxy Apartments"
                                className="bg-white p-4 rounded-xl border border-gray-200 text-gray-900"
                            />
                        </View>

                        <View>
                            <Text className="text-gray-700 font-medium mb-1 ml-1">
                                Area / Street / Sector
                            </Text>
                            <TextInput
                                value={line2}
                                onChangeText={setLine2}
                                placeholder="e.g. MG Road, Sector 14"
                                className="bg-white p-4 rounded-xl border border-gray-200 text-gray-900"
                            />
                        </View>

                        <View>
                            <Text className="text-gray-700 font-medium mb-1 ml-1">
                                Landmark
                            </Text>
                            <TextInput
                                value={landmark}
                                onChangeText={setLandmark}
                                placeholder="e.g. Near City Mall"
                                className="bg-white p-4 rounded-xl border border-gray-200 text-gray-900"
                            />
                        </View>

                        <View className="flex-row gap-3">
                            <View className="flex-1">
                                <Text className="text-gray-700 font-medium mb-1 ml-1">
                                    City <Text className="text-red-500">*</Text>
                                </Text>
                                <TextInput
                                    value={city}
                                    onChangeText={setCity}
                                    placeholder="City"
                                    className="bg-white p-4 rounded-xl border border-gray-200 text-gray-900"
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-700 font-medium mb-1 ml-1">
                                    State <Text className="text-red-500">*</Text>
                                </Text>
                                <TextInput
                                    value={state}
                                    onChangeText={setState}
                                    placeholder="State"
                                    className="bg-white p-4 rounded-xl border border-gray-200 text-gray-900"
                                />
                            </View>
                        </View>

                        <View>
                            <Text className="text-gray-700 font-medium mb-1 ml-1">
                                Pincode <Text className="text-red-500">*</Text>
                            </Text>
                            <TextInput
                                value={pincode}
                                onChangeText={setPincode}
                                placeholder="e.g. 110001"
                                keyboardType="numeric"
                                maxLength={6}
                                className="bg-white p-4 rounded-xl border border-gray-200 text-gray-900"
                            />
                        </View>
                    </View>

                    {/* Default Checkbox */}
                    <View className="flex-row items-center justify-between bg-white p-4 rounded-xl border border-gray-200 mb-8">
                        <View>
                            <Text className="text-gray-900 font-semibold">
                                Set as Default Address
                            </Text>
                            <Text className="text-gray-500 text-xs">
                                Use this address for checkout automatically
                            </Text>
                        </View>
                        <Switch
                            value={isDefault}
                            onValueChange={setIsDefault}
                            trackColor={{ false: '#d1d5db', true: '#facc15' }}
                            thumbColor={isDefault ? '#ffffff' : '#f4f3f4'}
                        />
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        onPress={handleSave}
                        className="bg-yellow-400 py-4 rounded-xl mb-10 shadow-md"
                    >
                        <Text className="text-center font-bold text-lg text-black">
                            Save Address
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AddEditAddressScreen;

const styles = StyleSheet.create({});
