import { notFound } from 'next/navigation';
import { getWorks } from '@/lib/content';
import WorkDetail from '@/components/work-detail';

export function generateStaticParams() { return getWorks().map(work=>({slug:work.slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params;const work=getWorks().find(work=>work.slug===slug);
 return {title:work?`${work.title.zh} — TDDD`:'TDDD',description:work?.description.zh};
}
export default async function Page({params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params;const works=getWorks();const index=works.findIndex(work=>work.slug===slug);if(index<0)notFound();
 return <WorkDetail work={works[index]} next={works.length>1?works[(index+1)%works.length]:null}/>;
}
