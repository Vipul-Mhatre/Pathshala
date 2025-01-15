import React from 'react';
import { classNames } from '../../utils/classNames';

const variants = {
  gray: 'bg-gray-50 text-gray-600 ring-gray-500/10',
  red: 'bg-red-50 text-red-700 ring-red-600/10',
  yellow: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
  green: 'bg-green-50 text-green-700 ring-green-600/20',
  blue: 'bg-blue-50 text-blue-700 ring-blue-700/10',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-700/10',
  purple: 'bg-purple-50 text-purple-700 ring-purple-700/10',
  pink: 'bg-pink-50 text-pink-700 ring-pink-700/10',
};

const sizes = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2 py-1 text-sm',
  lg: 'px-3 py-1 text-sm',
};

export function Badge({
  children,
  variant = 'gray',
  size = 'md',
  className,
}) {
  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-md font-medium ring-1 ring-inset',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
} 