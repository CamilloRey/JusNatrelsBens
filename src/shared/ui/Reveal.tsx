import { useInView } from '@/shared/hooks/useInView';

type AnimType = 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scaleIn';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  anim?: AnimType;
  style?: React.CSSProperties;
}

const ANIMS: Record<AnimType, string> = {
  fadeUp:     'fadeUp 0.7s ease forwards',
  fadeIn:     'fadeIn 0.6s ease forwards',
  slideLeft:  'slideLeft 0.7s ease forwards',
  slideRight: 'slideRight 0.7s ease forwards',
  scaleIn:    'scaleIn 0.6s ease forwards',
};

export function Reveal({ children, delay = 0, anim = 'fadeUp', style = {} }: RevealProps) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        animation: visible ? ANIMS[anim] : 'none',
        animationDelay: `${delay}s`,
        animationFillMode: 'forwards',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
