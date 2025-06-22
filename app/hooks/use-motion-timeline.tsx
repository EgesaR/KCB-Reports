// ~/hooks/use-motion-timeline.tsx
import {
  DOMKeyframesDefinition,
  AnimationOptions,
  ElementOrSelector,
  useAnimate,
  AnimationScope,
} from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

// Define and export types
export type AnimateParams = [
  ElementOrSelector,
  DOMKeyframesDefinition,
  AnimationOptions?
];

export type AnimationSequence = AnimateParams | AnimateParams[];

interface UseMotionTimelineOptions {
  scope?: AnimationScope;
  count?: number;
  onComplete?: () => void;
}

const useMotionTimeline = (
  initialKeyframes: AnimationSequence[] = [],
  options: UseMotionTimelineOptions = {}
) => {
  const { count = 1, onComplete, scope: externalScope } = options;
  const mounted = useRef(true);
  const [internalScope, animate] = useAnimate();
  const finalScope = externalScope || internalScope;

  const processAnimation = useCallback(
    async (animation: AnimationSequence): Promise<void> => {
      try {
        if (Array.isArray(animation[0])) {
          await Promise.all(
            (animation as AnimateParams[]).map(async (anim) => {
              if (!mounted.current) return;
              await animate(...anim);
            })
          );
        } else {
          if (!mounted.current) return;
          await animate(...(animation as AnimateParams));
        }
      } catch (error) {
        console.error("Animation error:", error);
      }
    },
    [animate]
  );

  const runAnimations = useCallback(
    async (seq: AnimationSequence[]): Promise<void> => {
      try {
        for (let i = 0; i < count; i++) {
          if (!mounted.current) return;
          for (const animation of seq) {
            if (!mounted.current) break;
            await processAnimation(animation);
          }
        }
        if (onComplete && mounted.current) {
          onComplete();
        }
      } catch (error) {
        console.error("Animation sequence error:", error);
      }
    },
    [count, processAnimation, onComplete]
  );

  const trigger = useCallback(
    (seq: AnimationSequence[] = initialKeyframes) => {
      return () => runAnimations(seq);
    },
    [initialKeyframes, runAnimations]
  );

  useEffect(() => {
    if (initialKeyframes.length > 0) {
      runAnimations(initialKeyframes);
    }
    return () => {
      mounted.current = false;
    };
  }, [initialKeyframes, runAnimations]);

  return [finalScope, trigger] as const;
};

export default useMotionTimeline;