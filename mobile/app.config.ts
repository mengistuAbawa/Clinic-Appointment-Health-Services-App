// app.config.ts — Dynamic Expo config reading EXPO_PUBLIC_API_URL from env
import { ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext) => ({
  ...config,
  name: 'ClinicApp',
  slug: 'clinic-app',
  version: '1.0.0',
  icon: './assets/icon.png',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  scheme: 'clinicapp',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#176B5B',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.clinicapp.mobile',
    infoPlist: {
      NSLocationWhenInUseUsageDescription: 'We use your location to sort clinics by distance when you choose Near me.',
      NSPhotoLibraryUsageDescription: 'Choose a photo to use as your profile avatar.',
      NSCameraUsageDescription: 'Take a photo to use as your profile avatar.',
    },
  },
  android: {
    adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#176B5B' },
    package: 'com.clinicapp.mobile',
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    ['expo-location', { locationWhenInUsePermission: 'We use your location to sort clinics by distance when you choose Near me.' }],
    'expo-notifications',
    ['expo-image-picker', {
      photosPermission: 'Choose a photo to use as your profile avatar.',
      cameraPermission: 'Take a photo to use as your profile avatar.',
    }],
    ['react-native-maps', { androidGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY }],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    eas: {
    },
  },
});
