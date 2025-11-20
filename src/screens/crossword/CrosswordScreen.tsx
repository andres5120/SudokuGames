import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../interfaces/rootStackParamList';
import colors from '../../theme/colors';


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const CrosswordScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.row}>
          <Text>Crucigrama</Text>
        </View>
        <View>
          <Text>Estoy trabajando para esto...</Text>
        </View>
        <View>
          <Text style={styles.textStyleDelete}>TE AMO MI AMOR.</Text>
        </View>
        <View style={styles.containerDelete}>
          <Text style={styles.textStyleDelete}>Nunca olvides lo especial e importante que eres, tampoco olvides que te amo demaciado.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingStart:15,
    paddingEnd:15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerDelete:{
    justifyContent:'center',
    marginTop:20,
    alignItems:'center',
  },
  textStyleDelete: {
    color: colors.colorDeleteLove,
    fontSize: 18,
  },
});

export default CrosswordScreen;
