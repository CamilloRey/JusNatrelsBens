interface ProductImgProps {
  src: string;
  size?: number;
  borderRadius?: number;
  style?: React.CSSProperties;
  alt?: string;
}

/** Affiche une vraie photo (URL) ou un emoji selon le contenu de `src`. */
export function ProductImg({ src, size = 60, borderRadius = 10, style = {}, alt = '' }: ProductImgProps) {
  const isUrl = src && (src.startsWith('http') || src.startsWith('/') || src.startsWith('data:'));

  if (isUrl) {
    return (
      <img
        src={src}
        alt={alt}
        style={{ width: size, height: size, objectFit: 'cover', borderRadius, flexShrink: 0, ...style }}
      />
    );
  }

  return (
    <span style={{ fontSize: size * 0.55, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
      {src || '🍹'}
    </span>
  );
}
