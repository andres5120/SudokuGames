import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { AuthProvider } from './src/context/auth/AuthContext';
import AppNavigator from './src/navegation/AppNavigator';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  useEffect(() => {
    console.log('configuring google sign in');
    GoogleSignin.configure({
      webClientId:
        '169827444623-v125o9t1mvoh4g595tbqbjh7jfgrj5lv.apps.googleusercontent.com',
    });
  }, []);
  return (
    <SafeAreaProvider>      
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
