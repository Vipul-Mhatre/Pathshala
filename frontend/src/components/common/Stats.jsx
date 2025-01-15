import React from 'react';
import { classNames } from '../../utils/classNames';

export function Stats({ stats, className }) {
  return (
    <div>
      <dl
        className={classNames(
          'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4',
          className
        )}
      >
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              {stat.icon && (
                <div className="absolute rounded-md bg-primary-500 p-3">
                  <stat.icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
              )}
              <p
                className={classNames(
                  'truncate text-sm font-medium text-gray-500',
                  stat.icon ? 'ml-16' : ''
                )}
              >
                {stat.name}
              </p>
            </dt>
            <dd
              className={classNames(
                'flex items-baseline pb-6 sm:pb-7',
                stat.icon ? 'ml-16' : ''
              )}
            >
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
                {stat.unit && (
                  <span className="text-sm text-gray-500">{stat.unit}</span>
                )}
              </p>
              {stat.change && (
                <p
                  className={classNames(
                    'ml-2 flex items-baseline text-sm font-semibold',
                    stat.change.type === 'increase'
                      ? 'text-green-600'
                      : 'text-red-600'
                  )}
                >
                  {stat.change.type === 'increase' ? (
                    <span>↑</span>
                  ) : (
                    <span>↓</span>
                  )}
                  {stat.change.value}%
                </p>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
} 