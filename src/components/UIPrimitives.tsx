import React from 'react';

// Tag Component
export interface TagProps {
  children: React.ReactNode;
  tone?: 'diagnostico' | 'evidencia' | 'processo' | 'informacao' | 'inverse';
  className?: string;
  style?: React.CSSProperties;
}

export const Tag: React.FC<TagProps> = ({ children, tone = 'diagnostico', className = '', style }) => {
  const tonesMap = {
    diagnostico: 'bg-[var(--preto)] text-[var(--branco)] border border-[var(--preto)]',
    evidencia: 'bg-transparent text-[var(--exodo-red)] border border-[var(--exodo-red)]',
    processo: 'bg-transparent text-[var(--cinza-escuro)] border border-[var(--cinza-medio)]',
    informacao: 'bg-[var(--cinza-claro)] text-[var(--cinza-escuro)] border border-transparent',
    inverse: 'bg-[var(--branco)] text-[var(--preto)] border border-[var(--branco)]',
  };

  return (
    <span
      className={`font-subtitle font-bold text-[0.7rem] uppercase tracking-[var(--tracking-wider)] px-3 py-1.5 inline-block leading-none ${tonesMap[tone]} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
};

// Button Component
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  className = '',
  onClick,
  style,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3.5 py-2 text-[0.7rem] min-h-[38px] sm:min-h-[40px]',
    md: 'px-5 py-2.5 sm:px-6 sm:py-3 text-[0.8rem] min-h-[44px]',
    lg: 'px-6 py-3.5 sm:px-7 sm:py-4 text-[0.85rem] min-h-[48px]',
  };

  const variantClasses = {
    primary: 'bg-[var(--exodo-red)] text-[var(--branco)] border border-[var(--exodo-red)] hover:bg-[var(--preto)] hover:border-[var(--preto)] active:scale-[0.98]',
    secondary: 'bg-transparent text-[var(--exodo-red)] border border-[var(--exodo-red)] hover:bg-[var(--exodo-red)] hover:text-[var(--branco)] active:scale-[0.98]',
    tertiary: 'bg-transparent text-[var(--text-secondary)] border border-[var(--cinza-medio)] hover:bg-[var(--preto)] hover:text-[var(--branco)] hover:border-[var(--preto)] active:scale-[0.98]',
    link: 'bg-transparent text-[var(--exodo-red)] border-none p-1 hover:text-[var(--preto)] min-h-0',
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`font-subtitle font-bold uppercase tracking-[var(--tracking-wide)] cursor-pointer inline-flex items-center justify-center gap-2 transition-all duration-150 rounded-none ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
      style={style}
      {...props}
    >
      {children}
      {variant === 'link' && <span>→</span>}
    </button>
  );
};

// CornerAccent Component
export interface CornerAccentProps {
  variant?: 'fino' | 'medio' | 'diagonal' | 'arredondado' | 'barra';
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const CornerAccent: React.FC<CornerAccentProps> = ({
  variant = 'arredondado',
  size = 100,
  className = '',
  style,
}) => {
  if (variant === 'fino') {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          borderTop: '2px solid var(--exodo-red)',
          borderRight: '2px solid var(--exodo-red)',
          ...style,
        }}
      />
    );
  }

  if (variant === 'medio') {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          borderTop: '6px solid var(--exodo-red)',
          borderRight: '6px solid var(--exodo-red)',
          ...style,
        }}
      />
    );
  }

  if (variant === 'diagonal') {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          background: 'var(--exodo-red)',
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
          ...style,
        }}
      />
    );
  }

  if (variant === 'barra') {
    return (
      <div
        className={className}
        style={{
          width: Math.max(4, size * 0.08),
          height: size,
          background: 'var(--exodo-red)',
          ...style,
        }}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        background: 'var(--exodo-red)',
        borderRadius: `0 ${size}px 0 0`,
        ...style,
      }}
    />
  );
};

// Callout Component
export interface CalloutProps {
  label?: string;
  children: React.ReactNode;
  tone?: 'default' | 'accent';
  style?: React.CSSProperties;
  className?: string;
}

export const Callout: React.FC<CalloutProps> = ({
  label = 'Ponto de Atenção',
  children,
  tone = 'default',
  style,
  className = '',
}) => {
  const isAccent = tone === 'accent';
  const iconColor = isAccent ? 'var(--exodo-red)' : 'var(--preto)';

  return (
    <div
      className={`flex gap-4 items-start bg-[var(--cinza-claro)] p-5 md:p-6 ${className}`}
      style={style}
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center font-subtitle font-bold text-sm shrink-0 mt-0.5"
        style={{ border: `2px solid ${iconColor}`, color: iconColor }}
      >
        !
      </div>
      <div className="flex flex-col gap-1.5">
        <span
          className="font-subtitle font-bold text-[0.8rem] uppercase tracking-[var(--tracking-wide)]"
          style={{ color: iconColor }}
        >
          {label}
        </span>
        <div className="font-body text-[var(--text-primary)] text-sm md:text-base leading-[var(--lh-normal)]">
          {children}
        </div>
      </div>
    </div>
  );
};

// SectionTopic Component
export interface SectionTopicProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const SectionTopic: React.FC<SectionTopicProps> = ({
  label,
  children,
  className = '',
  style,
}) => {
  return (
    <div className={`flex flex-col gap-3 ${className}`} style={style}>
      <div className="flex items-center gap-2">
        <span className="w-3.5 h-0.5 bg-[var(--exodo-red)] shrink-0" />
        <span className="font-subtitle font-bold text-[0.7rem] uppercase tracking-[var(--tracking-wider)] text-[var(--text-secondary)] whitespace-nowrap">
          {label}
        </span>
      </div>
      <h3 className="m-0 font-display text-[var(--text-h1)] leading-[var(--lh-snug)] text-[var(--text-primary)]">
        {children}
      </h3>
    </div>
  );
};

// PullQuote Component
export interface PullQuoteProps {
  children: React.ReactNode;
  attribution?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const PullQuote: React.FC<PullQuoteProps> = ({
  children,
  attribution,
  className = '',
  style,
}) => {
  return (
    <figure className={`m-0 flex flex-col gap-4 ${className}`} style={style}>
      <span className="font-display text-4xl md:text-5xl leading-none text-[var(--exodo-red)]">
        “
      </span>
      <blockquote className="m-0 font-subtitle font-bold text-[var(--text-display)] leading-[var(--lh-snug)] text-[var(--text-primary)]">
        {children}
      </blockquote>
      {attribution && (
        <figcaption className="flex items-center gap-2.5 font-subtitle font-semibold text-[0.8rem] uppercase tracking-[var(--tracking-wide)] text-[var(--text-tertiary)]">
          <span className="w-4 h-0.5 bg-[var(--exodo-red)]" />
          {attribution}
        </figcaption>
      )}
    </figure>
  );
};

// Card Component
export interface CardProps {
  icon?: React.ReactNode;
  title?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  icon,
  title,
  children,
  className = '',
  style,
}) => {
  return (
    <div
      className={`bg-[var(--branco)] border border-[var(--border-default)] rounded-[var(--radius-sm)] p-5 md:p-6 flex flex-col gap-3 ${className}`}
      style={style}
    >
      {icon && (
        <div className="w-8 h-8 flex items-center justify-center bg-[var(--cinza-claro)] text-[var(--preto)]">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="m-0 font-subtitle font-bold text-[0.85rem] uppercase tracking-[var(--tracking-wide)] text-[var(--text-primary)]">
          {title}
        </h3>
      )}
      {children && (
        <div className="font-body text-sm md:text-base leading-[var(--lh-normal)] text-[var(--text-secondary)]">
          {children}
        </div>
      )}
    </div>
  );
};

// Divider Component
export interface DividerProps {
  variant?: 'continua' | 'secao' | 'pontilhada' | 'vertical' | 'curta';
  className?: string;
  style?: React.CSSProperties;
}

export const Divider: React.FC<DividerProps> = ({
  variant = 'continua',
  className = '',
  style,
}) => {
  if (variant === 'vertical') {
    return <div className={`w-[1px] self-stretch bg-[var(--preto)] ${className}`} style={style} />;
  }
  if (variant === 'curta') {
    return <div className={`h-[2px] w-10 bg-[var(--preto)] ${className}`} style={style} />;
  }
  if (variant === 'secao') {
    return <div className={`h-[3px] w-full bg-[var(--exodo-red)] ${className}`} style={style} />;
  }
  if (variant === 'pontilhada') {
    return (
      <div
        className={`h-[1px] w-full ${className}`}
        style={{
          backgroundImage: 'linear-gradient(to right, var(--cinza-medio) 40%, transparent 0%)',
          backgroundSize: '8px 1px',
          backgroundRepeat: 'repeat-x',
          ...style,
        }}
      />
    );
  }
  return <div className={`h-[1px] w-full bg-[var(--border-default)] ${className}`} style={style} />;
};
