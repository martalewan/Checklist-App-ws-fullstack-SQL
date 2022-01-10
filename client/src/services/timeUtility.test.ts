import { formatHours } from './TimeUtility';

test('converts number to time format', () => {
  const testNumber = 1000;
  const convertedNumber = formatHours(testNumber);
  expect(convertedNumber).toBe('41d 16h');
});