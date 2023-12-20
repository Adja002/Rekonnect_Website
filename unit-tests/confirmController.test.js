const confirmController = require('../controllers/confirmController');
const ejs = require('ejs');
const path = require('path');

jest.mock('ejs');

describe('confirmController', () => {
  test('renders event-confirm.ejs with correct data', async () => {
    const existingConfirm = 'existingConfirm';
    const event = 'event';

    await confirmController();

    expect(ejs.renderFile).toHaveBeenCalledWith(
      path.join(__dirname, '..', 'views', 'event-confirm.ejs'),
      { confirm: existingConfirm, event }
    );
  });
});