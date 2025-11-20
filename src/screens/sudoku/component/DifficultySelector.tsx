import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { PropsDifficultSelector } from '../interfaces/props-difficult-selector.interface';
import { Difficulty } from '../constants/sudoku.constants';


const mapLabel: Record<string, string> = {
  facil: 'Fácil',
  medio: 'Medio',
  dificil: 'Difícil',
  experto: 'Experto',
};

const DifficultySelector: React.FC<PropsDifficultSelector> = ({ 
  selected, 
  onSelect, 
  unlockedDifficulties,
  getUnlockMessage 
}) => {
  const keys: Difficulty[] = ['facil', 'medio', 'dificil', 'experto'];

  const handleSelect = (difficulty: Difficulty) => {
    if (unlockedDifficulties.includes(difficulty)) {
      onSelect(difficulty);
    } else {
      // Mostrar mensaje de requisitos
      Alert.alert(
        'Modo bloqueado',
        getUnlockMessage(difficulty),
        [{ text: 'Entendido', style: 'default' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      {keys.map(difficulty => {
        const isUnlocked = unlockedDifficulties.includes(difficulty);
        const isSelected = selected === difficulty;
        
        return (
          <TouchableOpacity
            key={difficulty}
            onPress={() => handleSelect(difficulty)}
            style={[
              styles.btn,
              isSelected && styles.active,
              !isUnlocked && styles.locked,
            ]}
           // disabled={!isUnlocked}
          >
            <Text 
              style={[
                styles.txt,
                isSelected && styles.activeTxt,
                !isUnlocked && styles.lockedTxt,
              ]}
            >
              {mapLabel[difficulty]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    backgroundColor: '#e6eefc', 
    borderRadius: 20, 
    padding: 4, 
    marginBottom: 8 
  },
  btn: { 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    marginHorizontal: 4, 
    borderRadius: 16 
  },
  active: { 
    backgroundColor: '#1464f2' 
  },
  locked: { 
    backgroundColor: '#f0f0f0',
    opacity: 0.6 
  },
  txt: { 
    color: '#123472', 
    fontWeight: '700' 
  },
  activeTxt: { 
    color: '#fff' 
  },
  lockedTxt: { 
    color: '#999',
    fontWeight: '400' 
  },
});

export default DifficultySelector;