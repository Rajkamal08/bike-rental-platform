/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, useColorScheme } from 'react-native';
import {
  SafeAreaProvider,
  // useSafeAreaInsets,
} from 'react-native-safe-area-context';

import './global.css';

import RootNavigator from './src/navigation/navigators/RootNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { AddressProvider } from './src/contexts/AddressContext';
import { WalletProvider } from './src/contexts/WalletContext';
import { RatingProvider } from './src/contexts/RatingContext';
import { NotificationProvider } from './src/contexts/NotificationContext';
import { PromoProvider } from './src/contexts/PromoContext';
import { KYCProvider } from './src/contexts/KYCContext';
import { StripeProvider } from '@stripe/stripe-react-native';
function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  // const safePadding = '5%';

  return (
    <AuthProvider>
      <StripeProvider
        publishableKey="pk_test_51SmKpL2UzibEmhqC85TJUSVra0AX2iLXAMI1sQ6ZnkI5kC0NlSiNLsloH8izXV8qxF4ehNg7XzUREi1ydhpfSYeV00jqaOeAei"
        merchantIdentifier="merchant.com.rentride" // required for Apple Pay
      >
        <AddressProvider>
          <WalletProvider>
            <RatingProvider>
              <NotificationProvider>
                <PromoProvider>
                  <KYCProvider>
                    <RootNavigator />
                  </KYCProvider>
                </PromoProvider>
              </NotificationProvider>
            </RatingProvider>
          </WalletProvider>
        </AddressProvider>
      </StripeProvider>
    </AuthProvider>
  );
}
export default App;
