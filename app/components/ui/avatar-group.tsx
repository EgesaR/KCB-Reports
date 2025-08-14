// app/components/ui/avatar-group.tsx
import React, { FC, HTMLAttributes } from "react";
import { Popover } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "~/lib/utils";

interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  invertOverlap?: boolean;
  tooltipProps?: {
    side?: "top" | "bottom" | "left" | "right";
    sideOffset?: number;
  };
  translateX?: string; // Renamed from `translate` to avoid HTML attribute conflict
  className?: string;
}

interface AvatarGroupTooltipProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const AvatarGroup: FC<AvatarGroupProps> = ({
  invertOverlap,
  tooltipProps = { side: "bottom", sideOffset: 24 },
  translateX = "30%", // Renamed and default value
  className,
  children,
  ...props
}) => (
  <div
    className={cn(
      `flex ${invertOverlap ? "-space-x-2" : "space-x-2"}`,
      className
    )}
    {...props}
  >
    {React.Children.map(children, (child, index) => (
      <div
        style={{
          transform: `translateX(${
            invertOverlap ? -index * parseFloat(translateX) : 0
          }%)`,
        }}
        className="relative"
      >
        <Popover as="div" className="relative">
          {({ open }) => (
            <>
              <Popover.Button as="div" className="focus:outline-none">
                {child}
              </Popover.Button>
              <AnimatePresence>
                {open && (
                  <Popover.Panel
                    static
                    as={motion.div}
                    initial={{
                      opacity: 0,
                      y: tooltipProps.side === "bottom" ? 10 : -10,
                    }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      y: tooltipProps.side === "bottom" ? 10 : -10,
                    }}
                    className={cn(
                      `absolute z-10 w-max px-2 py-1 bg-gray-800 text-white text-sm rounded shadow-md`,
                      tooltipProps.side === "bottom"
                        ? `top-full mt-${(tooltipProps.sideOffset ?? 24) / 4}`
                        : `bottom-full mb-${
                            (tooltipProps.sideOffset ?? 24) / 4
                          }`
                    )}
                  >
                    {React.Children.toArray(child).find(
                      (c) =>
                        React.isValidElement(c) && c.type === AvatarGroupTooltip
                    )}
                  </Popover.Panel>
                )}
              </AnimatePresence>
            </>
          )}
        </Popover>
      </div>
    ))}
  </div>
);

export const AvatarGroupTooltip: FC<AvatarGroupTooltipProps> = ({
  children,
  ...props
}) => <div {...props}>{children}</div>;
