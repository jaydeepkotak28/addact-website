"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export type CursorVariant = "default" | "drag" | "read";

const CURSOR_DESKTOP_BREAKPOINT = 1024;

export default function CustomCursor() {
  const pathname = usePathname();
  const [cursorEnabled, setCursorEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const variantRef = useRef<CursorVariant>("default");
  const rafRef = useRef<number>(0);
  const mouse = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const labelPos = useRef({ x: 0, y: 0 });
  const isVisible = useRef(false);

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${CURSOR_DESKTOP_BREAKPOINT + 1}px)`);
    const updateCursorAvailability = () => {
      setCursorEnabled(media.matches);
    };

    updateCursorAvailability();
    media.addEventListener("change", updateCursorAvailability);

    return () => {
      media.removeEventListener("change", updateCursorAvailability);
    };
  }, []);

  useEffect(() => {
    if (!cursorEnabled) return;
    window.dispatchEvent(new CustomEvent<CursorVariant>("cursor-variant", { detail: "default" }));
  }, [pathname, cursorEnabled]);

  useEffect(() => {
    if (!cursorEnabled) return;
    const dot = dotRef.current;
    const ringEl = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ringEl || !label) return;

    const animate = () => {
      const mx = mouse.current.x;
      const my = mouse.current.y;

      cursorPos.current.x += (mx - cursorPos.current.x) * 0.25;
      cursorPos.current.y += (my - cursorPos.current.y) * 0.25;

      // labelPos.current.x += (mx - labelPos.current.x) * 0.1;
      // labelPos.current.y += (my - labelPos.current.y) * 0.1;
      const cx = cursorPos.current.x;
      const cy = cursorPos.current.y;

      dot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      ringEl.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      // label.style.transform = `translate(${labelPos.current.x}px, ${labelPos.current.y}px) translate(-50%, -50%)`;

      if (variantRef.current !== "default") {
        label.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    const applyVariant = (variant: CursorVariant) => {
      variantRef.current = variant;

      const dragContent = label.querySelector<HTMLElement>("[data-drag]")!;
      const readContent = label.querySelector<HTMLElement>("[data-read]")!;

      if (variant === "default") {
        // Restore small dot
        dot.style.opacity = "1";
        dot.style.width = "8px";
        dot.style.height = "8px";
        dot.style.backgroundColor = "#4D5DFB";

        // Restore ring to normal 50px border style
        ringEl.style.opacity = "1";
        ringEl.style.width = "50px";
        ringEl.style.height = "50px";
        ringEl.style.backgroundColor = "transparent";
        ringEl.style.border = "1px solid rgba(212, 212, 212, 1)";

        // Hide label
        label.style.opacity = "0";
      } else if (variant === "drag") {
        dot.style.opacity = "1";
        dot.style.width = "80px";
        dot.style.height = "80px";
        dot.style.backgroundColor = "#4D5DFB";
        ringEl.style.opacity = "0";
        ringEl.style.border = "none";
        // ✅ Snap position first, then animate
        label.style.transition = "none";
        label.style.transform = `translate(${mouse.current.x}px, ${mouse.current.y}px) translate(-50%, -50%)`;
        requestAnimationFrame(() => {
          label.style.transition = "opacity 0.25s ease, scale 0.25s ease";
          label.style.opacity = "1";
          readContent.style.display = "none";
          dragContent.style.display = "flex";
        });
      } else {
        // read variant — same 80px expand, different label
        dot.style.opacity = "1";
        dot.style.width = "80px";
        dot.style.height = "80px";
        dot.style.backgroundColor = "#4D5DFB";
        ringEl.style.opacity = "0";
        ringEl.style.border = "none";
        // ✅ Snap position first, then animate
        label.style.transition = "none";
        label.style.transform = `translate(${mouse.current.x}px, ${mouse.current.y}px) translate(-50%, -50%)`;
        requestAnimationFrame(() => {
          label.style.transition = "opacity 0.25s ease, scale 0.25s ease";
          label.style.opacity = "1";
          dragContent.style.display = "none";
          readContent.style.display = "flex";
        });
      }
    };

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!isVisible.current) {
        isVisible.current = true;
        cursorPos.current = { x: e.clientX, y: e.clientY };
        labelPos.current = { x: e.clientX, y: e.clientY };
        applyVariant(variantRef.current);
      }
    };

    const onMouseLeave = () => {
      isVisible.current = false;
      dot.style.opacity = "0";
      ringEl.style.opacity = "0";
      label.style.opacity = "0";
    };

    const onMouseEnter = () => {
      isVisible.current = true;
      applyVariant(variantRef.current);
    };

    const onVariantChange = (e: CustomEvent<CursorVariant>) => {
      applyVariant(e.detail);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    window.addEventListener("cursor-variant", onVariantChange as EventListener);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("cursor-variant", onVariantChange as EventListener);
    };
  }, [cursorEnabled]);

  if (!cursorEnabled) {
    return null;
  }

  return (
    <>
      {/* Inner dot — expands to 80px filled circle on drag/read variant */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[99999] pointer-events-none rounded-full bg-[#4D5DFB] opacity-0"
        style={{
          width: "8px",
          height: "8px",
          willChange: "transform, width, height",
          transition:
            "opacity 0.2s ease, width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      />

      {/* Outer ring — default 50px, hidden on drag/read */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[99999] pointer-events-none rounded-full border border-white/70 opacity-0"
        style={{
          width: "50px",
          height: "50px",
          willChange: "transform, width, height",
          transition:
            "opacity 0.2s ease, width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      />

      {/* Label — rendered on top of the expanded dot */}
      <div
        ref={labelRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[100000] pointer-events-none opacity-0"
        style={{
          willChange: "transform",
          transition: "opacity 0.25s ease",
        }}
      >
        {/* Drag label */}
        <div
          data-drag
          className="hidden items-center justify-center w-[80px] h-[80px] rounded-full gap-1.5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="6"
            height="7"
            viewBox="0 0 6 7"
            fill="none"
          >
            <path d="M0 3.46411L6 6.92821V9.77516e-06L0 3.46411Z" fill="white" />
          </svg>
          <span
            className="text-white font-semibold text-[11px] uppercase select-none"
            style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "0.12em" }}
          >
            Drag
          </span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="6"
            height="7"
            viewBox="0 0 6 7"
            fill="none"
          >
            <path d="M6 3.46411L0 6.92821V9.77516e-06L6 3.46411Z" fill="white" />
          </svg>
        </div>

        {/* Read label */}
        <div
          data-read
          className="hidden items-center justify-center w-[80px] h-[80px] rounded-full"
        >
          <span
            className="text-white font-semibold text-[11px] uppercase select-none"
            style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "0.12em" }}
          >
            Read
          </span>
        </div>
      </div>
    </>
  );
}
