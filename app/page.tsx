import SpherePreview from '@/components/sphere-preview';
import { getWorks, settings } from '@/lib/content';
import './preview/floating/floating.css';
import './preview/floating/sphere.css';

export default function Home() {
  return <SpherePreview works={getWorks()} settings={settings} preview={false}/>;
}
