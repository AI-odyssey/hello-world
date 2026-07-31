import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Verse } from '../data/genesis1';
import type { Mode } from './ModeToggle';

type Props = {
  verse: Verse;
  mode: Mode;
};

export function VerseCard({ verse, mode }: Props) {
  const isMz = mode === 'mz';
  return (
    <View style={[styles.card, isMz && styles.cardMz]}>
      <View style={[styles.badge, isMz && styles.badgeMz]}>
        <Text style={[styles.badgeText, isMz && styles.badgeTextMz]}>
          {verse.n}
        </Text>
      </View>
      <Text style={[styles.body, isMz && styles.bodyMz]}>
        {isMz ? verse.mz : verse.plain}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#F7F7FB',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  cardMz: {
    backgroundColor: '#FFF0F5',
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#4B3FA8',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  badgeMz: {
    backgroundColor: '#FF5C8A',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  badgeTextMz: {
    color: '#fff',
  },
  body: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#26243A',
  },
  bodyMz: {
    color: '#5A2340',
    fontWeight: '500',
  },
});
