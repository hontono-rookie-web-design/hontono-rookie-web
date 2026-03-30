
import Hero from "@/components/Hero";
import About from "@/components/About";
import Rules from "@/components/Rules";
import Schedule from "@/components/Schedule";
import LinksAndSponsors from "@/components/LinksAndSponsors";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />
      <About />
      <Rules />
      <Schedule />
      <LinksAndSponsors />

      <footer className="w-full py-8 text-center text-sm text-slate-400 bg-white">
        <p>© 2026 本当のルーキー祭り 運営</p>
      </footer>
    </main>
  );
}
