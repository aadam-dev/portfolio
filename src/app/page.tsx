import Nav from "@/components/site/Nav";
import DeskHero from "@/components/desk/DeskHero";
import FieldKit from "@/components/fieldkit/FieldKit";
import BuildDesk from "@/components/build/BuildDesk";
import FlagshipWork from "@/components/site/FlagshipWork";
import Practices from "@/components/site/Practices";
import WorkMap from "@/components/map/WorkMap";
import LabTeaser from "@/components/site/LabTeaser";
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
        <DeskHero />
        <Practices />
        <div id="deployments" />
        <FieldKit />
        <WorkMap />
        <FlagshipWork />
        <LabTeaser />
        <Impact />
        <Voices />
        <BuildDesk />
        <Contact compact />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  );
}
