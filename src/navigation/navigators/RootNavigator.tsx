import { StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import ROUTES from '../routes/Routes';
import BottomTabNavigator from './BottomTabNavigator';
import AuthStackNavigator from './AuthStackNavigator';
import { NavigationState } from '@react-navigation/native';

import {
  navigationRef,
  parseAndLogRoute,
  setIsNavigationReady,
} from '../routes/Navigation';
import Logger from '../../utils/Logger';
import { useAuth } from '../../contexts/AuthContext';
import { Search } from 'lucide-react-native';
import SearchScreen from '../../screens/SearchScreen';
import RideConfirmationScreen from '../../screens/RideConfirmationScreen';
import BookConfirmationScreen from '../../screens/BookConfirmationScreen';
import ProfileCompletionScreen from '../../screens/ProfileCompletionScreen';
import BookingsScreen from '../../screens/BookingsScreen';
import InvoiceScreen from '../../screens/InvoiceScreen';
import SavedAddressesScreen from '../../screens/SavedAddressesScreen';
import AddEditAddressScreen from '../../screens/AddEditAddressScreen';
import WalletScreen from '../../screens/WalletScreen';
import AddMoneyScreen from '../../screens/AddMoneyScreen';
import TransactionHistoryScreen from '../../screens/TransactionHistoryScreen';
import RatingScreen from '../../screens/RatingScreen';
import ReviewsScreen from '../../screens/ReviewsScreen';
import NotificationsScreen from '../../screens/NotificationsScreen';
import HelpSupportScreen from '../../screens/HelpSupportScreen';
import FAQScreen from '../../screens/FAQScreen';
import TicketScreen from '../../screens/TicketScreen';
import TermsConditionsScreen from '../../screens/TermsConditionsScreen';
import PrivacyPolicyScreen from '../../screens/PrivacyPolicyScreen';
import CancellationPolicyScreen from '../../screens/CancellationPolicyScreen';
import PromoCodesScreen from '../../screens/PromoCodesScreen';
import KYCScreen from '../../screens/KYCScreen';
import DamageReportScreen from '../../screens/DamageReportScreen';
import ProfileEditScreen from '../../screens/ProfileEditScreen';
import RideHistoryScreen from '../../screens/RideHistoryScreen';
import ExtendBookingScreen from '../../screens/ExtendBookingScreen';
import RefundPolicyScreen from '../../screens/RefundPolicyScreen';

const AppContent = () => {
  const Stack = createNativeStackNavigator();
  const { isAuthenticated } = useAuth(); // Replace with actual authentication logic
  const handleStateChange = (state: NavigationState | undefined) => {
    Logger.info('Navigation state changed', { state, isAuthenticated });
    parseAndLogRoute(state);
  };
  useEffect(() => {
    if (navigationRef.current?.isReady()) {
      Logger.info('Navigation is ready from');
    }
  }, []);
  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={handleStateChange}
      onReady={setIsNavigationReady}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name={ROUTES.MAIN_TABS}
              component={BottomTabNavigator}
            />
            <Stack.Screen name={ROUTES.SEARCH} component={SearchScreen} />

            <Stack.Screen
              name={ROUTES.RIDECONFIRMATION}
              component={RideConfirmationScreen}
            />
            <Stack.Screen
              name={ROUTES.BOOKCONFIMRAITON}
              component={BookConfirmationScreen}
            />
            <Stack.Screen
              name={ROUTES.PROFILE_COMPLETION}
              component={ProfileCompletionScreen}
            />
            <Stack.Screen name={ROUTES.BOOKINGS} component={BookingsScreen} />
            <Stack.Screen name={ROUTES.INVOICE} component={InvoiceScreen} />
            <Stack.Screen
              name={ROUTES.SAVED_ADDRESSES}
              component={SavedAddressesScreen}
            />
            <Stack.Screen
              name={ROUTES.ADD_EDIT_ADDRESS}
              component={AddEditAddressScreen}
            />
            <Stack.Screen name={ROUTES.WALLET} component={WalletScreen} />
            <Stack.Screen name={ROUTES.ADD_MONEY} component={AddMoneyScreen} />
            <Stack.Screen
              name={ROUTES.TRANSACTION_HISTORY}
              component={TransactionHistoryScreen}
            />
            <Stack.Screen name={ROUTES.RATING} component={RatingScreen} />
            <Stack.Screen name={ROUTES.REVIEWS} component={ReviewsScreen} />
            <Stack.Screen
              name={ROUTES.NOTIFICATIONS}
              component={NotificationsScreen}
            />
            <Stack.Screen
              name={ROUTES.HELP_SUPPORT}
              component={HelpSupportScreen}
            />
            <Stack.Screen name={ROUTES.FAQ} component={FAQScreen} />
            <Stack.Screen name={ROUTES.RAISE_TICKET} component={TicketScreen} />
            <Stack.Screen
              name={ROUTES.TERMS_CONDITIONS}
              component={TermsConditionsScreen}
            />
            <Stack.Screen
              name={ROUTES.PRIVACY_POLICY}
              component={PrivacyPolicyScreen}
            />
            <Stack.Screen
              name={ROUTES.CANCELLATION_POLICY}
              component={CancellationPolicyScreen}
            />
            <Stack.Screen
              name={ROUTES.PROMO_CODES}
              component={PromoCodesScreen}
            />
            <Stack.Screen
              name={ROUTES.KYC_VERIFICATION}
              component={KYCScreen}
            />
            <Stack.Screen
              name={ROUTES.DAMAGE_REPORT}
              component={DamageReportScreen}
            />
            <Stack.Screen
              name={ROUTES.PROFILE_EDIT}
              component={ProfileEditScreen}
            />
            <Stack.Screen
              name={ROUTES.RIDE_HISTORY}
              component={RideHistoryScreen}
            />
            <Stack.Screen
              name={ROUTES.EXTEND_BOOKING}
              component={ExtendBookingScreen}
            />
            <Stack.Screen
              name={ROUTES.REFUND_POLICY}
              component={RefundPolicyScreen}
            />
          </>
        ) : (
          <Stack.Screen name={ROUTES.ROOT} component={AuthStackNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const RootNavigator = () => {
  return <AppContent />;
};
export default RootNavigator;

const styles = StyleSheet.create({});
