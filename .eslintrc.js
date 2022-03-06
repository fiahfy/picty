module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['@fiahfy/next'],
  rules: {
    'react/display-name': 'off',
    'react/jsx-sort-props': 'error',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off', // temporary
  },
}
