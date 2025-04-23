import * as format from '../format';
import { expect } from '@jest/globals';

test('parseTime', () => {
  expect(format.parseTime(86400 + 3600 + 60 + 1)).toEqual({
    days: 1,
    hours: 1,
    minutes: 1,
    seconds: 1,
    ms: 0,
  });
  expect(format.parseTime(1.5)).toEqual({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 1,
    ms: 500,
  });
});

test('formatTime', () => {
  expect(format.formatTime(3600 + 60 + 1)).toBe('1:01:01');
});

test('formatShortTime', () => {
  expect(format.formatShortTime(3600 + 60 + 1)).toBe('1m1s');

  expect(format.formatShortTime(3600 + 60 + 1, ['h', 'm', 's'])).toBe('1h1m1s');
});

test('formatNumber', () => {
  expect(format.formatNumber('10.2')).toBe('10');
  expect(format.formatNumber('10.5')).toBe('11');
});

test('formatLongNumber', () => {
  expect(format.formatLongNumber(1200000)).toBe('1.2m');
  expect(format.formatLongNumber(575000)).toBe('575k');
  expect(format.formatLongNumber(10500)).toBe('10.5k');
  expect(format.formatLongNumber(1200)).toBe('1.20k');
});

test('stringToColor', () => {
  expect(format.stringToColor('hello')).toBe('#d218e9');
  expect(format.stringToColor('goodbye')).toBe('#11e956');
});

test('formats USD currency in en-US locale', () => {
  expect(format.formatCurrency(1000, 'USD', 'en-US')).toBe('$1,000.00');
});

test('formats EUR currency in de-DE locale', () => {
  expect(format.formatCurrency(1000, 'EUR', 'de-DE')).toBe('1.000,00 €');
});

test('formats JPY currency in ja-JP locale', () => {
  expect(format.formatCurrency(5000, 'JPY', 'ja-JP')).toBe('￥5,000');
});

test('falls back to USD if given invalid currency code', () => {
  expect(format.formatCurrency(1000, 'INVALID')).toBe('$1,000.00');
});

test('defaults to en-US if locale is not provided', () => {
  expect(format.formatCurrency(200, 'USD')).toBe('$200.00');
});

test('formats value in billions with "b" suffix', () => {
  expect(format.formatLongCurrency(1500000000, 'USD')).toBe('$1.50b');
});

test('formats value in millions with "m" suffix', () => {
  expect(format.formatLongCurrency(2500000, 'USD')).toBe('$2.50m');
});

test('formats value in thousands with "k" suffix', () => {
  expect(format.formatLongCurrency(7200, 'USD')).toBe('$7.20k');
});

test('formats value less than 1000 normally', () => {
  expect(format.formatLongCurrency(999, 'USD')).toBe('$999.00');
});

test('handles zero correctly', () => {
  expect(format.formatLongCurrency(0, 'USD')).toBe('$0.00');
});
