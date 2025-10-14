import { createDirectus, rest } from '@directus/sdk';

const directus = createDirectus('http://luminar-edu.nl').with(
    rest({
    onRequest: (options) => ({ ...options, cache: 'no-store' }),
    })
  );

export default directus;
