import Nav from "@/components/site/Nav";
import FieldKit from "@/components/fieldkit/FieldKit";
import FlagshipWork from "@/components/site/FlagshipWork";
import WorkIndex from "@/components/site/WorkIndex";
import WorkspaceHero from "@/components/desk/WorkspaceHero";
import Studio from "@/components/site/Studio";
import Services from "@/components/site/Services";
import Process from "@/components/site/Process";
import Impact from "@/components/site/Impact";
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
        <WorkspaceHero />
        <FieldKit />
        <FlagshipWork />
        <Studio />
        <WorkIndex />
        <Services />
        <Process />
        <Impact />
        <Contact />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  );
}
