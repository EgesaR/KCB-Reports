import { useRef, useState } from "react";

// Define the props interface for the hook
interface UseLongPressProps {
  onClick?: () => void; // Optional callback for click events
  onLongPress?: () => void; // Optional callback for long press events (added for flexibility)
}

// Define the return type for the hook
interface UseLongPressReturn<T extends HTMLElement> {
  action: string | undefined; // Tracks the action type ("click" or "longpress")
  handlers: {
    onClick: (event: React.MouseEvent<T>) => void;
    onMouseDown: (event: React.MouseEvent<T>) => void;
    onMouseUp: (event: React.MouseEvent<T>) => void;
    onTouchStart: (event: React.TouchEvent<T>) => void;
    onTouchEnd: (event: React.TouchEvent<T>) => void;
  };
}

/**
 * Custom hook to handle click and long-press events on an element.
 * Supports both mouse and touch interactions.
 * @param props - Configuration object with optional onClick and onLongPress callbacks
 * @returns Object containing the action state and event handlers
 */
const useLongPress = <T extends HTMLElement>({
  onClick,
  onLongPress,
}: UseLongPressProps = {}): UseLongPressReturn<T> => {
  // State to track the action type ("click" or "longpress")
  const [action, setAction] = useState<string | undefined>();

  // Ref to store the timeout ID for long-press detection
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Ref to track if the interaction is a long press
  const isLongPress = useRef<boolean>(false);

  /**
   * Handles the click event, distinguishing between short clicks and long presses.
   * @param event - The mouse event
   */
  const handleOnClick = (event: React.MouseEvent<T>) => {
    console.log("handleClick");
    if (isLongPress.current) {
      console.log("It is a long press");
      return;
    }

    setAction("click");
    if (typeof onClick === "function") {
      onClick();
    }
  };

  /**
   * Starts the long-press timer when the mouse is pressed.
   * @param event - The mouse event
   */
  const handleOnMouseDown = (event: React.MouseEvent<T>) => {
    console.log("handleOnMouseDown");
    startPressTimer();
  };

  /**
   * Clears the long-press timer when the mouse is released.
   * @param event - The mouse event
   */
  const handleOnMouseUp = (event: React.MouseEvent<T>) => {
    console.log("handleOnMouseUp");
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
    console.log("handleOnTouchStart");
    startPressTimer();
  };

  /**
   * Clears the long-press timer when a touch ends.
   * @param event - The touch event
   */
  const handleOnTouchEnd = (event: React.TouchEvent<T>) => {
    console.log("handleOnTouchEnd");
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
    // Clear any existing timeout to prevent multiple timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // Set a new 500ms timeout for long press detection
    timerRef.current = setTimeout(() => {
      console.log("longpress");
      isLongPress.current = true;
      setAction("longpress");
      if (typeof onLongPress === "function") {
        onLongPress();
      }
    }, 500);
  };

  return {
    action,
    handlers: {
      onClick: handleOnClick,
      onMouseDown: handleOnMouseDown,
      onMouseUp: handleOnMouseUp,
      onTouchStart: handleOnTouchStart,
      onTouchEnd: handleOnTouchEnd,
    },
  };
};

export default useLongPress;
