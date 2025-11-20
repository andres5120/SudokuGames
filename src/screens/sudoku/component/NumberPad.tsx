import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
    onPressNumber: (n: number) => void;
    selected?: number | null;
}

const NumberPad: React.FC<Props> = ({ onPressNumber, selected = null }) => {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    return (
        <View style={styles.container}>
            {nums.map(n => (
                <TouchableOpacity
                    key={n}
                    onPress={() => onPressNumber(n)}
                    style={[styles.btn, selected === n && styles.activeBtn]}
                >
                    <Text style={[styles.txt, selected === n && styles.activeTxt]}>{n}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap', justifyContent: 'center',
        marginBottom: 8,
    },
    btn: {
        width: 34,
        height: 34,
        borderRadius: 15,
        backgroundColor: '#e5e5e5ff',
        margin: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeBtn: {
        backgroundColor: '#1464f2',
    },
    txt: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0b265aff',
    },
    activeTxt: { color: '#fff' },
});

export default NumberPad;
