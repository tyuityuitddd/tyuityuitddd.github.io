import { localUrl } from '@/lib/portfolio';
export default function NotFound(){return <main className="not-found"><p className="eyebrow">TDDD / 404</p><h1>這個頁面不存在。</h1><p>Page not found / ページが見つかりません。</p><a className="pill-link" href={localUrl('')}>回到作品集 / Home ↗</a></main>}
