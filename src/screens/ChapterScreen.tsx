import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { chapters } from '../data';
import { ChapterFlow } from '../components/ChapterFlow';
import { ChapterTabs } from '../components/ChapterTabs';

export function ChapterScreen() {
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

      <Text style={styles.chapterTitle}>
        {chapter.chapter}장 · {chapter.title}
      </Text>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ChapterFlow verses={chapter.verses} />
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
  chapterTitle: {
    fontSize: 14,
    color: '#8B879E',
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 48,
  },
});
