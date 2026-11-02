import Nav from "@/components/site/Nav";
import FieldKit from "@/components/fieldkit/FieldKit";
import FlagshipWork from "@/components/site/FlagshipWork";
import WorkIndex from "@/components/site/WorkIndex";
import DeskScene from "@/components/site/DeskScene";
import { findProject } from "@/lib/projects";
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
        <FieldKit />
        <FlagshipWork />
        {(() => {
          const boba = findProject("bloom-boba");
          return boba?.deskScene ? (
            <DeskScene
              {...boba.deskScene}
              kicker="Lab · Motion study"
              title={boba.name}
              line="A concept drinks brand built to feel photographed, not coded. Scroll to play it."
              href="/work/bloom-boba"
              liveUrl={boba.liveBaseUrl}
            />
          ) : null;
        })()}
        <WorkIndex />
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
