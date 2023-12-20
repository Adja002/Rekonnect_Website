const { addAuthVariablesToEJS } = require('../middleware/authMiddleware');

test('addAuthVariablesToEJS should add auth variables to EJS locals', () => {
  const req = { user: { id: 1, username: 'testuser' } };
  const res = { locals: { isAuthenticated: false } }; // Initialize res.locals.isAuthenticated to false
  const next = jest.fn();

  const locals = {};
  const expectedLocals = { user: { id: 1, username: 'testuser' }, isAuthenticated: true };

  addAuthVariablesToEJS(req, res, next);

  expect(next).toHaveBeenCalled();
  expect(res.locals).toEqual(expectedLocals);
});