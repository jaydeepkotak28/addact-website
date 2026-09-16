"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const VB_X = 209;
const VB_Y = 147;
const VB_W = 926;
const VB_H = 1016;

const SHAPE_PATHS = [
    "M669.771 724.21L626.338 1162.98L558.847 1124.01L596.579 785.221L596.705 784.086L595.785 784.763L321.25 986.835L254.794 948.467L612.553 691.175L669.771 724.21Z",
    "M611.087 687.911L209.467 869.795L209.479 791.841L521.683 655.036L522.729 654.577L521.684 654.12L209.523 517.413L209.535 440.655L611.098 621.823L611.087 687.911Z",
    "M613.194 618.923L255.006 362.038L322.51 323.05L596.982 525.036L597.902 525.713L597.776 524.578L560.15 185.799L626.618 147.409L670.423 585.87L613.194 618.923Z",
    "M673.979 586.232L717.412 147.463L784.904 186.429L747.172 525.22L747.045 526.355L747.965 525.678L1022.5 323.606L1088.96 361.974L731.198 619.267L673.979 586.232Z",
    "M1134.78 439.872L1134.77 518.929L822.263 655.865L1134.72 792.703L1134.71 870.562L732.149 688.942L732.159 622.209L1134.78 439.872Z",
    "M730.555 691.521L1088.74 948.407L1021.24 987.394L746.767 785.408L745.847 784.731L745.973 785.866L783.599 1124.65L717.131 1163.03L673.326 724.574L730.555 691.521Z",
];

const ACCORDION_TO_PATH: Record<number, number> = {
    0: 4,
    1: 3,
    2: 2,
    3: 1,
    4: 0,
    5: 5,
};

const PATH_TO_ACCORDION: Record<number, number> = {
    0: 4,
    1: 3,
    2: 2,
    3: 1,
    4: 0,
    5: 5,
};

function shortestStep(from: number, to: number): number {
    let step = (to - from + 6) % 6;
    if (step > 3) step -= 6;
    return step;
}

export interface RadialDiagramProps {
    activeIndex: number;
    onSpokeClick: (index: number) => void;
    mobileRotateOnly?: string; // e.g. "270px"
}

export function RadialDiagram({ activeIndex, onSpokeClick, mobileRotateOnly }: RadialDiagramProps) {
    const [totalDeg, setTotalDeg] = useState(0);
    const prevIndexRef = useRef(0);

    useEffect(() => {
        const prev = prevIndexRef.current;
        if (prev === activeIndex) return;
        const step = shortestStep(prev, activeIndex);
        setTotalDeg((d) => d + step * 60);
        prevIndexRef.current = activeIndex;
    }, [activeIndex]);

    const activePath = ACCORDION_TO_PATH[activeIndex];

    return (
        <svg
            viewBox={`${VB_X} ${VB_Y} ${VB_W} ${VB_H}`}
            className='w-full h-full'
            style={{
                overflow: "visible",
                transform: mobileRotateOnly ? `rotate(${mobileRotateOnly})` : undefined,
            }}
        >
            <defs>
                {/* Glow for the active (filled) shape */}
                <filter id='rdsvg-glow' x='-25%' y='-25%' width='150%' height='150%'>
                    <feGaussianBlur stdDeviation='14' result='blur' />
                    <feMerge>
                        <feMergeNode in='blur' />
                        <feMergeNode in='SourceGraphic' />
                    </feMerge>
                </filter>

                {/* Shadow for the centre hub */}
                <filter id='rdsvg-hub-sh' x='-30%' y='-30%' width='160%' height='160%'>
                    <feDropShadow dx='0' dy='4' stdDeviation='10' floodColor='rgba(60,76,255,0.25)' />
                </filter>

                {/* Radial gradient for hub */}
                <radialGradient id='rdsvg-hub-fill' cx='50%' cy='50%' r='50%'>
                    <stop offset='0%' stopColor='#e8eaff' />
                    <stop offset='100%' stopColor='#ffffff' />
                </radialGradient>
            </defs>

            <motion.g
                animate={{ rotate: totalDeg }}
                transition={{ duration: 0.65, ease: [0.42, 0, 0.18, 1] }}
                style={{ transformOrigin: "50% 50%" }}
            >
                {SHAPE_PATHS.map((d, i) => {
                    const isActive = i === activePath;
                    return (
                        <motion.path
                            key={i}
                            d={d}
                            animate={{
                                fill: isActive ? "#3C4CFF" : "rgba(60,76,255,0)",
                                stroke: "#3C4CFF",
                                strokeWidth: 1,
                                opacity: isActive ? 1 : 0.72,
                            }}
                            transition={{ duration: 0.42, ease: "easeInOut" }}
                            onClick={() => onSpokeClick(PATH_TO_ACCORDION[i])}
                            whileHover={!isActive ? { fill: "rgba(60,76,255,0.14)", opacity: 1 } : {}}
                            style={{
                                cursor: "pointer",
                            }}
                        />
                    );
                })}
            </motion.g>
        </svg>
    );
}
