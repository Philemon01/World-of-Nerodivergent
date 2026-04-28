import Hero from '../components/Hero';
import Rules from '../components/Rules';
import BookGallery from '../components/BookGallery';
import ResourcesSection from '../components/ResourcesSection';
import Founder from '../components/Founder';
import BlogSection from '../components/BlogSection';

export default function Home() {
  return (
    <>
      <Hero />
      <Rules />
      <BookGallery />
      <ResourcesSection />
      <Founder />
      <BlogSection />
    </>
  );
}
