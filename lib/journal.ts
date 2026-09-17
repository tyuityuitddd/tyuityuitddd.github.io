import type { Artwork, Language } from './portfolio';

export type JournalSection = { heading?: string; text?: string; image?: string; alt?: string; caption?: string; video?: string; artwork?: Artwork };
export type JournalPost = { slug: string; title: string; excerpt: string; date: string; updated?: string; tags?: string[]; cover?: string; coverAlt?: string; coverImage?: Artwork; sections: JournalSection[]; published: boolean; retrospective?: boolean; recordedOn?: string; period?: string; sourceNote?: string };
export const journalCopy = {
  zh: { timeline:'依開發順序閱讀', retrospective:'開發回顧', recorded:'補記於', historyNote:'前面幾篇是我回頭補寫的開發筆記，從七月開始，記下每個階段做了什麼。', title:'Godot 開發日誌', intro:'製作中的想法、嘗試，與一步一步累積的進度。', all:'所有日誌', latest:'最近的開發筆記', read:'閱讀日誌', back:'返回日誌', updated:'更新於', empty:'第一篇開發筆記準備中。', video:'觀看開發影片', next:'下一篇', original:'文章以作者撰寫的原文呈現。' },
  en: { timeline:'Read from the beginning', retrospective:'Retrospective', recorded:'Written on', historyNote:'I wrote up these earlier entries to look back at the project, starting in July.', title:'Godot Devlog', intro:'Ideas, experiments, and progress from the work in progress.', all:'All entries', latest:'Recent development notes', read:'Read entry', back:'Back to devlog', updated:'Updated', empty:'The first development note is on its way.', video:'Watch development video', next:'Next entry', original:'Entries are shown in the language they were written in.' },
  ja: { timeline:'開発の順番で読む', retrospective:'開発の振り返り', recorded:'執筆日', historyNote:'初期の記事は、7月からの制作を振り返って書いた開発ノートです。', title:'Godot 開発日誌', intro:'制作中のアイデア、試行錯誤、少しずつ積み重なる進捗。', all:'すべての日誌', latest:'最近の開発ノート', read:'日誌を読む', back:'日誌一覧へ', updated:'更新日', empty:'最初の開発ノートを準備中です。', video:'開発動画を見る', next:'次の日誌', original:'記事は執筆時の言語で表示されます。' },
};
export function journalDate(date:string,lang:Language) {
  return new Intl.DateTimeFormat(lang==='zh'?'zh-TW':lang==='ja'?'ja-JP':'en-US',{year:'numeric',month:'short',day:'numeric',timeZone:'UTC'}).format(new Date(`${date}T12:00:00Z`));
}
