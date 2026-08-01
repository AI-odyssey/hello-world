// 텍스트 안에 있는 큰따옴표(" ") 구간을 "대사"로, 나머지를 "서술"로 분리한다.
// 작은따옴표('X')는 이름표(낮/밤/땅 같은 라벨)라서 대사로 취급하지 않고 그대로 둔다.

export type Segment =
  | { type: 'narration'; text: string }
  | { type: 'quote'; text: string };

export function splitDialogue(text: string): Segment[] {
  const segments: Segment[] = [];
  const regex = /"([^"]+)"/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const before = text.slice(lastIndex, match.index).trim();
    if (before) segments.push({ type: 'narration', text: before });
    segments.push({ type: 'quote', text: match[1].trim() });
    lastIndex = regex.lastIndex;
  }
  const rest = text.slice(lastIndex).trim();
  if (rest) segments.push({ type: 'narration', text: rest });

  return segments;
}
