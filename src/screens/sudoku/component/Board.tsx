import React, { use, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Cell from './Cell';
import { PropsBoard } from '../interfaces/props-board.interface';


const Board: React.FC<PropsBoard> = ({ board, initialBoard, selectedCell, onCellPress, disabled, validatedCells }) => {
  const screenWidth = Dimensions.get('window').width;
  const boardPadding = 16; // margen para que no pegue con los bordes
  const boardWidth = screenWidth - boardPadding * 2;
  const cellSize = Math.floor(boardWidth / 9);

  return (
    <View style={[styles.boardContainer, { padding: boardPadding }]}>
      <View style={[styles.board, { width: cellSize * 9, height: cellSize * 9 }]}>
        {board.map((row, r) => (
          <View key={r} style={[styles.row, disabled ? styles.textDisabled : null]}>
            {row.map((cell, c) => {
              const isInitial = !!(initialBoard && initialBoard[r] && initialBoard[r][c] !== 0);
              const cellKey = `${r}-${c}`;
              const isValidated = validatedCells.has(cellKey);
              const isSelected = selectedCell?.row === r && selectedCell?.col === c;

              // Determinar bordes gruesos
              const borderStyles: any = {};
              if ((r + 1) % 3 === 0 && r !== 8) borderStyles.borderBottomWidth = 3;
              if ((c + 1) % 3 === 0 && c !== 8) borderStyles.borderRightWidth = 3;

              return (
                <Cell
                  key={c}
                  value={cell}
                  isInitial={isInitial}
                  isValidated={isValidated} // Nueva prop
                  disabled={disabled}
                  isSelected={isSelected}
                  size={cellSize}
                  onPress={() => onCellPress(r, c)}
                  borderStyles={borderStyles}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: {
    borderWidth: 1,
    borderColor: '#000',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#ffffffff',
  },
  textDisabled: {
    backgroundColor: '#cacacaff',
  },

});

export default Board;
