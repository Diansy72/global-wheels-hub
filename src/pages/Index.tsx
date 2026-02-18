import { useState } from "react";
import LandingHeader from "@/components/landing/LandingHeader";
import HeroSection from "@/components/landing/HeroSection";
import TrustSignals from "@/components/landing/TrustSignals";
import DestinationCards from "@/components/landing/DestinationCards";
import ProductCards from "@/components/landing/ProductCards";
import Testimonials from "@/components/landing/Testimonials";
import LandingFooter from "@/components/landing/LandingFooter";

const Index = () => {
  const [lang, setLang] = useState<"EN" | "ID">("EN");

  return (
    <div className="min-h-screen">
      <LandingHeader lang={lang} setLang={setLang} />
      <HeroSection lang={lang} />
      <TrustSignals lang={lang} />
      <DestinationCards lang={lang} />
      <ProductCards lang={lang} />
      <Testimonials lang={lang} />
      <LandingFooter lang={lang} />
    </div>
  );
};

export default Index;
