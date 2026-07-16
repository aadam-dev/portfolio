import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import TickerBand from "@/components/site/TickerBand";
import FlagshipWork from "@/components/site/FlagshipWork";
import WorkIndex from "@/components/site/WorkIndex";
import Range from "@/components/site/Range";
import Services from "@/components/site/Services";
import Process from "@/components/site/Process";
import Impact from "@/components/site/Impact";
import Voices from "@/components/site/Voices";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";
import Cursor from "@/components/site/Cursor";
import Preloader from "@/components/site/Preloader";
import ScrollProgress from "@/components/site/ScrollProgress";
import MobileCtaBar from "@/components/site/MobileCtaBar";

export default function Home() {
  return (
    <>
      <Preloader />
      <ScrollProgress />
      <Cursor />
      <Nav />
      <main id="main" className="relative">
        <Hero />
        <TickerBand />
        <FlagshipWork />
        <WorkIndex />
        <Range />
        <Services />
        <Process />
        <Impact />
        <Voices />
        <Contact />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  );
}
