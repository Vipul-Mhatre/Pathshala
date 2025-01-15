import React from 'react';
import { classNames } from '../../utils/classNames';

export function PageHeader({ title, description, actions, className }) {
  return (
    <div
      className={classNames(
        'md:flex md:items-center md:justify-between',
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm leading-6 text-gray-500">{description}</p>
        )}
      </div>
      {actions && <div className="mt-4 flex md:ml-4 md:mt-0">{actions}</div>}
    </div>
  );
} 