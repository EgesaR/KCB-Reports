import type { MetaFunction } from "@remix-run/node";
import TooltipButton from "~/components/TooltipBtn";
import useMotionTimeline from "~/hooks/useMotionTimeline";
import { motion, AnimatePresence, AnimationOptions } from "framer-motion";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard - KCB Reports" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const TRANSITION: AnimationOptions = {
  ease: "easeInOut",
  duration: 0.5,
};

const INDICATOR_TRANSITION: AnimationOptions = {
  ease: "easeInOut",
  duration: 1.5,
};

export default function Index() {
    const scope = useMotionTimeline(
      [
        [".bar-2", { height: 48 }, TRANSITION],
        [
          [".bar-1", { x: -24 }, TRANSITION],
          [".bar-3", { x: 24 }, TRANSITION],
        ],
        [
          [".bar-1", { height: 48, rotate: 90 }, TRANSITION],
          [".bar-3", { height: 48, rotate: -90 }, TRANSITION],
        ],
        [
          [".bar-1", { x: 48 }, TRANSITION],
          [".bar-3", { x: -48 }, TRANSITION],
        ],
        [
          [".bar-1", { rotate: 120, background: "#059669" }, TRANSITION],
          [".bar-2", { rotate: -120, background: "#34d399" }, TRANSITION],
          [".bar-3", { rotate: 90 }, TRANSITION],
        ],
        [
          [
            ".bar-1",
            { rotate: 0, x: 0, height: 96, background: "#FFFFFF" },
            { ...TRANSITION, delay: 2 },
          ],
          [
            ".bar-2",
            { rotate: 0, height: 96, background: "#FFFFFF" },
            { ...TRANSITION, delay: 2 },
          ],
          [
            ".bar-3",
            { rotate: 0, x: 0, height: 96, background: "#FFFFFF" },
            { ...TRANSITION, delay: 2 },
          ],
        ],
      ],
      Infinity
    );

    const bar = useMotionTimeline(
      [
        [".bar-4", { height: 2.5, top: "60%" }, INDICATOR_TRANSITION],
        [".bar-4", { top: "calc(1/2*100%)" }, INDICATOR_TRANSITION],
        [".bar-4", { height: 24, top: "calc(1/2*100%)" }, INDICATOR_TRANSITION],
      ],
      Infinity
    );
  return (
    <div
      ref={scope}
      className="flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 bg-grid-zinc-900"
    >
      <div
        style={{
          width: 48,
          height: 96,
        }}
        className="bar-1 bg-white"
      />
      <div
        style={{
          width: 48,
          height: 96,
        }}
        className="bar-2 bg-white"
      />
      <div
        style={{
          width: 48,
          height: 96,
        }}
        className="bar-3 bg-white"
      />
      <div ref={bar}>
        <motion.div
          className="bg-purple-300 rounded-full absolute top-1/2 -translate-y-1/2 bar-4"
          style={{ width: 4 }}
        ></motion.div>
      </div>
    </div>
  );
}
