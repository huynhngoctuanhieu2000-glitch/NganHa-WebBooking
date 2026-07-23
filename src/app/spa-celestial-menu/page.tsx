'use client';

import dynamic from 'next/dynamic';

const SpaCelestialMenuClient = dynamic(() => import('./SpaCelestialMenuClient'), {
  ssr: false,
  loading: () => (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#020712',
        color: '#f5dea2',
        fontFamily: 'serif',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      Loading celestial menu
    </main>
  ),
});

export default function SpaCelestialMenuPage() {
  return <SpaCelestialMenuClient />;
}
