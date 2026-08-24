export interface CollectionCard {
  readonly slug: string;
  readonly number: string;
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly imageAlt: string;
}

export const collections: readonly CollectionCard[] = [
  {
    slug: 'women',
    number: '01',
    title: 'Women',
    description: 'Frames shaped for her everyday look.',
    image: '/images/hero/woman-1.webp',
    imageAlt: 'Women collection',
  },
  {
    slug: 'men',
    number: '02',
    title: 'Men',
    description: 'Clean silhouettes built for him.',
    image: '/images/hero/man-1.webp',
    imageAlt: 'Men collection',
  },
  {
    slug: 'kids',
    number: '03',
    title: 'Kids',
    description: 'Durable, comfortable frames for little faces.',
    image: '/images/hero/woman-2.webp',
    imageAlt: 'Kids collection',
  },
];
