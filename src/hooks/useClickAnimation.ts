import { useState, useCallback } from 'react';

/**
 * A custom hook that provides click animation state and handlers
 * @param callback Optional function to call after animation completes
 * @param duration Animation duration in milliseconds
 * @returns Click state and handler function
 */
const useClickAnimation = (
  callback?: () => void, 
  duration: number = 150
) => {
  const [isClicked, setIsClicked] = useState(false);
  
  const handleClick = useCallback(() => {
    setIsClicked(true);
    
    // Reset the animation state after duration
    setTimeout(() => {
      setIsClicked(false);
      
      // Call the callback function if provided
      if (callback) {
        callback();
      }
    }, duration);
  }, [callback, duration]);
  
  return { isClicked, handleClick };
};

export default useClickAnimation;
