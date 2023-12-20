const SESSION_SECRET = require('../config/auth');

test('SESSION_SECRET should be defined', () => {
  expect(SESSION_SECRET).toBeDefined();
});