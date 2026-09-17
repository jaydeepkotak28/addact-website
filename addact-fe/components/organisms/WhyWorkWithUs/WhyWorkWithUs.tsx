"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { RadialDiagram } from "./RadialDiagram";
import { AccordionItem, AccordionList } from "./AccordionList";
import RichText from "@/components/atoms/RichText";

export interface WhyWorkWithUsProps {
  data?: any;
  className?: string;
}

export default function WhyWorkWithUs({ data, className = "" }: WhyWorkWithUsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileCardIndex, setMobileCardIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Transform API data or normalized data to AccordionItem format
  const entity = data?.whyAddact || data;
  const items: AccordionItem[] =
    (Array.isArray(entity?.items) ? entity.items : null) ||
    entity?.GlobalCard?.map((card: any) => ({
      title: card.Title || card.title,
      description: card.Description || card.description,
      image: card.Image || card.image,
    })) ||
    entity?.content?.map((item: any) => ({
      title: item.Body?.title || item.title || item.internalName,
      description: item.Body?.description || item.description,
      image: item.image,
    })) ||
    [];

  const heading =
    (typeof entity?.title === "string" ? entity.title : null) ||
    entity?.title?.title ||
    entity?.Title?.[0]?.h2 ||
    entity?.title?.h2 ||
    entity?.internalName ||
    "Why work with us";

  if (!items || items.length === 0) {
    return null;
  }

  // Update active index when mobile card changes
  const handleMobileCardChange = (index: number) => {
    setMobileCardIndex(index);
    setActiveIndex(index);
  };

  return (
    <section className="bg-white py-12 md:py-20 lg:py-24! relative overflow-hidden">
      {/* Mobile View - Cards + Non-clickable SVG */}
      <div className="block lg:hidden">
        <div className="px-6 pb-64 md:pb-72">
          <h2 className="text-stone-950 text-[24px]! lg:text-[26px]! !font-semibold font-['Montserrat'] leading-normal mb-8">
            {heading}
          </h2>

          {/* Carousel - One card at a time */}
          <div className="relative w-full" ref={containerRef}>
            {/* Outer clip — exactly one card wide */}
            <div className="overflow-hidden w-full">
              <motion.div
                className="flex cursor-grab active:cursor-grabbing"
                /* Total track width = N × 100% of the container */
                style={{ width: `${items.length * 100}%` }}
                drag="x"
                dragConstraints={{
                  left: -((containerRef.current?.offsetWidth ?? 0) * (items.length - 1)),
                  right: 0,
                }}
                dragElastic={0.08}
                dragMomentum={false}
                onDragEnd={(_e, { offset, velocity }) => {
                  const cardWidth = containerRef.current?.offsetWidth ?? 0;
                  const threshold = cardWidth * 0.2;
                  const fast = Math.abs(velocity.x) > 500;

                  if (
                    (offset.x < -threshold || (fast && offset.x < 0)) &&
                    mobileCardIndex < items.length - 1
                  ) {
                    handleMobileCardChange(mobileCardIndex + 1);
                  } else if (
                    (offset.x > threshold || (fast && offset.x > 0)) &&
                    mobileCardIndex > 0
                  ) {
                    handleMobileCardChange(mobileCardIndex - 1);
                  }
                }}
                /* Translate by card-index × one-card-width (px) */
                animate={{
                  x: -((containerRef.current?.offsetWidth ?? 0) * mobileCardIndex),
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {items.map((item, index) => (
                  /* Each card occupies exactly 1/N of the track = 100% of the container */
                  <div key={index} style={{ width: `${100 / items.length}%` }} className="shrink-0">
                    <div className="bg-white border border-black/10 rounded-[10px] p-5 h-full">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-stone-950 text-[18px]! lg:text-[20px]! font-medium! font-['Montserrat'] leading-8">
                          {item?.title}
                        </h3>
                      </div>
                      {item?.description && (
                        <div className="text-stone-950 text-sm font-normal font-['Montserrat'] leading-[1.7]">
                          <RichText html={item?.description} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleMobileCardChange(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === mobileCardIndex ? "bg-[#3C4CFF] w-8" : "bg-black/20"
                  }`}
                  aria-label={`Go to card ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Non-clickable SVG Diagram - synced with card index - Half cut at bottom */}
          <div
            className="absolute -bottom-[260px] md:-bottom-[305px] left-1/2 -translate-x-1/2 w-[500px] md:w-[600px]"
            style={{ pointerEvents: "none" }}
          >
            <div style={{ aspectRatio: "1057/1091" }}>
              <RadialDiagram
                activeIndex={activeIndex}
                onSpokeClick={() => {}} // No-op for mobile
                mobileRotateOnly="270deg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View - Original Layout */}
      <div className="hidden lg:block">
        <div className="mx-auto max-w-[1920px] pl-0 pr-6 lg:pr-10 xl:pr-16 2xl:pr-24">
          <div className="grid grid-cols-12 items-center gap-8 xl:gap-12 2xl:gap-16">
            {/* Radial Diagram */}
            <motion.div className="col-span-6 self-center" style={{ aspectRatio: "1057/1091" }}>
              <div className="w-full max-w-[700px] xl:max-w-[860px] 2xl:max-w-[1020px]">
                <RadialDiagram activeIndex={activeIndex} onSpokeClick={setActiveIndex} />
              </div>
            </motion.div>

            {/* Content */}
            <div className="col-span-6 self-center w-full min-w-0">
              <motion.h2
                className="mb-8 text-stone-950 text-4xl xl:text-5xl 2xl:text-6xl !font-semibold font-['Montserrat'] leading-tight"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {heading}
              </motion.h2>

              <AccordionList items={items} activeIndex={activeIndex} onItemClick={setActiveIndex} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
