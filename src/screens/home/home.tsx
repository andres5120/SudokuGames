import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GameCard from './components/GameCard';
import colors from '../../theme/colors';
import { RootStackParamList } from '../../interfaces/rootStackParamList';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.row}>
          <GameCard
            title="Crucigrama"
            imageSource={require('../../assets/images/crucigrama.png')}
            onPress={() => navigation.navigate('Crossword')}
          />
          <GameCard
            title="Rompecabezas"
            imageSource={require('../../assets/images/rompecabezas.png')}
            onPress={() => navigation.navigate('Puzzles')}
          />
        </View>
        <View style={[styles.row, styles.topMargin]}>
          <GameCard
            title="Sudoku"
            imageSource={require('../../assets/images/sudoku.png')}
            onPress={() => navigation.navigate('Sudokku')}
          />
        </View>
        <View style={styles.containerVersion} >
          <Text>V0.1.1</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E8EDF5',
    marginTop: 15,
  },
  scrollContent: {
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topMargin:{
    marginTop: 5
  },
  containerVersion:{
    marginTop:20
  }
});

export default HomeScreen;
