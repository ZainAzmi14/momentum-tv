/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('@shopify/flash-list', () => 'FlashList');
jest.mock('react-native-device-info', () => ({
  getModel: jest.fn().mockResolvedValue('TV'),
  getSystemVersion: jest.fn().mockResolvedValue('1'),
  getTotalMemory: jest.fn().mockResolvedValue(1024 ** 3),
}));
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn().mockResolvedValue({
    type: 'wifi',
    isConnected: true,
    isInternetReachable: true,
  }),
}));

test('renders correctly', async () => {
  globalThis.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => [],
  }) as unknown as typeof fetch;
  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(<App />);
  });
});
