// src/theme.ts
import { MD3LightTheme as DefaultTheme, configureFonts } from 'react-native-paper';
import { Platform } from 'react-native';

/**
 * Warna: hijau matang + putih
 * - primary: hijau matang (material green-ish)
 * - background: putih
 * - surface: putih (kartu / surface)
 * - accent: sedikit hijau terang untuk aksen
 */

const colors = {
  primary: '#2E7D32',     // hijau matang (Material Green 700)
  onPrimary: '#FFFFFF',
  background: '#FFFFFF',  // putih
  surface: '#FFFFFF',
  text: '#1B1B1B',        // teks gelap
  disabled: '#9E9E9E',
  placeholder: '#757575',
  backdrop: 'rgba(0,0,0,0.5)',
  accent: '#66BB6A',
};

/**
 * configureFonts untuk menautkan font family agar Paper menggunakan font custom
 * Pastikan font sudah ditambahkan di assets/fonts dan ter-link
 */
const fontConfig = {
  web: {
    regular: { fontFamily: 'Poppins-Regular', fontWeight: '400' as any },
    medium: { fontFamily: 'Poppins-Medium', fontWeight: '500' as any },
    light: { fontFamily: 'Poppins-Regular', fontWeight: '300' as any },
    thin: { fontFamily: 'Poppins-Regular', fontWeight: '100' as any },
  },
  ios: {
    regular: { fontFamily: 'Poppins-Regular', fontWeight: '400' as any },
    medium: { fontFamily: 'Poppins-Medium', fontWeight: '500' as any },
    light: { fontFamily: 'Poppins-Regular', fontWeight: '300' as any },
    thin: { fontFamily: 'Poppins-Regular', fontWeight: '100' as any },
  },
  android: {
    regular: { fontFamily: 'Poppins-Regular', fontWeight: '400' as any },
    medium: { fontFamily: 'Poppins-Medium', fontWeight: '500' as any },
    light: { fontFamily: 'Poppins-Regular', fontWeight: '300' as any },
    thin: { fontFamily: 'Poppins-Regular', fontWeight: '100' as any },
  },
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    surface: colors.surface,
    accent: colors.accent,
    text: colors.text,
    disabled: colors.disabled,
    placeholder: colors.placeholder,
    backdrop: colors.backdrop,
  },
  fonts: configureFonts(fontConfig as any),
  roundness: 10, // radius card/button
};

export default theme;
