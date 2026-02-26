import React from 'react';

/**
 * Neo-brutalist Button Component
 * Features hard shadows and press-down animation
 */
export default function Button({
    children,
    onClick,
    variant = 'primary',
    disabled = false,
    className = ''
}) {
    const baseClasses = "px-6 py-3 font-mono font-bold uppercase border-2 border-ink transition-all duration-150 active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0";

    const variantClasses = {
        primary: "bg-sand text-green-600 shadow-hard-sm hover:bg-green-600 hover:text-white",
        danger: "bg-sand text-red-600 shadow-hard-sm hover:bg-red-600 hover:text-white",
        secondary: "bg-sand text-ink shadow-hard-sm hover:bg-ink hover:text-sand",
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        >
            {children}
        </button>
    );
}
