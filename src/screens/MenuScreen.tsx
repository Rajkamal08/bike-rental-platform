import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  CheckCheck,
  FileText,
  HelpCircle,
  LogOut,
  MapPin,
  Wallet,
  X,
  Shield,
  Bell,
  Tag,
  History,
  User as UserIcon,
} from 'lucide-react-native';
import ROUTES from '../navigation/routes/Routes';
import api from '../utils/api';
import { useNotification } from '../contexts/NotificationContext';

interface User {
  phone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  id?: string;
  profileImage?: string;
}
interface AuthContextType {
  logout: () => Promise<void>;
  user: User;
  token?: string;
}
import TouchableScale from '../components/TouchableScale';
import { getImageUrl } from '../utils/api';

const MenuScreen = () => {
  const { logout, user, token } = useAuth() as AuthContextType;
  const navigation = useNavigation<any>();
  const { unreadCount } = useNotification();
  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    const fetchBookingCount = async () => {
      try {
        const response = await api.get('bookings/user');
        setBookingCount(response.data.length);
      } catch (err) {
        console.error('Error fetching booking count:', err);
      }
    };
    if (token) {
      fetchBookingCount();
    }
  }, [token]);

  const handleViewProfile = () => {
    navigation.navigate(ROUTES.PROFILE_EDIT);
  };

  const handleMyBookings = () => {
    navigation.navigate(ROUTES.BOOKINGS);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logout(),
        },
      ],
      { cancelable: true }
    );
  };

  const MenuItem = ({ title, icon: Icon, onPress, badgeCount, badgeColor = 'bg-yellow-400' }: any) => (
    <TouchableScale
      onPress={onPress}
      className="flex-row justify-between items-center bg-white px-5 py-4.5 rounded-[24px] mb-3 border border-gray-50"
      style={{
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      }}
    >
      <View className="flex-row items-center">
        <View className="bg-gray-50 p-3 rounded-2xl mr-4">
          <Icon size={22} color="#1e293b" strokeWidth={2.5} />
        </View>
        <Text className="text-[17px] font-extrabold text-gray-800 tracking-tight">
          {title}
        </Text>
        {badgeCount > 0 && (
          <View className={`${badgeColor} rounded-full min-w-[22px] h-[22px] items-center justify-center ml-3 px-1.5`}>
            <Text className={`text-[11px] font-black ${badgeColor === 'bg-red-500' ? 'text-white' : 'text-black'}`}>
              {badgeCount}
            </Text>
          </View>
        )}
      </View>
      <View className="bg-gray-50 p-1.5 rounded-full">
        <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
      </View>
    </TouchableScale>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Premium Header */}
        <View className="bg-yellow-400 rounded-b-[40px] px-8 pt-10 pb-12 shadow-2xl shadow-yellow-200">
          <View className="flex-row items-center justify-between mb-8">
            <Text className="text-black text-2xl font-black tracking-tighter uppercase">Menu</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} className="bg-white/30 p-2 rounded-full">
              <X size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center gap-5">
            <View className="w-20 h-20 rounded-3xl border-4 border-white flex items-center justify-center bg-white overflow-hidden shadow-2xl">
              {user?.profileImage ? (
                <Image
                  source={{ uri: getImageUrl(user.profileImage) }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="bg-gray-50 w-full h-full items-center justify-center">
                  <UserIcon size={40} color="#cbd5e1" />
                </View>
              )}
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-black text-black tracking-tight" numberOfLines={1}>
                {user?.firstName || 'Welcome'} {user?.lastName || 'Rider'}
              </Text>
              <View className="flex-row items-center mt-1">
                <View className={`w-2 h-2 rounded-full mr-2 ${user?.firstName && user?.email ? 'bg-green-500' : 'bg-red-500'}`} />
                <Text className="text-sm font-bold text-gray-800">
                  {user?.firstName && user?.email ? 'Verified Profile' : 'Incomplete Profile'}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row gap-3 mt-8">
            <TouchableScale
              onPress={handleViewProfile}
              className="flex-1 bg-black py-4 rounded-2xl items-center shadow-xl"
            >
              <Text className="text-white font-black uppercase text-[12px] tracking-widest">Edit Profile</Text>
            </TouchableScale>
            <TouchableScale
              onPress={() => navigation.navigate(ROUTES.KYC_VERIFICATION)}
              className="flex-1 bg-white py-4 rounded-2xl items-center shadow-xl"
            >
              <Text className="text-black font-black uppercase text-[12px] tracking-widest">KYC Status</Text>
            </TouchableScale>
          </View>
        </View>

        {/* Menu Items Section */}
        <View className="px-6 pt-8 pb-10">
          <Text className="text-[12px] font-black text-gray-400 uppercase tracking-[3px] mb-6 ml-1">General</Text>
          <MenuItem title="My Bookings" icon={CheckCheck} onPress={handleMyBookings} badgeCount={bookingCount} />
          <MenuItem title="Ride History" icon={History} onPress={() => navigation.navigate(ROUTES.RIDE_HISTORY)} />
          <MenuItem title="Saved Addresses" icon={MapPin} onPress={() => navigation.navigate(ROUTES.SAVED_ADDRESSES)} />
          <MenuItem title="Offers & Coupons" icon={Tag} onPress={() => navigation.navigate(ROUTES.PROMO_CODES)} />
          <MenuItem title="RB Wallet" icon={Wallet} onPress={() => navigation.navigate(ROUTES.WALLET)} />

          <Text className="text-[12px] font-black text-gray-400 uppercase tracking-[3px] mt-8 mb-6 ml-1">Support & Privacy</Text>
          <MenuItem title="Help & Support" icon={HelpCircle} onPress={() => navigation.navigate(ROUTES.HELP_SUPPORT)} />
          <MenuItem title="Notifications" icon={Bell} onPress={() => navigation.navigate(ROUTES.NOTIFICATIONS)} badgeCount={unreadCount} badgeColor="bg-red-500" />
          <MenuItem title="Cancellation Policy" icon={X} onPress={() => navigation.navigate(ROUTES.CANCELLATION_POLICY)} />
          <MenuItem title="Privacy Policy" icon={Shield} onPress={() => navigation.navigate(ROUTES.PRIVACY_POLICY)} />
          <MenuItem title="Refund Policy" icon={FileText} onPress={() => navigation.navigate(ROUTES.REFUND_POLICY)} />

          <TouchableScale
            onPress={handleLogout}
            className="flex-row items-center justify-center bg-red-50 py-5 rounded-[24px] mt-8 border border-red-100"
          >
            <LogOut size={22} color="#ef4444" strokeWidth={3} />
            <Text className="text-[17px] font-black text-red-500 ml-3 uppercase tracking-widest">Logout</Text>
          </TouchableScale>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({});
