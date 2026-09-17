import { notFound } from 'next/navigation';
import { getJournalPosts } from '@/lib/content';
import { JournalArticle } from '@/components/journal';
export function generateStaticParams(){return getJournalPosts().map(post=>({slug:post.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const post=getJournalPosts().find(p=>p.slug===slug);return {title:post?`${post.title} — TDDD`:'TDDD',description:post?.excerpt};}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const posts=getJournalPosts();const index=posts.findIndex(p=>p.slug===slug);if(index<0)notFound();return <JournalArticle post={posts[index]} next={posts[index+1]||null}/>;}
