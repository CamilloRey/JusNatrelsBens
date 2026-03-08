import { useRef, useState, useEffect } from 'react';

/**
 * Retourne [ref, isVisible].
 * `isVisible` passe à true une seule fois quand l'élément entre dans le viewport.
 */
export function useInView(threshold = 0.12): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref as React.RefObject<HTMLDivElement>, visible];
}
