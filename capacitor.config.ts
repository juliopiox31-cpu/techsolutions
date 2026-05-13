import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.techsolutions.app',
  appName: 'TechSolutions',
  webDir: 'public',
  server: {
    url: 'https://techsolutions-fn8o.onrender.com',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#ffffff',
  },
};

export default config;
