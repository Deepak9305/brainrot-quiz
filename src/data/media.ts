export interface LocalMediaAsset {
  src: string;
  alt: string;
  label: string;
  sourceUrl?: string;
  licenseName?: string;
  licenseUrl?: string;
  author?: string;
  attributionRequired?: boolean;
  notes?: string;
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
    licenseName: 'Wikimedia Commons rights statement',
    licenseUrl: 'https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia',
    author: 'See source page for uploader/rights details',
    attributionRequired: true,
    notes: 'Commons page describes this as a public-domain / AI-generated reference; verify commercial use and trademark issues before release.',
    crop: { x: 50, y: 50, scale: 1.65 },
  },
  bombardiro_crocodilo: {
    src: '/media/brainrot/bombardiro-crocodilo.jpg',
    alt: 'Bombardiro Crocodilo, a crocodile fused with a bomber aircraft',
    label: 'LOCAL CHARACTER REFERENCE',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bombardiro_Crocodillo.jpg',
    licenseName: 'Wikimedia Commons rights statement',
    licenseUrl: 'https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia',
    author: 'See source page for uploader/rights details',
    attributionRequired: true,
    notes: 'Commons page describes this as a public-domain / AI-generated reference; verify commercial use and trademark issues before release.',
    crop: { x: 52, y: 48, scale: 1.55 },
  },
  tung_tung_tung_sahur: {
    src: '/media/brainrot/tung-tung-tung-sahur.webp',
    alt: 'Tung Tung Tung Sahur, a wooden drum character holding a bat',
    label: 'LOCAL CHARACTER REFERENCE',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tung_tung_tung_sahur_(cropped).webp',
    licenseName: 'Wikimedia Commons rights statement',
    licenseUrl: 'https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia',
    author: 'See source page for uploader/rights details',
    attributionRequired: true,
    notes: 'Commons page describes this as a public-domain / AI-generated reference; verify commercial use and trademark issues before release.',
    crop: { x: 50, y: 42, scale: 1.7 },
  },
  brr_brr_patapim: {
    src: '/media/brainrot/brr-brr-patapim.jpg',
    alt: 'Brr Brr Patapim, a forest creature with long legs and large feet',
    label: 'LOCAL CHARACTER REFERENCE',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Brr_brr_patapim.jpg',
    licenseName: 'Wikimedia Commons rights statement',
    licenseUrl: 'https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia',
    author: 'See source page for uploader/rights details',
    attributionRequired: true,
    notes: 'Commons page describes this as a public-domain / AI-generated reference; verify commercial use and trademark issues before release.',
    crop: { x: 50, y: 55, scale: 1.5 },
  },
  ballerina_cappuccina: {
    src: '/media/brainrot/ballerina-cappuccina.png',
    alt: 'Ballerina Cappuccina, a ballerina with a cappuccino cup head',
    label: 'LOCAL CHARACTER REFERENCE',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ballerina_Cappuccina.png',
    licenseName: 'Public domain',
    licenseUrl: 'https://commons.wikimedia.org/wiki/File:Ballerina_Cappuccina.png',
    author: 'Unknown (TikTok anonymous users)',
    attributionRequired: false,
    notes: 'Wikimedia Commons file page lists a public-domain status; verify commercial use and trademark considerations before release.',
    crop: { x: 50, y: 48, scale: 1.35 },
  },
  bombini_gusini: {
    src: '/media/brainrot/bombini-gusini.webp',
    alt: 'Bombini Gusini, a goose and aircraft mashup',
    label: 'LOCAL CHARACTER REFERENCE',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bombini_Gusini.webp',
    licenseName: 'Public domain',
    licenseUrl: 'https://commons.wikimedia.org/wiki/File:Bombini_Gusini.webp',
    author: 'Unknown (TikTok anonymous users)',
    attributionRequired: false,
    notes: 'Wikimedia Commons file page lists a public-domain status; the depiction is a community meme reference.',
    crop: { x: 50, y: 50, scale: 1.35 },
  },
  chimpanzini_bananini: {
    src: '/media/brainrot/chimpanzini-bananini.webp',
    alt: 'Chimpanzini Bananini, a monkey and banana mashup',
    label: 'LOCAL CHARACTER REFERENCE',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:ChimpanziniBananini.webp',
    licenseName: 'Public domain',
    licenseUrl: 'https://commons.wikimedia.org/wiki/File:ChimpanziniBananini.webp',
    author: 'Unknown (TikTok anonymous users)',
    attributionRequired: false,
    notes: 'Wikimedia Commons file page lists a public-domain status; verify commercial use and trademark considerations before release.',
    crop: { x: 50, y: 50, scale: 1.3 },
  },
  liril_larila: {
    src: '/media/brainrot/liril-larila.webp',
    alt: 'Lirili Larila, an elephant and cactus mashup in sandals',
    label: 'LOCAL CHARACTER REFERENCE',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Liril%C3%AC_Laril%C3%A0.webp',
    licenseName: 'Public domain',
    licenseUrl: 'https://commons.wikimedia.org/wiki/File:Liril%C3%AC_Laril%C3%A0.webp',
    author: 'Unknown (TikTok anonymous users)',
    attributionRequired: false,
    notes: 'Wikimedia Commons file page lists a public-domain status; verify commercial use and trademark considerations before release.',
    crop: { x: 50, y: 50, scale: 1.3 },
  },
};

export function getLocalMediaAsset(key?: string): LocalMediaAsset | undefined {
  return key ? LOCAL_MEDIA[key] : undefined;
}
