import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { GameCardProps } from '../types/GameCard.interface';

const GameCard: React.FC<GameCardProps> = ({ title, imageSource, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    margin: 10,
    width: 120,
  },
  imageContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#0D80F2',
    borderRadius: 20,
    marginBottom: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Poppins-Regular',
  },
});

export default GameCard;
