import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Verse } from '../data/types';
import { toSuperscript } from '../utils/superscript';
import { splitDialogue } from '../utils/dialogue';

type Props = {
  verses: Verse[];
};

type NarrationPart = { verseNum: number | null; text: string };
type Block =
  | { type: 'narration'; parts: NarrationPart[] }
  | { type: 'quote'; verseNum: number | null; text: string };

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

function buildBlocks(verses: Verse[]): Block[] {
  const blocks: Block[] = [];
  let narration: NarrationPart[] | null = null;

  for (const verse of verses) {
    const segments = splitDialogue(verse.mz);
    let firstSegment = true;

    for (const segment of segments) {
      const verseNum = firstSegment ? verse.n : null;
      firstSegment = false;

      if (segment.type === 'narration') {
        if (!narration) narration = [];
        narration.push({ verseNum, text: segment.text });
      } else {
        if (narration) {
          blocks.push({ type: 'narration', parts: narration });
          narration = null;
        }
        blocks.push({ type: 'quote', verseNum, text: segment.text });
      }
    }
  }
  if (narration) blocks.push({ type: 'narration', parts: narration });

  return blocks;
}

export function ChapterFlow({ verses }: Props) {
  const groups = useMemo(() => groupByPara(verses), [verses]);

  return (
    <View>
      {groups.map((group) => {
        const blocks = buildBlocks(group);
        return (
          <View key={group[0].n} style={styles.paraGroup}>
            {blocks.map((block, i) =>
              block.type === 'narration' ? (
                <Text key={i} style={styles.narration}>
                  {block.parts.map((part, j) => (
                    <Text key={j}>
                      {part.verseNum !== null && (
                        <Text style={styles.verseNum}>
                          {toSuperscript(part.verseNum)}
                        </Text>
                      )}
                      <Text> {part.text} </Text>
                    </Text>
                  ))}
                </Text>
              ) : (
                <Text key={i} style={styles.quoteLine}>
                  {block.verseNum !== null && (
                    <Text style={styles.verseNumQuote}>
                      {toSuperscript(block.verseNum)}
                    </Text>
                  )}
                  <Text style={styles.quoteText}>
                    {'“'}
                    {block.text}
                    {'”'}
                  </Text>
                </Text>
              ),
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  paraGroup: {
    marginBottom: 24,
  },
  narration: {
    fontSize: 16.5,
    lineHeight: 27,
    color: '#3A3650',
  },
  verseNum: {
    fontSize: 11,
    lineHeight: 27,
    color: '#C3BFD6',
    fontWeight: '700',
  },
  quoteLine: {
    fontSize: 16.5,
    lineHeight: 26,
    color: '#B0316B',
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 6,
    marginLeft: 14,
  },
  verseNumQuote: {
    fontSize: 11,
    lineHeight: 26,
    color: '#FF9DBC',
    fontWeight: '700',
  },
  quoteText: {
    fontWeight: '700',
  },
});
