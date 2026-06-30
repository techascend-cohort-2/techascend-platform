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
        <Promise />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
