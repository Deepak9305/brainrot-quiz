import { QuestionCategory, QuestionEra } from '../types';

export type MediaAssetType = 'public_domain' | 'licensed' | 'original_clue' | 'reference';

export interface LocalMediaAsset {
  src: string;
  alt: string;
  label: string;
  assetType: MediaAssetType;
  category?: QuestionCategory;
  era?: QuestionEra;
  createdForApp?: boolean;
  sourceUrl?: string;
  licenseName?: string;
  licenseUrl?: string;
  author?: string;
  attributionRequired?: boolean;
  notes?: string;
  crop?: { x: number; y: number; scale: number };
  fit?: 'contain' | 'cover';
  variants?: Partial<Record<'standard' | 'crop' | 'detail' | 'silhouette', { x: number; y: number; scale: number }>>;
}

/**
 * The quiz never falls back to a random stock URL. These references are bundled
 * locally so the visual clue remains available offline and can be audited.
 */
const LOCAL_MEDIA_DEFINITIONS: Record<string, Omit<LocalMediaAsset, 'assetType'> & { assetType?: MediaAssetType }> = {
  tralalero_tralala: {
    src: '/media/brainrot/tralalero-tralala.webp',
    alt: 'Tralalero Tralala, a blue three-legged shark wearing sneakers',
    label: 'LOCAL CHARACTER REFERENCE',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tralalero_Tralala.webp',
    licenseName: 'Public domain',
    licenseUrl: 'https://commons.wikimedia.org/wiki/File:Tralalero_Tralala.webp',
    author: '@amoamimandy.1a',
    attributionRequired: false,
    notes: 'Source page records this AI-generated reference as public domain.',
    crop: { x: 50, y: 50, scale: 1.65 },
    variants: {
      standard: { x: 50, y: 50, scale: 1 },
      crop: { x: 50, y: 70, scale: 1.55 },
      detail: { x: 50, y: 84, scale: 2.25 },
      silhouette: { x: 50, y: 52, scale: 1.05 },
    },
  },
  bombardiro_crocodilo: {
    src: '/media/brainrot/bombardiro-crocodilo.jpg',
    alt: 'Bombardiro Crocodilo, a crocodile fused with a bomber aircraft',
    label: 'LOCAL CHARACTER REFERENCE',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bombardiro_Crocodillo.jpg',
    licenseName: 'Public domain',
    licenseUrl: 'https://commons.wikimedia.org/wiki/File:Bombardiro_Crocodillo.jpg',
    author: '@armenjiharhanyan',
    attributionRequired: false,
    notes: 'Source page records this AI-generated reference as public domain.',
    crop: { x: 52, y: 48, scale: 1.55 },
    variants: {
      standard: { x: 52, y: 48, scale: 1 },
      crop: { x: 52, y: 50, scale: 1.55 },
      detail: { x: 62, y: 46, scale: 1.95 },
      silhouette: { x: 52, y: 48, scale: 1.05 },
    },
  },
  tung_tung_tung_sahur: {
    src: '/media/brainrot/tung-tung-tung-sahur.webp',
    alt: 'Tung Tung Tung Sahur, a wooden drum character holding a bat',
    label: 'LOCAL CHARACTER REFERENCE',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tung_tung_tung_sahur_(cropped).webp',
    licenseName: 'Public domain',
    licenseUrl: 'https://commons.wikimedia.org/wiki/File:Tung_tung_tung_sahur_(cropped).webp',
    author: 'Unknown (TikTok anonymous users)',
    attributionRequired: false,
    notes: 'Source page records this AI-generated reference as public domain.',
    crop: { x: 50, y: 42, scale: 1.7 },
    variants: {
      standard: { x: 50, y: 42, scale: 1 },
      crop: { x: 50, y: 62, scale: 1.55 },
      detail: { x: 48, y: 78, scale: 2.05 },
      silhouette: { x: 50, y: 42, scale: 1.05 },
    },
  },
  brr_brr_patapim: {
    src: '/media/brainrot/brr-brr-patapim.jpg',
    alt: 'Brr Brr Patapim, a forest creature with long legs and large feet',
    label: 'LOCAL CHARACTER REFERENCE',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Brr_brr_patapim.jpg',
    licenseName: 'Public domain',
    licenseUrl: 'https://commons.wikimedia.org/wiki/File:Brr_brr_patapim.jpg',
    author: 'Unknown (TikTok anonymous users)',
    attributionRequired: false,
    notes: 'Source page records this AI-generated reference as public domain.',
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
    notes: 'Source page records this AI-generated reference as public domain.',
    crop: { x: 50, y: 48, scale: 1.35 },
    variants: {
      standard: { x: 50, y: 48, scale: 1 },
      crop: { x: 50, y: 40, scale: 1.45 },
      detail: { x: 50, y: 24, scale: 1.95 },
      silhouette: { x: 50, y: 48, scale: 1.05 },
    },
  },
  bombombini_gusini: {
    src: '/media/brainrot/bombini-gusini.webp',
    alt: 'Bombini Gusini, a goose and aircraft mashup',
    label: 'LOCAL CHARACTER REFERENCE',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bombini_Gusini.webp',
    licenseName: 'Public domain',
    licenseUrl: 'https://commons.wikimedia.org/wiki/File:Bombini_Gusini.webp',
    author: 'Unknown (TikTok anonymous users)',
    attributionRequired: false,
    notes: 'Source page records this AI-generated reference as public domain.',
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
    notes: 'Source page records this AI-generated reference as public domain.',
    crop: { x: 50, y: 50, scale: 1.3 },
    variants: {
      standard: { x: 50, y: 50, scale: 1 },
      crop: { x: 50, y: 58, scale: 1.45 },
      detail: { x: 52, y: 72, scale: 1.9 },
      silhouette: { x: 50, y: 50, scale: 1.05 },
    },
  },
  lirili_larila: {
    src: '/media/brainrot/liril-larila.webp',
    alt: 'Lirili Larila, an elephant and cactus mashup in sandals',
    label: 'LOCAL CHARACTER REFERENCE',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Liril%C3%AC_Laril%C3%A0.webp',
    licenseName: 'Public domain',
    licenseUrl: 'https://commons.wikimedia.org/wiki/File:Liril%C3%AC_Laril%C3%A0.webp',
    author: 'Unknown (TikTok anonymous users)',
    attributionRequired: false,
    notes: 'Source page records this AI-generated reference as public domain.',
    crop: { x: 50, y: 50, scale: 1.3 },
  },
  boneca_ambalabu: {
    src: '/media/brainrot/boneca-ambalabu.jpg',
    alt: 'Boneca Ambalabu, an absurd frog and tire character reference',
    label: 'LOCAL CHARACTER REFERENCE',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Boneca_Ambalabu.jpg',
    licenseName: 'Public domain',
    licenseUrl: 'https://commons.wikimedia.org/wiki/File:Boneca_Ambalabu.jpg',
    author: 'Unknown author',
    attributionRequired: false,
    notes: 'Source page records this AI-generated reference as public domain.',
    crop: { x: 50, y: 48, scale: 1.25 },
  },
  cappuccino_assassino: {
    src: '/media/brainrot/cappuccino-assassino.webp',
    alt: 'Cappuccino Assassino, a coffee cup character with stealth energy',
    label: 'LOCAL CHARACTER REFERENCE',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Cappucino_assasino.webp',
    licenseName: 'Public domain',
    licenseUrl: 'https://commons.wikimedia.org/wiki/File:Cappucino_assasino.webp',
    author: 'Published by user alexey_pigeon',
    attributionRequired: false,
    notes: 'Source page records this AI-generated reference as public domain.',
    crop: { x: 50, y: 45, scale: 1.25 },
  },
  ecco_cavallo_virtuoso: {
    src: '/media/brainrot/ecco-cavallo-virtuoso.webp',
    alt: 'Ecco Cavallo Virtuoso, a surreal horse and piano character reference',
    label: 'LOCAL CHARACTER REFERENCE',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ecco_Cavallo_Virtuoso.webp',
    licenseName: 'Public domain',
    licenseUrl: 'https://commons.wikimedia.org/wiki/File:Ecco_Cavallo_Virtuoso.webp',
    author: 'Unknown author',
    attributionRequired: false,
    notes: 'Source page records this AI-generated reference as public domain.',
    fit: 'contain',
    crop: { x: 50, y: 50, scale: 1.15 },
  },
  frigo_camelo: {
    src: '/media/brainrot/frigo-camelo.png',
    alt: 'Frigo Camelo, a refrigerator and camel mashup',
    label: 'LOCAL CHARACTER REFERENCE',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Frigo_Camelo.png',
    licenseName: 'Public domain',
    licenseUrl: 'https://commons.wikimedia.org/wiki/File:Frigo_Camelo.png',
    author: 'Unknown author',
    attributionRequired: false,
    notes: 'Source page records this AI-generated reference as public domain.',
    crop: { x: 50, y: 48, scale: 1.2 },
  },
  frulli_frulla: {
    src: '/media/brainrot/frulli-frulla.jpg',
    alt: 'Frulli Frulla, a surreal Italian Brainrot character reference',
    label: 'LOCAL CHARACTER REFERENCE',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Frulli_Frulla.jpg',
    licenseName: 'Public domain',
    licenseUrl: 'https://commons.wikimedia.org/wiki/File:Frulli_Frulla.jpg',
    author: 'Unknown author',
    attributionRequired: false,
    notes: 'Source page records this AI-generated reference as public domain.',
    crop: { x: 50, y: 50, scale: 1.2 },
  },
  trippi_troppi: {
    src: '/media/brainrot/trippi-troppi.png',
    alt: 'Trippi Troppi, a fish and cat hybrid character reference',
    label: 'LOCAL CHARACTER REFERENCE',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Trippi_Troppi_Italian_brainrot.png',
    licenseName: 'Public domain',
    licenseUrl: 'https://commons.wikimedia.org/wiki/File:Trippi_Troppi_Italian_brainrot.png',
    author: 'Unknown author',
    attributionRequired: false,
    notes: 'Source page records this AI-generated reference as public domain.',
    crop: { x: 50, y: 50, scale: 1.15 },
  },
  udin_din_din_dun: {
    src: '/media/brainrot/udin-din-din-dun.jpg',
    alt: 'Udin Din Din Dun, a surreal Italian Brainrot character reference',
    label: 'LOCAL CHARACTER REFERENCE',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Udin_din_din_din_dun.jpg',
    licenseName: 'Public domain',
    licenseUrl: 'https://commons.wikimedia.org/wiki/File:Udin_din_din_din_dun.jpg',
    author: 'Unknown (TikTok anonymous users)',
    attributionRequired: false,
    notes: 'Source page records this AI-generated reference as public domain.',
    crop: { x: 50, y: 50, scale: 1.2 },
  },
  doge_meme_example: {
    src: '/media/memes/classic/doge-meme-example.jpg',
    alt: 'Doge meme example showing a Shiba Inu in snow with colorful caption text',
    label: 'AUTHENTIC MEME / CLASSIC IMAGE MACRO',
    assetType: 'licensed',
    category: 'classic_memes',
    era: 'classic',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Doge_meme_example.jpg',
    licenseName: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    author: 'likeaduck',
    attributionRequired: true,
    notes: 'Bundled from the original Wikimedia Commons file page; attribution is shown in the in-app credits view.',
    variants: {
      standard: { x: 50, y: 50, scale: 1 },
      crop: { x: 52, y: 42, scale: 1.35 },
      detail: { x: 55, y: 38, scale: 1.8 },
    },
  },
  trollface_classic: {
    src: '/media/memes/classic/trollface-2.jpg',
    alt: 'Recognizable Trollface rage-comic artwork',
    label: 'AUTHENTIC MEME / RAGE COMIC',
    assetType: 'public_domain',
    category: 'meme_formats',
    era: 'classic',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:TrollFace_2.0.jpg',
    licenseName: 'CC0 1.0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    author: 'Jesus211026',
    attributionRequired: false,
    notes: 'The creator released this recognizable Trollface artwork under CC0; no synthetic replacement was used.',
    variants: {
      standard: { x: 50, y: 50, scale: 1 },
      crop: { x: 39, y: 48, scale: 1.4 },
      silhouette: { x: 50, y: 50, scale: 1.05 },
    },
  },
  grumpy_cat_classic: {
    src: '/media/memes/classic/grumpy-cat.png',
    alt: 'Grumpy Cat pixel-art depiction with the recognizable frown and blue eyes',
    label: 'AUTHENTIC MEME / REACTION CAT',
    assetType: 'licensed',
    category: 'reaction_memes',
    era: 'early_2010s',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Grumpy_Cat.png',
    licenseName: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    author: 'Topher McCulloch',
    attributionRequired: true,
    notes: 'Bundled from the original Wikimedia Commons file page; the attribution is included in the credits view.',
    variants: {
      standard: { x: 50, y: 50, scale: 1 },
      crop: { x: 50, y: 40, scale: 1.35 },
      detail: { x: 50, y: 35, scale: 1.7 },
    },
  },
};

export const LOCAL_MEDIA: Record<string, LocalMediaAsset> = Object.fromEntries(
  Object.entries(LOCAL_MEDIA_DEFINITIONS).map(([key, asset]) => [key, {
    ...asset,
    assetType: asset.assetType ?? 'public_domain',
    category: asset.category ?? 'italian_brainrot',
    era: asset.era ?? '2025',
  }]),
) as Record<string, LocalMediaAsset>;

export function getLocalMediaAsset(key?: string): LocalMediaAsset | undefined {
  return key ? LOCAL_MEDIA[key] : undefined;
}
