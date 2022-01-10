import { customCurrency } from './MoneyUtility';

test('converts number to currency', () => {
  const testNumber = 1000;
  const convertedNumber = customCurrency(testNumber).format();
  expect(convertedNumber).toBe('$1 000');
});