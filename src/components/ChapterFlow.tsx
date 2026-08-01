import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Verse } from '../data/types';
import type { Mode } from './ModeToggle';
import { toSuperscript } from '../utils/superscript';

type Props = {
  verses: Verse[];
  mode: Mode;
};

function groupByPara(verses: Verse[]): Verse[][] {
  const groups: Verse[][] = [];
  for (const verse of verses) {
    const last = groups[groups.length - 1];
    if (last && last[0].para === verse.para) {
      last.push(verse);
    } else {
      groups.push([verse]);
    }
  }
  return groups;
}

export function ChapterFlow({ verses, mode }: Props) {
  const groups = useMemo(() => groupByPara(verses), [verses]);
  const isMz = mode === 'mz';

  return (
    <View>
      {groups.map((group) => (
        <Text
          key={group[0].n}
          style={[styles.paragraph, isMz && styles.paragraphMz]}
        >
          {group.map((verse) => (
            <Text key={verse.n}>
              <Text style={[styles.verseNum, isMz && styles.verseNumMz]}>
                {toSuperscript(verse.n)}
              </Text>
              <Text> {isMz ? verse.mz : verse.plain} </Text>
            </Text>
          ))}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 17,
    lineHeight: 29,
    color: '#26243A',
    marginBottom: 22,
  },
  paragraphMz: {
    color: '#4A2B45',
  },
  verseNum: {
    fontSize: 12,
    lineHeight: 29,
    color: '#8B879E',
    fontWeight: '700',
  },
  verseNumMz: {
    color: '#FF5C8A',
  },
});
