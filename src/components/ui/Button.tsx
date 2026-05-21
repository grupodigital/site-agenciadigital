'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';

type Variant = 'primary' | 'secondary';

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:text-zinc-900',
  secondary: 'bg-white text-zinc-900',
};

const BASE_CLASSES =
  'relative inline-block overflow-hidden px-7 py-3 text-sm font-semibold transition-colors duration-300';

type Props = {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  /** Applied to the outer element — use for layout/positioning (margin, etc). */
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
};

export default function Button({
  href,
  children,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
  'aria-label': ariaLabel,
}: Props) {
  const [hovered, setHovered] = useState(false);

  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`;

  // Fill overlay grows from left to right on hover and shrinks back to the
  // left on unhover — like an analog thermometer rising and falling.
  // transform-origin: left keeps the left edge anchored; scaleX 0 → 1 makes
  // the right edge sweep across, scaleX 1 → 0 retracts it back the same way.
  const inner = (
    <>
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-secondary"
        animate={{ scaleX: hovered ? 1 : 0 }}
        style={{ transformOrigin: 'left' }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      />
      <span className="relative inline-flex items-center gap-2">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        aria-label={ariaLabel}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {inner}
      </Link>
    );
  }
  return (
    <button
      type={type}
      className={classes}
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {inner}
    </button>
  );
}
