import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ModelComparison from "@/components/ModelComparison";
import Engines from "@/components/Engines";
import Tracks from "@/components/Tracks";
import Journey from "@/components/Journey";
import Impact from "@/components/Impact";
import Testimonials from "@/components/Testimonials";
import Partners from "@/components/Partners";
import Promise from "@/components/Promise";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import InitiativeTeaser from "@/components/InitiativeTeaser";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ModelComparison />
        <Engines />
        <Tracks />
        <Journey />
        <Impact />
        <Testimonials />
        <Partners />
        <InitiativeTeaser />
        <Promise />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
