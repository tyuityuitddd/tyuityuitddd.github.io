import SpherePreview from '@/components/sphere-preview';
import { getWorks, settings } from '@/lib/content';
import './floating.css';
import './sphere.css';

export default function Page() {
  return <SpherePreview works={getWorks()} settings={settings}/>;
}
