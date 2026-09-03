import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glow = false,
  hoverEffect = true,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-2xl p-6 transition-all duration-300',
          glow ? 'glass-panel-glow' : 'glass-panel',
          hoverEffect && 'hover:-translate-y-1 hover:shadow-2xl'
        ),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
