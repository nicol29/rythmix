import { useEffect } from 'react';


export default function useDetectOutsideClick<T extends HTMLElement>(refs: React.RefObject<T>[], callback: () => void) {
  useEffect(() => {
    function detectOutSideClick(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;

      if (refs.every(ref => ref.current && !ref.current.contains(target))) {
        callback();
      }
    }

    document.addEventListener("mousedown", detectOutSideClick);
    document.addEventListener("touchstart", detectOutSideClick);

    return () => {
        document.removeEventListener("mousedown", detectOutSideClick);
        document.removeEventListener("touchstart", detectOutSideClick);
    };
  }, [refs, callback]);
}
