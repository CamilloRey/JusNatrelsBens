import { C } from './colors';

export const CSS = {
  root: {
    fontFamily: "'DM Sans', sans-serif",
    margin: 0,
    padding: 0,
    minHeight: '100vh',
    color: C.dark,
    background: C.cream,
  },
  heading: {
    fontFamily: "'Playfair Display', serif",
  },
} as const;

export const inputSt: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 10,
  border: `1px solid ${C.border}`,
  fontSize: 14,
  outline: 'none',
  fontFamily: 'inherit',
  background: '#fff',
  color: C.dark,
  boxSizing: 'border-box',
};

export const labelSt: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: C.muted,
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
};

// Needed for the import above
import type React from 'react';
