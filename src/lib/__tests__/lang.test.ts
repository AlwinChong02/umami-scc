import { getDateLocale, getTextDirection, languages } from '../lang';
import { enUS, fr } from 'date-fns/locale';

test('getDateLocale should return the correct date locale for a supported language', () => {
  expect(getDateLocale('en-US')).toBe(enUS);
  expect(getDateLocale('fr-FR')).toBe(fr);
});

test('getDateLocale should return the default date locale (enUS) for an unsupported language', () => {
  expect(getDateLocale('unsupported-locale')).toBe(enUS);
});

test('getDateLocale should return the default date locale (enUS) for an empty locale', () => {
  expect(getDateLocale('')).toBe(enUS);
});

test('getTextDirection should return "ltr" for left-to-right languages', () => {
  expect(getTextDirection('en-US')).toBe('ltr');
  expect(getTextDirection('fr-FR')).toBe('ltr');
});

test('getTextDirection should return "rtl" for right-to-left languages', () => {
  expect(getTextDirection('ar-SA')).toBe('rtl');
  expect(getTextDirection('fa-IR')).toBe('rtl');
});

test('getTextDirection should return "ltr" for an unsupported language', () => {
  expect(getTextDirection('unsupported-locale')).toBe('ltr');
});

test('getTextDirection should return "ltr" for an empty locale', () => {
  expect(getTextDirection('')).toBe('ltr');
});

test('languages object should contain valid entries for each language', () => {
  Object.entries(languages).forEach(([locale, { label, dateLocale, dir }]: any) => {
    expect(typeof locale).toBe('string');
    expect(typeof label).toBe('string');
    expect(['ltr', 'rtl', undefined]).toContain(dir);
    if (dateLocale) {
      expect(typeof dateLocale).toBe('object');
    }
  });
});
