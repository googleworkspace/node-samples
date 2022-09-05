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
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = {
  'extends': 'google',
  'parserOptions': {
    'ecmaVersion': 8,
    'sourceType': 'module',
  },
  'env': {
    'node': true,
  },
  'rules': {
    'require-jsdoc': 'off',
    'max-len': ['error', {'code': 100}],
    'camelcase': ['error', {
      'ignoreDestructuring': true,
      'ignoreImports': true,
      'allow': ['access_type', 'redirect_uris'],
    }],
  },
};
