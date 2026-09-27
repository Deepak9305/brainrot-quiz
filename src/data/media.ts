export interface LocalMediaAsset {
  src: string;
  alt: string;
  label: string;
  sourceUrl?: string;
  license?: string;
  author?: string;
  attributionRequired?: boolean;
  crop?: { x: number; y: number; scale: number };
}

/**
 * The quiz never falls back to a random stock URL. These references are bundled
 * locally so the visual clue remains available offline and can be audited.
 */
export const LOCAL_MEDIA: Record<string, LocalMediaAsset> = {
  tralalero_tralala: {
    src: '/media/brainrot/tralalero-tralala.webp',
    alt: 'Tralalero Tralala, a blue three-legged shark wearing sneakers',
    label: 'LOCAL CHARACTER REFERENCE',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tralalero_Tralala.webp',
    license: 'See bundled media README for source and rights status.',
    attributionRequired: true,
    crop: { x: 50, y: 50, scale: 1.65 },
  },
  bombardiro_crocodilo: {
    src: '/media/brainrot/bombardiro-crocodilo.jpg',
    alt: 'Bombardiro Crocodilo, a crocodile fused with a bomber aircraft',
    label: 'LOCAL CHARACTER REFERENCE',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bombardiro_Crocodillo.jpg',
    license: 'See bundled media README for source and rights status.',
    attributionRequired: true,
    crop: { x: 52, y: 48, scale: 1.55 },
  },
  tung_tung_tung_sahur: {
    src: '/media/brainrot/tung-tung-tung-sahur.webp',
    alt: 'Tung Tung Tung Sahur, a wooden drum character holding a bat',
    label: 'LOCAL CHARACTER REFERENCE',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tung_tung_tung_sahur_(cropped).webp',
    license: 'See bundled media README for source and rights status.',
    attributionRequired: true,
    crop: { x: 50, y: 42, scale: 1.7 },
  },
  brr_brr_patapim: {
    src: '/media/brainrot/brr-brr-patapim.jpg',
    alt: 'Brr Brr Patapim, a forest creature with long legs and large feet',
    label: 'LOCAL CHARACTER REFERENCE',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Brr_brr_patapim.jpg',
    license: 'See bundled media README for source and rights status.',
    crop: { x: 50, y: 55, scale: 1.5 },
  },
};

export function getLocalMediaAsset(key?: string): LocalMediaAsset | undefined {
  return key ? LOCAL_MEDIA[key] : undefined;
}
