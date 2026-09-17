import { getJournalPosts } from '@/lib/content';
import { JournalIndex } from '@/components/journal';
export const metadata={title:'Godot 開發日誌 — TDDD',description:'Godot 的開發筆記、實作過程與學習紀錄。'};
export default function Page(){return <JournalIndex posts={getJournalPosts()}/>;}
