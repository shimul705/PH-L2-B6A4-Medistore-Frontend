
import { Hero } from "@/src/components/modules/home/hero";
import { HomeSections } from "@/src/components/modules/home/home-sections";
export default function Home() {
  return (
    <div className="min-h-screen w-full bg-zinc-50 font-sans dark:bg-black">
      <Hero />
      <HomeSections />
    </div>
  );
}
