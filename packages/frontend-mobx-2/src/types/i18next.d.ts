/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable perfectionist/sort-imports */
// Module augmentation for i18next typing.
import 'i18next';
import type enCommon from '../assets/locales/en/common.json';

// Derive the default namespace resources shape from the English source of truth
type DefaultResources = typeof enCommon;

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: DefaultResources;
    };
  }
}

export {};
