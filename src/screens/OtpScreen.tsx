import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Otp: { sessionId: string; phone: string; isLogin?: boolean };
  ProfileCompletion: { phone: string };
  Home: undefined;
};

type OtpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Otp'>;
type OtpScreenRouteProp = RouteProp<RootStackParamList, 'Otp'>;

const { width, height } = Dimensions.get('window');

const OtpScreen = () => {
  const [Otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const route = useRoute<OtpScreenRouteProp>();
  const navigation = useNavigation<OtpScreenNavigationProp>();
  const inputRefs = useRef<(TextInput | null)[]>(new Array(6).fill(null));
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);
  const { verifyOtp, sendOtp } = useAuth();
  const { sessionId, phone } = route?.params;
  const [currentSessionId, setCurrentSessionId] = useState(sessionId);
  const [verifying, setVerifying] = useState(false);

  const handleVerify = async () => {
    const otpString = Otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    setError(null);
    setVerifying(true);
    try {
      const user = await verifyOtp(currentSessionId, otpString, phone);
      if (user && (!user.firstName?.trim() || !user.email?.trim())) {
        // Navigation handled in AuthContext or app logic based on user state
      } else {
        navigation.navigate('Home');
      }
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResendOtp = async () => {
    setCanResend(false);
    setCountdown(60);
    setResending(true);
    setError(null);

    try {
      const newSessionId = await sendOtp(phone);
      setCurrentSessionId(newSessionId);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
      setCanResend(true);
      setCountdown(0);
    } finally {
      setResending(false);
    }
  };

  const handleChange = (value: string, index: number) => {
    if (/^\d$/.test(value) || value === '') {
      const newOtp = [...Otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      } else if (!value && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key == 'Backspace' && !Otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
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
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Banner Image - Reduced Height and Mirroring Login Page */}
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
            <View className="items-center mb-8">
              <Image
                source={require('../../assets/images/app_logo.png')}
                style={{ width: width * 0.3, height: width * 0.3 * 0.6 }}
                resizeMode="contain"
                className="mb-4"
              />
              <Text className="text-gray-900 text-3xl font-extrabold text-center tracking-tight">
                VERIFICATION
              </Text>
              <Text className="text-yellow-500 text-lg font-bold text-center mt-1">
                Royal Ride
              </Text>
            </View>

            {/* Instruction Section */}
            <View className="mb-10 items-center">
              <Text className="text-gray-500 text-center text-base font-medium leading-6">
                We've sent a 6-digit code to{"\n"}
                <Text className="font-bold text-gray-900">+91 {phone}</Text>
              </Text>
            </View>

            {/* OTP Input Section */}
            <View className="w-full mb-10">
              <View className="flex-row justify-between mb-8">
                {Otp?.map((digit, index) => (
                  <View key={index} className="flex-1 mx-1">
                    <TextInput
                      ref={ref => { inputRefs.current[index] = ref; }}
                      className={`border-b-4 text-3xl font-bold text-center py-3 ${digit ? 'border-yellow-400 text-gray-900' : 'border-gray-200 text-gray-400'
                        }`}
                      maxLength={1}
                      value={digit}
                      onChangeText={value => handleChange(value, index)}
                      onKeyPress={e => handleKeyPress(e, index)}
                      keyboardType="number-pad"
                      selectTextOnFocus
                    />
                  </View>
                ))}
              </View>

              {error && (
                <View className="bg-red-50 py-3 rounded-2xl mb-4">
                  <Text className="text-red-500 text-center font-semibold text-sm">{error}</Text>
                </View>
              )}
            </View>

            {/* Action Button - Polished Yellow with Shadow */}
            <TouchableOpacity
              onPress={handleVerify}
              disabled={verifying}
              className={`w-full bg-yellow-400 py-5 rounded-3xl mb-8 shadow-xl shadow-yellow-200 ${verifying ? 'opacity-70' : ''}`}
              style={{
                elevation: 8,
                shadowColor: '#F6AD55',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 15,
              }}
            >
              {verifying ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text className="text-black text-center text-xl font-extrabold tracking-tight">
                  Verify Now
                </Text>
              )}
            </TouchableOpacity>

            {/* Resend Logic */}
            <View className="items-center mb-10">
              {canResend ? (
                <TouchableOpacity onPress={handleResendOtp} disabled={resending}>
                  <Text className="text-blue-600 font-extrabold text-base">Resend OTP</Text>
                </TouchableOpacity>
              ) : (
                <Text className="text-gray-400 font-medium text-base">
                  Resend code in <Text className="text-gray-900 font-bold">{countdown}s</Text>
                </Text>
              )}
            </View>

            {/* Navigation Footer */}
            <View className="mt-auto">
              <View className="flex-row items-center justify-center">
                <Text className="text-gray-500 font-medium text-base">Wrong Number? </Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text className="text-blue-600 font-extrabold text-base">Change</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({});
