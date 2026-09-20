import './globals.css';
import './motion.css';
import './framebook.css';
import { localUrl } from '@/lib/portfolio';
import { SiteMotion } from '@/components/site-motion';
export const metadata = {
  title: '泰迪迪迪 TDDD — 插畫・遊戲・視覺設計',
  description: '泰迪迪迪 TDDD 的創作作品集。角色插畫、遊戲美術與視覺設計，探索作品並洽詢合作。',
  icons: { icon: localUrl('favicon.png') },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-Hant"><body>{children}<SiteMotion/></body></html>;
}
