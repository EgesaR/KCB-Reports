import {
  DOMKeyframesDefinition,
  AnimationOptions,
  ElementOrSelector,
  useAnimate,
} from "framer-motion";
import React, { useEffect, useRef } from "react";

type AnimateParams = [
  ElementOrSelector,
  DOMKeyframesDefinition,
  (AnimationOptions | undefined)?
];

type Animation = AnimateParams | Animation[];

const useMotionTimeline = (keyframes: Animation[], count: number = 1) => {
  const mounted = useRef(true);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    mounted.current = true;

    handleAnimate();

    return () => {
      mounted.current = false;
    };
  }, []);

  const processAnimation = async (animation: Animation) => {
    //console.log(`Processing animation: `, animation);
    if (Array.isArray(animation[0])) {
      await Promise.all(
        animation.map(async (a) => {
          await processAnimation(a as AnimateParams);
        })
      );
    } else {
      await animate(...(animation as AnimateParams));
    }
  };

  const handleAnimate = async () => {
    for (var i = 0; i < count; i++) {
      for (const animation of keyframes) {
        if (!mounted.current) return;

        await processAnimation(animation);
      }
    }
  };

  return scope;
};

export default useMotionTimeline;
