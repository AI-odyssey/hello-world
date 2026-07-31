import React, { useState } from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { genesis1 } from '../data/genesis1';
import { ModeToggle, type Mode } from '../components/ModeToggle';
import { VerseCard } from '../components/VerseCard';

export function ChapterScreen() {
  const [mode, setMode] = useState<Mode>('mz');
  const chapter = genesis1;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.eyebrow}>MZ 성경 · 시즌1</Text>
        <Text style={styles.title}>
          {chapter.book} {chapter.chapter}장
        </Text>
        <Text style={styles.subtitle}>{chapter.title}</Text>
      </View>

      <ModeToggle mode={mode} onChange={setMode} />

      <FlatList
        data={chapter.verses}
        keyExtractor={(v) => String(v.n)}
        renderItem={({ item }) => <VerseCard verse={item} mode={mode} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
    paddingBottom: 16,
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
  subtitle: {
    fontSize: 14,
    color: '#8B879E',
    marginTop: 2,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 40,
  },
});
