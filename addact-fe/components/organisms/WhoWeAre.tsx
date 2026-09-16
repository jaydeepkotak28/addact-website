"use client";

import { useEffect, useMemo, useRef } from "react";
import "@/styles/components/whoweare.scss";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type WhoWeAreCounterItem = {
  CounterTitle: string;
  NumberCount: number | string;
  id?: string;
};

export type WhoWeAreTitleItem = {
  Description: string;
  Title?: string;
};

export type WhoWeAreData = {
  Counter?: WhoWeAreCounterItem[];
  Title?: WhoWeAreTitleItem[];
  pageReference?: string;
  [key: string]: any;
};

export interface WhoWeAreProps {
  data?: WhoWeAreData | null;
  className?: string;
}

export const WhoWeAre = ({ data, className = "" }: WhoWeAreProps) => {
  const descriptionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const descriptionWords = useMemo(() => {
    // Check Title[0].Description or fallback to description/body
    const html =
      data?.Title?.[0]?.Description ??
      data?.description?.body ??
      data?.body ??
      "";
    const plain = html
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return plain ? plain.split(" ") : [];
  }, [data]);

  // Extract counters safely
  const counters = useMemo(() => {
    if (data?.Counter && Array.isArray(data.Counter)) {
      return data.Counter;
    }
    // Fallback if raw Strapi counterCards relation is passed
    if (data?.counterCards && Array.isArray(data.counterCards)) {
      return data.counterCards.map((c: any, i: number) => ({
        id: c.documentId || c.id || String(i),
        CounterTitle: c.card?.title || c.title || "",
        NumberCount: c.card?.counter || c.counter || 0,
      }));
    }
    return [];
  }, [data]);

  useEffect(() => {
    if (!descriptionRef.current || descriptionWords.length === 0) return;

    const ctx = gsap.context(() => {
      const words = descriptionRef.current?.querySelectorAll(".word");
      if (words && words.length > 0) {
        gsap.set(words, { opacity: 0.2 });
        gsap.to(words, {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: "top 85%",
            end: "bottom 60%",
            scrub: true,
          },
        });
      }

      if (cardsRef.current) {
        const cards = cardsRef.current.children;
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.4,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    });

    return () => ctx.revert();
  }, [descriptionWords]);

  return (
    <section className={`who-we-are py-16 md:py-24 lg:py-20! bg-white overflow-hidden ${className}`}>
      <div className="container-main mx-auto px-4 sm:px-6 md:px-8 lg:px-6">
        <div className="max-w-[1200px] mx-auto text-center mb-12 sm:mb-16 md:mb-24 lg:mb-32!">
          <div
            ref={descriptionRef}
            className="flex flex-wrap justify-center gap-x-2 md:gap-x-3 text-[16px] sm:text-[28px] md:text-[36px] lg:text-[40px]! font-medium leading-[1.3] sm:leading-[1.25] md:leading-[54px] text-black"
          >
            {descriptionWords &&
              descriptionWords.length > 0 &&
              descriptionWords.map((word: string, index: number) => (
                <span key={`${word}-${index}`} className="word inline-block">
                  {word}
                </span>
              ))}
          </div>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:grid-cols-4 xl:gap-6"
        >
          {counters.map((item, index) => {
            const countStr = String(item.NumberCount ?? "");

            return (
              <div
                key={item.id || index}
                className="bg-[#3C4CFF] rounded-[4px] lg:rounded-[10px]! p-3 sm:p-8 md:p-10 flex flex-col justify-between w-full min-h-[180px] sm:min-h-[220px] md:min-h-[240px] lg:min-h-[320px]! xl:min-h-[389px]! text-left"
              >
                <span className="text-white font-bold! font-montserrat text-[40px] sm:text-[80px] lg:text-[65px]! xl:text-[80px]! 2xl:text-[100px]! leading-none tracking-tighter">
                  {countStr}
                </span>

                <p className="text-white text-[12px] md:text-[18px] lg:text-[20px]! xl:text-[24px]! 2xl:text-[30px]! font-normal leading-tight mt-4 sm:mt-6">
                  {item.CounterTitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
