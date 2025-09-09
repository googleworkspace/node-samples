/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * limitations under the License.
 */

import google from 'eslint-config-google';

export default {
  rules: {
    ...google.rules,
    'require-jsdoc': 'off',
    'max-len': ['warn', {code: 100}],
    'camelcase': [
      'warn',
      {
        ignoreDestructuring: true,
        ignoreImports: true,
        allow: [
          'access_type',
          'redirect_uris',
          'client_id',
          'client_secret',
          'refresh_token',
        ],
      },
    ],
  },
};
