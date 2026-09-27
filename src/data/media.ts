export interface LocalMediaAsset {
  src: string;
  alt: string;
  label: string;
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
  },
  bombardiro_crocodilo: {
    src: '/media/brainrot/bombardiro-crocodilo.jpg',
    alt: 'Bombardiro Crocodilo, a crocodile fused with a bomber aircraft',
    label: 'LOCAL CHARACTER REFERENCE',
  },
  tung_tung_tung_sahur: {
    src: '/media/brainrot/tung-tung-tung-sahur.webp',
    alt: 'Tung Tung Tung Sahur, a wooden drum character holding a bat',
    label: 'LOCAL CHARACTER REFERENCE',
  },
  brr_brr_patapim: {
    src: '/media/brainrot/brr-brr-patapim.jpg',
    alt: 'Brr Brr Patapim, a forest creature with long legs and large feet',
    label: 'LOCAL CHARACTER REFERENCE',
  },
};

export function getLocalMediaAsset(key?: string): LocalMediaAsset | undefined {
  return key ? LOCAL_MEDIA[key] : undefined;
}
