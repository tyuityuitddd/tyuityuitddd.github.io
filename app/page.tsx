import PortfolioHome from '@/components/circular-gallery';
import { getWorks, getJournalPosts, settings } from '@/lib/content';
export default function Home() { return <PortfolioHome works={getWorks()} settings={settings} posts={getJournalPosts().slice(0,3)}/>; }
