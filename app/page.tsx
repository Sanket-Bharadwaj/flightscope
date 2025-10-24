import dynamic from 'next/dynamic';
import { Header } from '@/components/header';

// Dynamically import MapWrapper (client-only) to ensure Leaflet runs on client
const DynamicMapWrapper = dynamic(() => import('@/components/map-wrapper'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen w-screen bg-background text-textSecondary text-lg">
      Loading map...
    </div>
  ),
});

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-background">
      <Header />
      <div style={{ paddingTop: 'var(--header-height)', height: '100vh' }}>
        <DynamicMapWrapper />
      </div>
    </main>
  );
}
