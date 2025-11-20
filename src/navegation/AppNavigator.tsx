import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/login/loginScreen';
import { useAuth } from '../context/auth/AuthContext';
import HomeScreen from '../screens/home/home';
import SplashScreen from '../screens/splash/SplashScreen';
import { RootStackParamList } from '../interfaces/rootStackParamList';
import CrosswordScreen from '../screens/crossword/CrosswordScreen';
import PuzzlesScreen from '../screens/puzzles/PuzzlesScreen';
import SudokuGameScreen from '../screens/sudoku/SudokuGameScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) return <SplashScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? 'Home' : 'Login'}
        screenOptions={{ headerShown: false }}
      >
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Crossword" component={CrosswordScreen} />
            <Stack.Screen name="Puzzles" component={PuzzlesScreen} />
            <Stack.Screen name="Sudokku" component={SudokuGameScreen} />
            {/*             <Stack.Screen name="Riddles" component={RiddlesScreen} />
            <Stack.Screen name="Hangman" component={HangmanScreen} /> */}
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
