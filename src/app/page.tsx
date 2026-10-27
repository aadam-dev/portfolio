import Nav from "@/components/site/Nav";
import FieldKit from "@/components/fieldkit/FieldKit";
import BuildDesk from "@/components/fieldkit/BuildDesk";
import FlagshipWork from "@/components/site/FlagshipWork";
import WorkIndex from "@/components/site/WorkIndex";
import Services from "@/components/site/Services";
import Process from "@/components/site/Process";
import Impact from "@/components/site/Impact";
import Voices from "@/components/site/Voices";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";
import Cursor from "@/components/site/Cursor";
import ScrollProgress from "@/components/site/ScrollProgress";
import MobileCtaBar from "@/components/site/MobileCtaBar";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Cursor />
      <Nav />
      <main id="main" className="relative">
        <FieldKit />
        <FlagshipWork />
        <WorkIndex />
        <Services />
        <Process />
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
