import { StyleSheet, Text, View } from 'react-native';
import React, { lazy, Suspense } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PhoneNumberScreen from '../../screens/PhoneNumberScreen';
import ROUTES from '../routes/Routes';

const OtpScreen = lazy(() => import('../../screens/OtpScreen'));
const Stack = createNativeStackNavigator();

const AuthStackNavigator = () => {
  return (
    <Suspense fallback={null}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name={ROUTES.PHONE_NUMBER}
          component={PhoneNumberScreen}
        />
        <Stack.Screen name={'Otp'} component={OtpScreen} />
      </Stack.Navigator>
    </Suspense>
  );
};

export default AuthStackNavigator;

const styles = StyleSheet.create({});
