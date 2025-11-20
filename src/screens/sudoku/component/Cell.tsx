import React, { useEffect } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PropsCell } from '../interfaces/props-cell.interface';



const Cell: React.FC<PropsCell & { borderStyles?: any }> = ({
  value,
  isInitial,
  isValidated = false, // Valor por defecto
  isSelected,
  size,
  onPress,
  borderStyles,
  disabled
}) => {
  return (
    <TouchableOpacity
      disabled={disabled || isInitial || isValidated} // Deshabilitar si es inicial o validada
      style={[
        styles.cell,
        { width: size, height: size },
        borderStyles,
        isSelected && styles.selected,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.text, isInitial && styles.initial]}>
        {value !== 0 ? value : ''}
      </Text>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  cell: {
    borderWidth: 0.5,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: '#cce5ff',
  },
  text: {
    fontSize: 18,
    color: '#1CBD41',
  },
  initial: {
    fontWeight: 'bold',
    color: '#123472',
  },
});

export default Cell;
