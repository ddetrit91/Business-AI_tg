"use client";

import { useState } from "react";
import { Assistant } from "./ai/Assistant";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { PageMotion } from "./motion/PageMotion";
import { Advantages } from "./sections/Advantages";
import { Faq } from "./sections/Faq";
import { Hero } from "./sections/Hero";
import { LeadForm } from "./sections/LeadForm";
import { Process } from "./sections/Process";
import { Reviews } from "./sections/Reviews";

export function HomePage() {
  const [assistantOpen, setAssistantOpen] = useState(false);

  return (
    <>
      <PageMotion />
      <Header onAskAi={() => setAssistantOpen(true)} />
      <main>
        <Hero onAskAi={() => setAssistantOpen(true)} />
        <Advantages />
        <Process />
        <Reviews />
        <Faq />
        <LeadForm />
      </main>
      <Footer />
      <Assistant open={assistantOpen} onOpenChange={setAssistantOpen} />
    </>
  );
}
