import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import WorkIndex from "@/components/site/WorkIndex";
import Process from "@/components/site/Process";
import Impact from "@/components/site/Impact";
import Voices from "@/components/site/Voices";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";
import CursorGlow from "@/components/site/CursorGlow";
import ScrollProgress from "@/components/site/ScrollProgress";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Nav />
      <main id="main" className="relative">
        <Hero />
        <WorkIndex />
        <Process />
        <Impact />
        <Voices />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
