import React from 'react';

interface LogoProps {
  variant?: 'color' | 'mono' | 'inverse';
  height?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'color', height = 28, className = '' }) => {
  const isColor = variant === 'color';
  const isInverse = variant === 'inverse';
  
  const textColor = isInverse ? 'var(--branco)' : isColor ? 'var(--exodo-red)' : 'var(--preto)';
  const tagColor = isInverse ? 'var(--cinza-claro)' : 'var(--preto)';
  const dotColor = 'var(--exodo-red)';

  return (
    <div className={`inline-flex flex-col items-start select-none ${className}`} style={{ height: `${height * 1.5}px` }}>
      <div className="flex items-center gap-1 leading-none" style={{ height: `${height}px` }}>
        <svg 
          viewBox="0 0 320 80" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ height: '100%', width: 'auto' }}
        >
          {/* Caret ^ over 'e' */}
          <path 
            d="M 32 22 L 48 6 L 64 22 L 56 22 L 48 14 L 40 22 Z" 
            fill={textColor} 
          />
          {/* Main 'êxodo' Wordmark */}
          <text 
            x="10" 
            y="72" 
            fontFamily="'Montserrat', sans-serif" 
            fontWeight="800" 
            fontSize="68" 
            letterSpacing="-2"
            fill={textColor}
          >
            êxodo
          </text>
        </svg>
      </div>
      <div 
        className="font-subtitle font-bold text-[0.55rem] tracking-[0.18em] uppercase flex items-center gap-1.5 mt-1"
        style={{ color: tagColor }}
      >
        <span>ESTRATÉGIA</span>
        <span style={{ color: dotColor }}>•</span>
        <span>DIAGNÓSTICO</span>
        <span style={{ color: dotColor }}>•</span>
        <span>CRESCIMENTO</span>
      </div>
    </div>
  );
};
