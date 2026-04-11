import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = "", 
  ...props 
}) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50";
  
  const variants = {
    primary: "bg-[#3c606b] text-white hover:bg-[#2a454d]",
    secondary: "bg-[#7db9b6] text-white hover:bg-[#6ba8a5]",
    outline: "border-2 border-[#3c606b] text-[#3c606b] hover:bg-[#3c606b] hover:text-white",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? "Cargando..." : children}
    </button>
  );
};