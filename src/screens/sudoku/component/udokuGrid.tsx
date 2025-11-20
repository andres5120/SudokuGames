// src/components/SudokuGrid.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SudokuGridProps } from '../interfaces/props-grid.interface';


const SudokuGrid: React.FC<SudokuGridProps> = ({ grid, selectedCell, onCellPress }) => {
  return (
    <View style={styles.container}>
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={[styles.row, (rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? styles.rowBorder : null]}>
          {row.map((cell, colIndex) => {
            const isSelected =
              selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
            return (
              <TouchableOpacity
                key={colIndex}
                style={[
                  styles.cell,
                  (colIndex + 1) % 3 === 0 && colIndex !== 8 ? styles.colBorder : null,
                  isSelected && styles.selectedCell,
                ]}
                onPress={() => onCellPress(rowIndex, colIndex)}
              >
                <Text style={styles.cellText}>
                  {cell !== 0 ? cell : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: '#000',
  },
  row: {
    flexDirection: 'row',
  },
  rowBorder: {
    borderBottomWidth: 2,
    borderColor: '#000',
  },
  colBorder: {
    borderRightWidth: 2,
    borderColor: '#000',
  },
  cell: {
    width: 40,
    height: 40,
    borderWidth: 0.5,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCell: {
    backgroundColor: '#d0e6ff',
  },
  cellText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SudokuGrid;
