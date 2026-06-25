import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Linking,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
    ArrowLeft,
    MessageCircle,
    Phone,
    Mail,
    FileQuestion,
    AlertTriangle,
    ChevronRight,
} from 'lucide-react-native';
import ROUTES from '../navigation/routes/Routes';

const HelpSupportScreen = () => {
    const navigation = useNavigation<any>();

    const handleCallSupport = () => {
        Linking.openURL('tel:+919876543210');
    };

    const handleEmailSupport = () => {
        Linking.openURL('mailto:support@rentalbike.com');
    };

    const handleEmergency = () => {
        Linking.openURL('tel:112');
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="px-4 py-4 flex-row items-center border-b border-gray-100 bg-white">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 rounded-full bg-gray-50 mr-3"
                >
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900">Help & Support</Text>
            </View>

            <ScrollView className="flex-1 p-4">
                {/* Quick Actions */}
                <Text className="text-lg font-bold text-gray-800 mb-4">
                    How can we help you?
                </Text>

                <View className="flex-row flex-wrap justify-between mb-6">
                    <TouchableOpacity
                        onPress={() => navigation.navigate(ROUTES.FAQ)}
                        className="bg-white w-[48%] p-4 rounded-xl shadow-sm mb-4 items-center border border-gray-100"
                    >
                        <View className="bg-blue-50 p-3 rounded-full mb-2">
                            <FileQuestion size={24} color="#3b82f6" />
                        </View>
                        <Text className="font-semibold text-gray-900">FAQs</Text>
                        <Text className="text-xs text-gray-500 text-center mt-1">
                            Common questions
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate(ROUTES.RAISE_TICKET)}
                        className="bg-white w-[48%] p-4 rounded-xl shadow-sm mb-4 items-center border border-gray-100"
                    >
                        <View className="bg-yellow-50 p-3 rounded-full mb-2">
                            <MessageCircle size={24} color="#eab308" />
                        </View>
                        <Text className="font-semibold text-gray-900">Raise Ticket</Text>
                        <Text className="text-xs text-gray-500 text-center mt-1">
                            Report an issue
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Contact Options */}
                <Text className="text-lg font-bold text-gray-800 mb-4">Contact Us</Text>

                <TouchableOpacity
                    onPress={handleCallSupport}
                    className="bg-white p-4 rounded-xl shadow-sm mb-3 flex-row items-center border border-gray-100"
                >
                    <View className="bg-green-50 p-3 rounded-full mr-4">
                        <Phone size={24} color="#22c55e" />
                    </View>
                    <View className="flex-1">
                        <Text className="font-semibold text-gray-900">Call Support</Text>
                        <Text className="text-xs text-gray-500">
                            Available 9 AM - 9 PM
                        </Text>
                    </View>
                    <ChevronRight size={20} color="#9ca3af" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleEmailSupport}
                    className="bg-white p-4 rounded-xl shadow-sm mb-6 flex-row items-center border border-gray-100"
                >
                    <View className="bg-purple-50 p-3 rounded-full mr-4">
                        <Mail size={24} color="#a855f7" />
                    </View>
                    <View className="flex-1">
                        <Text className="font-semibold text-gray-900">Email Us</Text>
                        <Text className="text-xs text-gray-500">
                            Get a response within 24 hrs
                        </Text>
                    </View>
                    <ChevronRight size={20} color="#9ca3af" />
                </TouchableOpacity>

                {/* Emergency */}
                <TouchableOpacity
                    onPress={handleEmergency}
                    className="bg-red-50 p-4 rounded-xl border border-red-100 flex-row items-center justify-center mb-6"
                >
                    <AlertTriangle size={24} color="#ef4444" className="mr-2" />
                    <Text className="text-red-600 font-bold text-lg">
                        Emergency Support
                    </Text>
                </TouchableOpacity>

                {/* Footer */}
                <View className="items-center mt-4">
                    <Text className="text-gray-400 text-xs">App Version 1.0.0</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default HelpSupportScreen;

const styles = StyleSheet.create({});
