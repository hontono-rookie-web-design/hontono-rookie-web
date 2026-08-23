import About from "@/components/About";
import Hero from "@/components/Hero";
import Rules from "@/components/Rules";
import Schedule from "@/components/Schedule";

import Contact from "@/components/sections/Contact";
import Crowdfunding from "@/components/sections/Crowdfunding";
import PastEventLink from "@/components/sections/PastEventLink";
import PrivacyPolicy from "@/components/sections/PrivacyPolicy";
import RelatedLinks from "@/components/sections/RelatedLinks";
import Sponsors from "@/components/sections/Sponsors";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />
      <About />
      <Rules />
      <Schedule />

      <RelatedLinks />
      <Crowdfunding />
      <PastEventLink />
      <Sponsors />
      <Contact />
      <PrivacyPolicy />

      <footer className="w-full py-8 text-center text-sm text-slate-400 bg-white">
        <p>© 2026 本当のルーキー祭り 運営</p>
      </footer>
    </main>
  );
}
