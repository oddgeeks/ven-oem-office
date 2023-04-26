module.exports = {
  rules: { 'header-max-length': [0, 'always', 200] },
  extends: ['@commitlint/config-conventional'],
  ignores: [(message) => message.includes('VEN')],
};
