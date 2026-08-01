import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { chapters } from '../data';
import { ModeToggle, type Mode } from '../components/ModeToggle';
import { ChapterFlow } from '../components/ChapterFlow';
import { ChapterTabs } from '../components/ChapterTabs';

export function ChapterScreen() {
  const [mode, setMode] = useState<Mode>('mz');
  const [activeChapter, setActiveChapter] = useState(1);
  const chapter = useMemo(
    () => chapters.find((c) => c.chapter === activeChapter) ?? chapters[0],
    [activeChapter],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.eyebrow}>MZ 성경 · 시즌1</Text>
        <Text style={styles.title}>{chapter.book}</Text>
      </View>

      <ChapterTabs
        chapters={chapters}
        activeChapter={activeChapter}
        onChange={setActiveChapter}
      />

      <View style={styles.subHeader}>
        <Text style={styles.chapterTitle}>
          {chapter.chapter}장 · {chapter.title}
        </Text>
        <ModeToggle mode={mode} onChange={setMode} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ChapterFlow verses={chapter.verses} mode={mode} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF5C8A',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#26243A',
  },
  subHeader: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 10,
  },
  chapterTitle: {
    fontSize: 14,
    color: '#8B879E',
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 48,
  },
});
