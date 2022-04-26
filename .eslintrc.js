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
