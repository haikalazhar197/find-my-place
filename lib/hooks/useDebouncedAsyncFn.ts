/*
    DEBOUNCE A FUNCTION CALL BASED ON A VALUE
*/

import { useState, useRef, useEffect } from "react";

function useDebouncedAsyncFn<T = any>(
  value: T,
  wait: number,
  fn: (value: T) => Promise<void> | void,
  options = { leading: false }
): readonly [T, boolean, () => void] {
  const [_value, setValue] = useState(value);
  const [loading, setLoading] = useState(false);
  const mountedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  const cooldownRef = useRef(false);
  const cancel = () => window.clearTimeout(timeoutRef.current ?? undefined);

  const asyncFn = async (value: T) => {
    setLoading(true);
    await fn(value);
    setLoading(false);
  };

  useEffect(() => {
    if (mountedRef.current) {
      if (!cooldownRef.current && options.leading) {
        cooldownRef.current = true;
        setValue(value);
        asyncFn(value);
      } else {
        cancel();
        timeoutRef.current = window.setTimeout(() => {
          cooldownRef.current = false;
          setValue(value);
          asyncFn(value);
        }, wait);
      }
    }
  }, [value, options.leading, wait]);
  useEffect(() => {
    mountedRef.current = true;
    return cancel;
  }, []);
  return [_value, loading, cancel];
}

export { useDebouncedAsyncFn };
