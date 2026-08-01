import { genesis1 } from './genesis1';
import { genesis2 } from './genesis2';
import { genesis3 } from './genesis3';
import { genesis4 } from './genesis4';
import { genesis5 } from './genesis5';
import type { Chapter } from './types';

export const chapters: Chapter[] = [genesis1, genesis2, genesis3, genesis4, genesis5];

export type { Chapter, Verse } from './types';
