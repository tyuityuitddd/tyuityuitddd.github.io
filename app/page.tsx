import PortfolioHome from '@/components/portfolio-home';
import { getWorks, settings } from '@/lib/content';
export default function Home() { return <PortfolioHome works={getWorks()} settings={settings}/>; }
