import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Rules from './components/Rules';
import Founder from './components/Founder';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow pt-16">
        <Hero />
        <Rules />
        <Founder />
      </main>
      <Footer />
    </div>
  );
}
