import { normalizeDashboardItems } from '../src/api/dashboard';

test('normalizes dashboard arrays and preserves optional image details', () => {
  expect(
    normalizeDashboardItems([
      {
        id: 17,
        title: 'Featured',
        description: 'A sample item',
        imageUrl: 'https://example.com/image.jpg',
      },
    ]),
  ).toEqual([
    {
      id: '17',
      title: 'Featured',
      description: 'A sample item',
      imageUrl: 'https://example.com/image.jpg',
    },
  ]);
});

test('supports item collections and safely ignores unknown payload shapes', () => {
  expect(normalizeDashboardItems({ items: [{ name: 'News' }] })).toEqual([
    {
      id: '0',
      title: 'News',
      description: undefined,
      imageUrl: undefined,
    },
  ]);
  expect(normalizeDashboardItems({ data: [] })).toEqual([]);
});
