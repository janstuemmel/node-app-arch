jest.mock('../src/config', () => {
  const config = require.requireActual('../src/config');
  return Object.assign(config, {
    db: Object.assign(config.db, { host: 'test-db' })
  });
});
