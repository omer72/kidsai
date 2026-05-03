import type { CapacitorConfig } from '@capacitor/cli';

const isDev = process.env.NODE_ENV !== 'production';

const config: CapacitorConfig = {
  appId: 'com.kidai.app',
  appName: 'Kidai',
  webDir: '.next/static',
  server: isDev
    ? { url: 'http://localhost:3000', cleartext: true }
    : undefined,
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    backgroundColor: '#F7F3EC',
    scrollEnabled: false,
  },
};

export default config;
