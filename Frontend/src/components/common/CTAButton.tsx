import React from 'react';

interface CTAButtonProps {
  text: string;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  text,
  onClick,
  href,
  variant = 'primary',
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50 focus:ring-primary-500',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} aria-label={text}>
        {text}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes} aria-label={text}>
      {text}
    </button>
  );
};

