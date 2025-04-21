import { useEffect, useRef } from 'react';

export const useUnmount = (callback: VoidFunction) => {
  const ref = useRef(callback);
  ref.current = callback;

  useEffect(() => {
    return () => {
      ref.current();
    };
  }, []);
};
