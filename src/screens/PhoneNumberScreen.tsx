import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

type RootStackParamList = {
  PhoneNumber: undefined;
  Otp: { sessionId: string; phone: string; isLogin?: boolean };
  ProfileCompletion: { phone: string };
  Home: undefined;
};

type PhoneNumberScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PhoneNumber'
>;

const { width, height } = Dimensions.get('window');

const PhoneNumberScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const navigation = useNavigation<PhoneNumberScreenNavigationProp>();
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const { sendOtp } = useAuth();

  const handleContinue = async () => {
    if (!phoneNumber) {
      setError('Phone Number is required');
      return;
    }

    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const sessionId = await sendOtp(phoneNumber);
      navigation.navigate('Otp', { sessionId, phone: phoneNumber, isLogin });
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Banner Image - Reduced Height and Better Spacing */}
          <View style={{ height: height * 0.22 }} className="w-full relative">
            <Image
              source={require('../../assets/images/Bike_rentals.jpg')}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          {/* Content Container */}
          <View className="flex-1 px-8 pt-8 pb-10">
            {/* Logo Section */}
            <View className="items-center mb-10">
              <Image
                source={require('../../assets/images/app_logo.png')}
                style={{ width: width * 0.3, height: width * 0.3 * 0.6 }}
                resizeMode="contain"
                className="mb-4"
              />
              <Text className="text-gray-900 text-3xl font-extrabold text-center tracking-tight">
                BIKE RENTAL
              </Text>
              <Text className="text-yellow-500 text-lg font-bold text-center mt-1">
                Royal Ride
              </Text>
              <Text className="text-gray-400 text-sm font-medium text-center mt-1">
                Mobility For Everyone!
              </Text>
            </View>

            {/* Form Section */}
            <View className="w-full mb-10">
              <Text className="text-gray-800 text-xl font-bold mb-6 text-center">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </Text>

              {/* Phone Input - More touch-friendly and clean */}
              <View className="flex-row items-center border border-gray-200 rounded-2xl p-4 bg-gray-50/50">
                <View className="flex-row items-center border-r border-gray-200 pr-4 mr-4">
                  <Image
                    source={require('../../assets/images/flag.jpg')}
                    className="w-7 h-5 mr-2 rounded-sm"
                    resizeMode="cover"
                  />
                  <Text className="text-gray-900 font-bold text-lg">
                    +91
                  </Text>
                </View>
                <TextInput
                  className="flex-1 text-lg text-gray-900 font-semibold h-12"
                  placeholder="Enter your Phone No"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phoneNumber}
                  onChangeText={text => {
                    const numericText = text.replace(/[^0-9]/g, '');
                    setPhoneNumber(numericText);
                    if (error) setError(null);
                  }}
                />
              </View>
              {error && (
                <Text className="text-red-500 text-sm mt-3 ml-1 font-semibold">
                  {error}
                </Text>
              )}
            </View>

            {/* Action Button - More prominent and stylized */}
            <TouchableOpacity
              onPress={handleContinue}
              disabled={loading}
              className={`w-full bg-yellow-400 py-5 rounded-3xl mb-10 shadow-xl shadow-yellow-200 ${loading ? 'opacity-70' : ''
                }`}
              style={{
                elevation: 8,
                shadowColor: '#F6AD55',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 15,
              }}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text className="text-black text-center text-xl font-extrabold tracking-tight">
                  Get OTP
                </Text>
              )}
            </TouchableOpacity>

            {/* Footer Options */}
            <View className="mt-auto">
              {/* WhatsApp Updates Toggle (Visual only for now) */}
              <View className="flex-row items-center justify-center mb-8">
                <View className="w-6 h-6 border-2 border-gray-200 rounded-lg mr-3 items-center justify-center">
                  <View className="w-3 h-3 bg-yellow-400 rounded-sm opacity-20" />
                </View>
                <Text className="text-gray-400 text-sm font-semibold">
                  Get Updates on WhatsApp
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setIsLogin(!isLogin)}
                className="mb-10"
              >
                <Text className="text-center">
                  <Text className="text-gray-500 font-medium text-base">
                    {isLogin
                      ? "Don't have an account? "
                      : 'Already have an account? '}
                  </Text>
                  <Text className="text-blue-600 font-extrabold text-base">
                    {isLogin ? 'Sign Up' : 'Log In'}
                  </Text>
                </Text>
              </TouchableOpacity>

              <Text className="text-gray-400 text-xs text-center px-6 leading-5">
                By continuing, you agree to our{' '}
                <Text className="text-gray-500 font-semibold">
                  Terms & Conditions
                </Text>{' '}
                and{' '}
                <Text className="text-gray-500 font-semibold">
                  Privacy Policy
                </Text>
                .
              </Text>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PhoneNumberScreen;

const styles = StyleSheet.create({});
