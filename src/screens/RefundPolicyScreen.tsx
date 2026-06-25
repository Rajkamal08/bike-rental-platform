import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RefundPolicyScreen = () => {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="px-6 py-4">
                <Text className="text-2xl font-bold mb-6 text-gray-800">Refund Policy</Text>

                <View className="space-y-6 mb-10">
                    <Section title="1. Eligibility for Refunds">
                        <Text className="text-gray-600 leading-6">
                            Refunds are issued based on the timing of the cancellation and the specific circumstances of the booking.
                            Our goal is to ensure fairness to both our customers and our vehicle partners.
                        </Text>
                    </Section>

                    <Section title="2. Full Refunds">
                        <Text className="text-gray-600 leading-6">
                            - Full refunds will be issued if the cancellation is made more than 48 hours before the scheduled pickup time.
                            - Full refunds will also be issued if the vehicle provided is significantly different from the description or is in a non-functional state at the time of pickup.
                        </Text>
                    </Section>

                    <Section title="3. Partial Refunds">
                        <Text className="text-gray-600 leading-6">
                            - Cancellations made between 24 and 48 hours before pickup will be eligible for a 50% refund.
                            - Processing fees may be deducted from the final refund amount.
                        </Text>
                    </Section>

                    <Section title="4. No Refunds">
                        <Text className="text-gray-600 leading-6">
                            - No refunds will be issued for cancellations made within 24 hours of the scheduled pickup time.
                            - No refunds for early return of the vehicle.
                            - No refunds if the customer fails to show up at the pickup location.
                        </Text>
                    </Section>

                    <Section title="5. Refund Processing Time">
                        <Text className="text-gray-600 leading-6">
                            Once approved, refunds are typically processed within 5-10 business days. The amount will be credited back to the original payment method used during booking or into your RB Wallet.
                        </Text>
                    </Section>

                    <Section title="6. Security Deposits">
                        <Text className="text-gray-600 leading-6">
                            Security deposits are fully refundable at the end of the ride, provided there is no damage to the vehicle and all terms of the rental agreement were met.
                        </Text>
                    </Section>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View className="mb-6">
        <Text className="text-lg font-bold text-gray-800 mb-2">{title}</Text>
        {children}
    </View>
);

export default RefundPolicyScreen;
