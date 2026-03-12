import React from 'react';

export type ButtonVariant = 
  | 'primary'      
  | 'primary-light'
  | 'secondary'    
  | 'danger'       
  | 'danger-light' 
  | 'success'      
  | 'outline'      
  | 'ghost';       

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', fullWidth = false, disabled, children, ...props }, ref) => {
    
    let variantStyles = '';
    switch (variant) {
      case 'primary':
        variantStyles = 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm';
        break;
      case 'primary-light':
        variantStyles = 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100';
        break;
      case 'secondary':
        variantStyles = 'bg-gray-100 text-gray-700 hover:bg-gray-200';
        break;
      case 'danger':
        variantStyles = 'bg-red-600 text-white hover:bg-red-700 shadow-sm';
        break;
      case 'danger-light':
        variantStyles = 'bg-red-50 text-red-600 hover:bg-red-100';
        break;
      case 'success':
        variantStyles = 'bg-green-600 text-white hover:bg-green-700 shadow-sm';
        break;
      case 'outline':
        variantStyles = 'border border-gray-200 text-gray-700 hover:bg-gray-50';
        break;
      case 'ghost':
        variantStyles = 'text-gray-500 hover:bg-gray-100 hover:text-gray-900';
        break;
    }

    if (disabled) {
      if (variant === 'ghost') {
        variantStyles = 'text-gray-300 cursor-not-allowed';
      } else {
        variantStyles = 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none';
      }
    }

    let sizeStyles = '';
    switch (size) {
      case 'sm':
        sizeStyles = 'py-1.5 px-3 text-sm rounded-md';
        break;
      case 'md':
        sizeStyles = 'py-2 px-4 rounded-md';
        break;
      case 'lg':
        sizeStyles = 'py-2.5 px-6 rounded-lg text-lg';
        break;
    }

    const widthStyles = fullWidth ? 'w-full flex justify-center items-center' : 'inline-flex justify-center items-center';

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`transition font-medium ${sizeStyles} ${variantStyles} ${widthStyles} ${className}`.trim()}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
