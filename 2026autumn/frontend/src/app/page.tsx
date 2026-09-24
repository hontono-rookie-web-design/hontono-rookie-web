import About from "@/components/About";
import Hero from "@/components/Hero";
import Rules from "@/components/Rules";
import Schedule from "@/components/Schedule";

import Contact from "@/components/sections/Contact";
import PastEventLink from "@/components/sections/PastEventLink";
import RelatedLinks from "@/components/sections/RelatedLinks";
import Sponsors from "@/components/sections/Sponsors";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />

      <About />

      <Rules />

      <Schedule />

      <RelatedLinks />
      <PastEventLink />

      <Sponsors />

      <Contact />

      <Footer />
    </main>
  );
}
