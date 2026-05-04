import type { CapacitorConfig } from '@capacitor/cli';

const isDev = process.env.NODE_ENV !== 'production';

const config: CapacitorConfig = {
  appId: 'com.kidai.app',
  appName: 'Kidai',
  webDir: 'public',
  server: {
    url: isDev ? 'http://localhost:3000' : 'https://kidsai-seven.vercel.app',
    cleartext: isDev,
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    backgroundColor: '#F7F3EC',
    scrollEnabled: false,
  },
};

export default config;
