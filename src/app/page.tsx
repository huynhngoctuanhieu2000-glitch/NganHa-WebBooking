'use client';

import dynamic from 'next/dynamic';
import Hero from '@/components/Hero/Hero';
import AboutStory from '@/components/AboutStory/AboutStory';

// Dynamic import to avoid SSR issues with react-pageflip
const ServiceBook = dynamic(
  () => import('@/components/ServiceBook/ServiceBook'),
  { ssr: false }
);

const HomePage = () => {
  return (
    <main>
      {/* Hero Section - Fullscreen with video/image background */}
      <Hero />

      {/* Our Story - About Section */}
      <AboutStory />

      {/* Service Menu - Book flip */}
      <section id="services" className="section-services">
        <ServiceBook />
      </section>
    </main>
  );
};

export default HomePage;
