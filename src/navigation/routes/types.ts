import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import ROUTES from './ROUTES';

// Root stack params
export type RootStackParamList = {
  [ROUTES.ROOT]: undefined;
  [ROUTES.LOGIN]: undefined;
  [ROUTES.SIGNUP]: undefined;
  [ROUTES.MAIN_TABS]: { screen?: string } | undefined;
  [ROUTES.HOME]: undefined;
  [ROUTES.SUBSCRIPTION]: undefined;
  [ROUTES.MENU]: undefined;
  [ROUTES.SEARCH]: {
    pickupDate: string;
    pickupTime: string;
    dropoffDate: string;
    dropoffTime: string;
  };
  [ROUTES.OTP]: { sessionId: string; phone: string; isLogin?: boolean };
  [ROUTES.PHONE_NUMBER]: undefined;
  [ROUTES.PROFILE_COMPLETION]: { phone: string };
  [ROUTES.RIDECONFIRMATION]: {
    selectedVehicle: any;
    pickupDate: string;
    pickupTime: string;
    dropoffDate: string;
    dropoffTime: string;
    location: string;
  };
  [ROUTES.BOOKCONFIMRAITON]: { booking: any };
  [ROUTES.UPDATEPROFILE]: undefined;
  [ROUTES.BOOKINGS]: undefined;
  [ROUTES.INVOICE]: { booking: any };
  [ROUTES.SAVED_ADDRESSES]: undefined;
  [ROUTES.ADD_EDIT_ADDRESS]: { address?: any };
  [ROUTES.WALLET]: undefined;
  [ROUTES.ADD_MONEY]: undefined;
  [ROUTES.TRANSACTION_HISTORY]: undefined;
  [ROUTES.RATING]: { booking: any };
  [ROUTES.REVIEWS]: { vehicleId: string; vehicleName: string };
  [ROUTES.NOTIFICATIONS]: undefined;
  [ROUTES.HELP_SUPPORT]: undefined;
  [ROUTES.FAQ]: undefined;
  [ROUTES.RAISE_TICKET]: undefined;
  [ROUTES.TERMS_CONDITIONS]: undefined;
  [ROUTES.PRIVACY_POLICY]: undefined;
  [ROUTES.CANCELLATION_POLICY]: undefined;
  [ROUTES.REFUND_POLICY]: undefined;
  [ROUTES.KYC_VERIFICATION]: undefined;
  [ROUTES.PROMO_CODES]: undefined;
  [ROUTES.DAMAGE_REPORT]: { booking: any };
  [ROUTES.RIDE_HISTORY]: undefined;
  [ROUTES.PROFILE_EDIT]: undefined;
  [ROUTES.EXTEND_BOOKING]: { booking: any };
};
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
