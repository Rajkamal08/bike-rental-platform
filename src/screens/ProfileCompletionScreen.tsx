import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ROUTES from '../navigation/routes/Routes';

const ProfileCompletionScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { completeProfile } = useAuth();
  const route = useRoute();
  const { phone } = route?.params;
  const navigation = useNavigation();
  const handleSubmit = async () => {
    try {
      await completeProfile(phone, firstName, lastName, email);
      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.MAIN_TABS }],
      });
    } catch (err) {
      setError('Failed to save profile');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white ">
      <View className="p-6">
        <Text className="text-2xl font-bold text-center mb-6">
          Complete your Profile
        </Text>

        <TextInput
          className="border border-gray-400 rounded-xl px-4 py-3 mb-4"
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          className="border border-gray-400 rounded-xl px-4 py-3 mb-4"
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          className="border border-gray-400 rounded-xl px-4 py-3 mb-4"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-yellow-600 py-4 rounded-xl items-center"
        >
          <Text className="text-white text-lg font-semibold">Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileCompletionScreen;

const styles = StyleSheet.create({});
