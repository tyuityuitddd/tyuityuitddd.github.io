export type Language = 'zh' | 'en' | 'ja';
export type Translation = { zh: string; en: string; ja: string };
export type Category = 'illustration' | 'game' | 'design';
export type Artwork = { src: string; alt: string; thumbnail?: string; width?: number; height?: number; variants?: {src:string;width:number;height:number;bytes:number}[] };
export type Work = { slug: string; title: Translation; description: Translation; category: Category; images: Artwork[]; video?: string; order: number; published: boolean };
export type Settings = { name: string; brand: string; email: string; avatar: string; avatarImage?: Artwork; bio: Translation; hero: string[] };
export const basePath = '';
export function localUrl(path: string) { return `${basePath}/${path.replace(/^\/+/, '')}`; }
export function mediaUrl(path: string) { return /^https:\/\//.test(path) ? path : localUrl(path); }
export function translated(value: Translation, lang: Language) { return value?.[lang] || value?.zh || ''; }
export function videoEmbed(raw?: string): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:') return null;
    const host = url.hostname.replace(/^www\./, '');
    let id = '';
    if (host === 'youtu.be') id = url.pathname.slice(1);
    if (['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(host)) {
      id = url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)/)?.[1] || '';
    }
    if (/^[\w-]{11}$/.test(id)) return `https://www.youtube-nocookie.com/embed/${id}`;
    if (['vimeo.com','player.vimeo.com'].includes(host)) {
      const vimeo = url.pathname.match(/^\/(?:video\/)?(\d+)\/?$/)?.[1];
      if (vimeo) return `https://player.vimeo.com/video/${vimeo}`;
    }
  } catch { return null; }
  return null;
}
export function safeVideoLink(raw?: string) {
  try { const url = new URL(raw || ''); return url.protocol === 'https:' ? url.href : null; } catch { return null; }
}
export const copy = {
  zh: { works:'作品',about:'關於 / 聯絡',heroTop:'泰迪迪迪 / 自由接案創作者',headline:['讓想像，','有了模樣。'],disciplines:'角色插畫・遊戲美術・視覺設計',explore:'探索作品',scroll:'向下探索',selected:'作品選集',intro:'從一個角色，到一個世界。',all:'全部',illustration:'插畫',game:'遊戲',design:'設計',pieces:'個專案',images:'張作品',more:'查看更多作品',empty:'這個分類尚無作品。',aboutTitle:'你好，我是泰迪迪迪。',contactTitle:'讓我們一起，\n完成下一個想像。',contact:'有合作想法？歡迎來信聊聊。',mail:'聊聊你的想法',back:'返回作品集',overview:'專案介紹',gallery:'作品細節',close:'關閉',previous:'上一張',next:'下一張',original:'查看大圖',video:'觀看影片',videoPlay:'播放影片',skip:'跳至作品',up:'回到頂部',services:['角色插畫','實況主貼圖與插圖','遊戲與品牌視覺'],nextWork:'下一個專案',view:'查看作品',language:'選擇語言',footer:'插畫・遊戲・視覺設計' },
  en: { works:'Work',about:'About / Contact',heroTop:'TDDD / INDEPENDENT CREATIVE',headline:['Ideas into','characters.'],disciplines:'Illustration · Game art · Visual design',explore:'Explore work',scroll:'Scroll to explore',selected:'Selected work',intro:'From a character to a whole world.',all:'All',illustration:'Illustration',game:'Games',design:'Design',pieces:'projects',images:'images',more:'Show more work',empty:'No work in this category yet.',aboutTitle:'Hello, I’m TDDD.',contactTitle:'Let’s make your\nnext idea visible.',contact:'Have a project in mind? Let’s talk.',mail:'Get in touch',back:'Back to work',overview:'About the project',gallery:'Project gallery',close:'Close',previous:'Previous image',next:'Next image',original:'View full image',video:'Watch video',videoPlay:'Play video',skip:'Skip to work',up:'Back to top',services:['Character illustration','Streamer emotes & illustrations','Game & brand visuals'],nextWork:'Next project',view:'View project',language:'Choose language',footer:'Illustration · Games · Visual design' },
  ja: { works:'作品',about:'プロフィール / 連絡',heroTop:'TDDD / フリーランスクリエイター',headline:['想像を、','かたちに。'],disciplines:'イラスト・ゲームアート・ビジュアルデザイン',explore:'作品を見る',scroll:'スクロールして見る',selected:'制作実績',intro:'ひとりのキャラクターから、ひとつの世界へ。',all:'すべて',illustration:'イラスト',game:'ゲーム',design:'デザイン',pieces:'プロジェクト',images:'点',more:'もっと見る',empty:'このカテゴリーの作品はまだありません。',aboutTitle:'はじめまして、TDDD です。',contactTitle:'次のアイデアを、\n一緒にかたちに。',contact:'制作のご相談は、メールでお気軽にどうぞ。',mail:'お問い合わせ',back:'作品一覧へ',overview:'プロジェクトについて',gallery:'作品ギャラリー',close:'閉じる',previous:'前の画像',next:'次の画像',original:'大きな画像を見る',video:'動画を見る',videoPlay:'動画を再生',skip:'作品へスキップ',up:'トップへ戻る',services:['キャラクターイラスト','配信者向けスタンプ・イラスト','ゲーム・ブランドビジュアル'],nextWork:'次のプロジェクト',view:'作品を見る',language:'言語を選択',footer:'イラスト・ゲーム・ビジュアルデザイン' },
} as const;
