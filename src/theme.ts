// src/theme.ts
import { MD3LightTheme as DefaultTheme, configureFonts } from 'react-native-paper';

/**
 * COLOR SCHEME: Black & White Minimalist
 * Simple, clean, elegant.
 */
const colors = {
  primary: '#000000',       // hitam sebagai warna utama
  onPrimary: '#FFFFFF',     // teks di atas warna primary
  background: '#FFFFFF',    // putih bersih
  surface: '#FFFFFF',       // card background
  text: '#000000',          // teks hitam
  placeholder: '#8A8A8A',   // abu netral
  disabled: '#C4C4C4',      // abu terang
  outline: '#D0D0D0',       // border input / card
  backdrop: 'rgba(0,0,0,0.5)',
};

/**
 * Font configuration – Poppins
 */
const fontConfig = {
  web: {
    regular: { fontFamily: 'Poppins-Regular', fontWeight: '400' },
    medium: { fontFamily: 'Poppins-Medium', fontWeight: '500' },
    light: { fontFamily: 'Poppins-Light', fontWeight: '300' },
    thin: { fontFamily: 'Poppins-Thin', fontWeight: '100' },
  },
  ios: {
    regular: { fontFamily: 'Poppins-Regular', fontWeight: '400' },
    medium: { fontFamily: 'Poppins-Medium', fontWeight: '500' },
    light: { fontFamily: 'Poppins-Light', fontWeight: '300' },
    thin: { fontFamily: 'Poppins-Thin', fontWeight: '100' },
  },
  android: {
    regular: { fontFamily: 'Poppins-Regular', fontWeight: '400' },
    medium: { fontFamily: 'Poppins-Medium', fontWeight: '500' },
    light: { fontFamily: 'Poppins-Light', fontWeight: '300' },
    thin: { fontFamily: 'Poppins-Thin', fontWeight: '100' },
  },
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...colors,
  },
  fonts: configureFonts(fontConfig),
  roundness: 10, // tetap modern & smooth
};

export default theme;
