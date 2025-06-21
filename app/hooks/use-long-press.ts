import { useRef, useState } from "react";

// Define the props interface for the hook with a generic context type
interface UseLongPressProps<T extends HTMLElement, C> {
  onClick?: (
    event: React.MouseEvent<T> | React.TouchEvent<T>,
    context: C
  ) => void;
  onLongPress?: (
    event: React.MouseEvent<T> | React.TouchEvent<T>,
    context: C
  ) => void;
}

// Define the return type for the hook
interface UseLongPressReturn<T extends HTMLElement, C> {
  action: string | undefined;
  handlers: (context: C) => {
    onClick: (event: React.MouseEvent<T>) => void;
    onMouseDown: (event: React.MouseEvent<T>) => void;
    onMouseUp: (event: React.MouseEvent<T>) => void;
    onTouchStart: (event: React.TouchEvent<T>) => void;
    onTouchEnd: (event: React.TouchEvent<T>) => void;
  };
}

/**
 * Custom hook to handle click and long-press events on an element.
 * Supports both mouse and touch interactions with a generic context type.
 * @param props - Configuration object with optional onClick and onLongPress callbacks
 * @returns Object containing the action state and event handlers factory
 */
const useLongPress = <T extends HTMLElement, C = unknown>({
  onClick,
  onLongPress,
}: UseLongPressProps<T, C> = {}): UseLongPressReturn<T, C> => {
  const [action, setAction] = useState<string | undefined>();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef<boolean>(false);
  const contextRef = useRef<C | null>(null);

  /**
   * Creates event handlers with the provided context.
   * @param context - The context object to pass to callbacks
   */
  const handlers = (context: C) => {
    /**
     * Handles the click event, distinguishing between short clicks and long presses.
     * @param event - The mouse event
     */
    const handleOnClick = (event: React.MouseEvent<T>) => {
      if (isLongPress.current) {
        return;
      }

      setAction("click");
      if (typeof onClick === "function") {
        onClick(event, context);
      }
    };

    /**
     * Starts the long-press timer when the mouse is pressed.
     * @param event - The mouse event
     */
    const handleOnMouseDown = (event: React.MouseEvent<T>) => {
      contextRef.current = context; // Store context for long press
      startPressTimer();
    };

    /**
     * Clears the long-press timer when the mouse is released.
     * @param event - The mouse event
     */
    const handleOnMouseUp = (event: React.MouseEvent<T>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    /**
     * Starts the long-press timer when a touch begins.
     * @param event - The touch event
     */
    const handleOnTouchStart = (event: React.TouchEvent<T>) => {
      contextRef.current = context; // Store context for long press
      startPressTimer();
    };

    /**
     * Clears the long-press timer when a touch ends.
     * @param event - The touch event
     */
    const handleOnTouchEnd = (event: React.TouchEvent<T>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    /**
     * Starts a timer to detect a long press (500ms).
     * If the timer completes, it marks the interaction as a long press.
     */
    const startPressTimer = () => {
      isLongPress.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {

        isLongPress.current = true;
        setAction("longpress");
        if (typeof onLongPress === "function" && contextRef.current !== null) {
          onLongPress({} as React.MouseEvent<T>, contextRef.current); // Dummy event for long press
        }
      }, 500);
    };

    return {
      onClick: handleOnClick,
      onMouseDown: handleOnMouseDown,
      onMouseUp: handleOnMouseUp,
      onTouchStart: handleOnTouchStart,
      onTouchEnd: handleOnTouchEnd,
    };
  };

  return {
    action,
    handlers,
  };
};

export default useLongPress;
