import React, { forwardRef } from 'react';
import { classNames } from '../../utils/classNames';

export const Input = forwardRef(
  (
    {
      className,
      label,
      error,
      helperText,
      ...props
    },
    ref
  ) => {
    return (
      <div>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            {label}
          </label>
        )}
        <div className="mt-2">
          <input
            ref={ref}
            className={classNames(
              'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6',
              error
                ? 'ring-red-300 focus:ring-red-500'
                : 'ring-gray-300 focus:ring-primary-500',
              className
            )}
            {...props}
          />
        </div>
        {(error || helperText) && (
          <p
            className={classNames(
              'mt-2 text-sm',
              error ? 'text-red-600' : 'text-gray-500'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input'; 