import { useState, useEffect } from 'react';

/**
 * Hook tipo useState pero persistente en localStorage.
 * Sobrevive a refresh del navegador.
 *
 * Uso:
 *   const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error leyendo localStorage[${key}]:`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error guardando localStorage[${key}]:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}