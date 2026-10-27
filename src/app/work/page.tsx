import type { Metadata } from "next";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import WorkIndex from "@/components/site/WorkIndex";
import FlagshipWork from "@/components/site/FlagshipWork";

export const metadata: Metadata = {
  title: "Work",
  description: "Every system, storefront and site we have shipped, with case studies for the businesses that run on them.",
};

export default function WorkPage() {
  return (
    <>
      <Nav />
      <main id="main" className="pt-20">
        <WorkIndex asPage />
        <FlagshipWork compact />
      </main>
      <Footer />
    </>
  );
}
