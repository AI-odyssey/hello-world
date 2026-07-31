import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type Mode = 'plain' | 'mz';

type Props = {
  mode: Mode;
  onChange: (mode: Mode) => void;
};

export function ModeToggle({ mode, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <Pressable
        style={[styles.btn, mode === 'plain' && styles.btnActivePlain]}
        onPress={() => onChange('plain')}
      >
        <Text style={[styles.text, mode === 'plain' && styles.textActive]}>
          쉬운말
        </Text>
      </Pressable>
      <Pressable
        style={[styles.btn, mode === 'mz' && styles.btnActiveMz]}
        onPress={() => onChange('mz')}
      >
        <Text style={[styles.text, mode === 'mz' && styles.textActive]}>
          🔥 MZ 버전
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: '#EDEBFB',
    borderRadius: 999,
    padding: 4,
    alignSelf: 'center',
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  btnActivePlain: {
    backgroundColor: '#4B3FA8',
  },
  btnActiveMz: {
    backgroundColor: '#FF5C8A',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B3FA8',
  },
  textActive: {
    color: '#FFFFFF',
  },
});
