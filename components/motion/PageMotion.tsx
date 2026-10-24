"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export function PageMotion() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const revealItems = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    revealItems.forEach((item) => {
      gsap.fromTo(
        item,
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 86%",
          },
        },
      );
    });

    const parallaxItems = gsap.utils.toArray<HTMLElement>("[data-parallax]");
    parallaxItems.forEach((item) => {
      const speed = Number(item.dataset.parallax || 20);
      gsap.to(item, {
        y: speed,
        ease: "none",
        scrollTrigger: {
          trigger: item.closest("section") ?? item,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => {
      gsap.ticker.remove(onTick);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      lenis.destroy();
    };
  }, []);

  return null;
}
