module.exports = {
   root: true,
   env: {
      node: true,
   },
   extends: [
      'plugin:vue/vue3-essential',
      '@silvermine/eslint-config/node',
      '@vue/typescript/recommended',
   ],
   parserOptions: {
      ecmaVersion: 2020,
   },
};
