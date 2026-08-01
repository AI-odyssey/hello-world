import React from 'react';
import { ScrollView, Pressable, StyleSheet, Text } from 'react-native';
import type { Chapter } from '../data/types';

type Props = {
  chapters: Chapter[];
  activeChapter: number;
  onChange: (chapter: number) => void;
};

export function ChapterTabs({ chapters, activeChapter, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.wrap}
    >
      {chapters.map((c) => {
        const active = c.chapter === activeChapter;
        return (
          <Pressable
            key={c.chapter}
            style={[styles.tab, active && styles.tabActive]}
            onPress={() => onChange(c.chapter)}
          >
            <Text style={[styles.tabText, active && styles.tabTextActive]}>
              {c.chapter}장
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 4,
  },
  tab: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#F7F7FB',
  },
  tabActive: {
    backgroundColor: '#26243A',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B879E',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
});
