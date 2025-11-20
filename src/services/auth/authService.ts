import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

export const signInWithGoogle = async () => {
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();
  const googleCredential = auth.GoogleAuthProvider.credential(userInfo.data?.idToken ?? null);
  return auth().signInWithCredential(googleCredential);
};

export const signOut = async () => {
  await auth().signOut();
  await GoogleSignin.signOut();
};
