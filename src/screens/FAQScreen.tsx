import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react-native';

if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQScreen = () => {
    const navigation = useNavigation();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const faqs = [
        {
            id: '1',
            question: 'How do I book a bike?',
            answer:
                'You can book a bike by selecting a vehicle from the home screen, choosing your dates, and proceeding to payment.',
        },
        {
            id: '2',
            question: 'What documents are required?',
            answer:
                'You need a valid Driving License and an ID proof (Aadhar Card/Voter ID) to rent a bike.',
        },
        {
            id: '3',
            question: 'Is fuel included in the rental?',
            answer:
                'No, fuel is not included. The bike will be provided with a minimal amount of fuel to reach the nearest petrol pump.',
        },
        {
            id: '4',
            question: 'What is the cancellation policy?',
            answer:
                'You can cancel for free up to 24 hours before the pickup time. Cancellations within 24 hours may incur a fee.',
        },
        {
            id: '5',
            question: 'Is there a security deposit?',
            answer:
                'Yes, a refundable security deposit is required at the time of pickup. The amount varies by vehicle type.',
        },
    ];

    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="px-4 py-4 flex-row items-center border-b border-gray-100">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 rounded-full bg-gray-50 mr-3"
                >
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900">
                    Frequently Asked Questions
                </Text>
            </View>

            <ScrollView className="flex-1 p-4">
                {faqs.map(faq => (
                    <View
                        key={faq.id}
                        className="bg-white border border-gray-200 rounded-xl mb-3 overflow-hidden"
                    >
                        <TouchableOpacity
                            onPress={() => toggleExpand(faq.id)}
                            className="p-4 flex-row justify-between items-center bg-gray-50"
                        >
                            <Text className="font-semibold text-gray-800 flex-1 mr-2">
                                {faq.question}
                            </Text>
                            {expandedId === faq.id ? (
                                <ChevronUp size={20} color="#6b7280" />
                            ) : (
                                <ChevronDown size={20} color="#6b7280" />
                            )}
                        </TouchableOpacity>
                        {expandedId === faq.id && (
                            <View className="p-4 bg-white">
                                <Text className="text-gray-600 leading-5">{faq.answer}</Text>
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

export default FAQScreen;

const styles = StyleSheet.create({});
