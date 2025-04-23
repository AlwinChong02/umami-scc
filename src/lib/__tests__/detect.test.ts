import * as detect from '../detect';
import { expect } from '@jest/globals';

const IP = '127.0.0.1';

test('getIpAddress: Custom header', () => {
  process.env.CLIENT_IP_HEADER = 'x-custom-ip-header';
  expect(detect.getIpAddress(new Headers({ 'x-custom-ip-header': IP }))).toEqual(IP);
});

test('getIpAddress: Standard header', () => {
  expect(detect.getIpAddress(new Headers({ 'x-forwarded-for': IP }))).toEqual(IP);
});

test('getIpAddress: Forwarded header with IPv4', () => {
  expect(detect.getIpAddress(new Headers({ forwarded: 'for=192.168.1.1' }))).toEqual('192.168.1.1');
});

test('getIpAddress: Forwarded header with IPv6', () => {
  expect(
    detect.getIpAddress(new Headers({ forwarded: 'for=2001:0db8:85a3::8a2e:0370:7334' })),
  ).toEqual('2001:0db8:85a3::8a2e:0370:7334');
});

test('getIpAddress: No header', () => {
  expect(detect.getIpAddress(new Headers())).toEqual(null);
});

test('getIpAddress: x-forwarded-for with multiple IPs', () => {
  expect(
    detect.getIpAddress(new Headers({ 'x-forwarded-for': '203.0.113.1, 198.51.100.2' })),
  ).toEqual('203.0.113.1');
});

// Test cases for Desktop OS
test('returns "desktop" for wide screens with desktop OS', () => {
  expect(detect.getDevice('1920x1080', 'Windows')).toBe('desktop');
  expect(detect.getDevice('2560x1440', 'Mac OS')).toBe('desktop');
});

test('returns "laptop" for Chrome OS', () => {
  expect(detect.getDevice('1920x1080', 'Chrome OS')).toBe('laptop');
  expect(detect.getDevice('800x600', 'Chrome OS')).toBe('laptop');
});

test('returns "laptop" for medium screens with desktop OS', () => {
  expect(detect.getDevice('1366x768', 'Linux')).toBe('laptop');
});

// Test cases for Mobile OS
test('returns "mobile" for small screens with mobile OS', () => {
  expect(detect.getDevice('375x812', 'iOS')).toBe('mobile');
  expect(detect.getDevice('360x640', 'Android')).toBe('mobile');
});

test('returns "tablet" for Amazon OS', () => {
  expect(detect.getDevice('1920x1080', 'Amazon OS')).toBe('tablet');
  expect(detect.getDevice('600x800', 'Amazon OS')).toBe('tablet');
});

test('returns "tablet" for medium screens with mobile OS', () => {
  expect(detect.getDevice('800x1280', 'Android')).toBe('tablet');
});

// Test cases for unknown OS
test('returns "desktop" for wide screens with unknown OS', () => {
  expect(detect.getDevice('1920x1080', 'Unknown')).toBe('desktop');
});

test('returns "laptop" for medium screens with unknown OS', () => {
  expect(detect.getDevice('1366x768', '')).toBe('laptop');
});

test('returns "tablet" for small screens with unknown OS', () => {
  expect(detect.getDevice('800x600', 'Unknown')).toBe('tablet');
});

test('returns "mobile" for very small screens with unknown OS', () => {
  expect(detect.getDevice('320x480', '')).toBe('mobile');
});

// Edge cases
test('returns undefined for empty screen', () => {
  expect(detect.getDevice('', 'Windows')).toBeUndefined();
});

test('returns undefined when country is missing', () => {
  expect(detect.getRegionCode('', 'CA')).toBeUndefined();
  expect(detect.getRegionCode(null, 'CA')).toBeUndefined();
});

test('returns undefined when region is missing', () => {
  expect(detect.getRegionCode('US', '')).toBeUndefined();
  expect(detect.getRegionCode('US', null)).toBeUndefined();
});

test('returns region as-is when it already contains a hyphen', () => {
  expect(detect.getRegionCode('US', 'US-CA')).toBe('US-CA');
  expect(detect.getRegionCode('CA', 'CA-BC')).toBe('CA-BC');
});

test('combines country and region with hyphen when needed', () => {
  expect(detect.getRegionCode('US', 'CA')).toBe('US-CA');
  expect(detect.getRegionCode('GB', 'ENG')).toBe('GB-ENG');
});

test('handles whitespace in inputs', () => {
  expect(detect.getRegionCode(' US ', ' CA ')).toBe(' US - CA ');
  expect(detect.getRegionCode('GB', ' ENG ')).toBe('GB- ENG ');
});

test('returns undefined when input is undefined', () => {
  expect(detect.decodeHeader(undefined)).toBeUndefined();
});

test('returns null when input is null', () => {
  expect(detect.decodeHeader(null)).toBe(null);
});

test('handles empty string', () => {
  expect(detect.decodeHeader('')).toBe('');
});

test('handles ASCII characters', () => {
  expect(detect.decodeHeader('test123')).toBe('test123');
});

test('does not block IP outside CIDR range', () => {
  process.env.IGNORE_IP = '192.168.1.0/24';
  expect(detect.hasBlockedIp('192.168.2.1')).toBeFalsy();
});

test('does not block IP not in list', () => {
  process.env.IGNORE_IP = '10.0.0.1,172.16.0.1';
  expect(detect.hasBlockedIp('192.168.1.1')).toBeFalsy();
});

test('returns false if IGNORE_IP is undefined', () => {
  delete process.env.IGNORE_IP;
  expect(detect.hasBlockedIp('192.168.1.1')).toBeFalsy();
});
