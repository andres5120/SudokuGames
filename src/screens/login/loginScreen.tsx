import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomButton from '../../components/CustomButton';
import colors from '../../theme/colors';
import { signInWithGoogle } from '../../services/auth/authService';
import { RootStackParamList } from '../../interfaces/rootStackParamList';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigation.replace('Home');
    } catch (err) {
      console.error(err);
      console.log('failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Mindful Puzzles</Text>
        <View style={styles.bottom}>
          <CustomButton
            text="Sign in with Google"
            onPress={handleGoogleSignIn}
            backgroundColor="#E5EFFA"
            textColor="#000"
            icon={<AntDesign name="google" size={18} color="#000" />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  title: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primaryText,
    marginTop: 20,
  },
  bottom: {
    alignItems: 'center',
  },
});

export default LoginScreen;
