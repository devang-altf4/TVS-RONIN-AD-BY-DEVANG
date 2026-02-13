import RoninExperience from './components/RoninExperience';
import PricingSection from './components/PricingSection';
import BookingSection from './components/BookingSection';
import Footer from './components/Footer';

function App() {
  return (
    <main className="bg-[#050505] min-h-screen text-white selection:bg-red-900 selection:text-white">
      <RoninExperience />
      <div className="relative z-10 bg-[#050505]">
        <PricingSection />
        <BookingSection />
        <Footer />
      </div>
    </main>
  );
}

export default App;
