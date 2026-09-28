export interface ThemeConfig {
  id: string;
  name: string;
  rootClass: string;
  backgroundClass: string;
  accentClass: string;
  glowClass: string;
  secondaryClass: string;
  accent: string;
  secondary: string;
  gridPrimary: string;
  gridSecondary: string;
  background: string;
  glow: string;
}

const THEMES: ThemeConfig[] = [
  {
    id: 'theme_default',
    name: 'DEFAULT CRT',
    rootClass: 'theme-default',
    backgroundClass: 'theme-bg-default',
    accentClass: 'theme-accent-default',
    glowClass: 'theme-glow-default',
    secondaryClass: 'theme-secondary-default',
    accent: '#ec4899',
    secondary: '#22d3ee',
    gridPrimary: '#ec4899',
    gridSecondary: '#06b6d4',
    background: '#07070b',
    glow: 'rgba(236,72,153,0.28)',
  },
  {
    id: 'theme_cyber_pink',
    name: 'CYBER PINK',
    rootClass: 'theme-cyber-pink',
    backgroundClass: 'theme-bg-cyber-pink',
    accentClass: 'theme-accent-cyber-pink',
    glowClass: 'theme-glow-cyber-pink',
    secondaryClass: 'theme-secondary-cyber-pink',
    accent: '#f472b6',
    secondary: '#c084fc',
    gridPrimary: '#f472b6',
    gridSecondary: '#a855f7',
    background: '#120817',
    glow: 'rgba(244,114,182,0.38)',
  },
  {
    id: 'theme_ohio_hazard',
    name: 'OHIO HAZARD',
    rootClass: 'theme-ohio-hazard',
    backgroundClass: 'theme-bg-ohio-hazard',
    accentClass: 'theme-accent-ohio-hazard',
    glowClass: 'theme-glow-ohio-hazard',
    secondaryClass: 'theme-secondary-ohio-hazard',
    accent: '#fbbf24',
    secondary: '#fb7185',
    gridPrimary: '#f59e0b',
    gridSecondary: '#ef4444',
    background: '#160c05',
    glow: 'rgba(245,158,11,0.34)',
  },
  {
    id: 'theme_void_crt',
    name: 'VOID CRT',
    rootClass: 'theme-void-crt',
    backgroundClass: 'theme-bg-void-crt',
    accentClass: 'theme-accent-void-crt',
    glowClass: 'theme-glow-void-crt',
    secondaryClass: 'theme-secondary-void-crt',
    accent: '#22d3ee',
    secondary: '#818cf8',
    gridPrimary: '#06b6d4',
    gridSecondary: '#6366f1',
    background: '#020c14',
    glow: 'rgba(34,211,238,0.34)',
  },
  {
    id: 'theme_archive_chrome',
    name: 'ARCHIVE CHROME',
    rootClass: 'theme-archive-chrome',
    backgroundClass: 'theme-bg-archive-chrome',
    accentClass: 'theme-accent-archive-chrome',
    glowClass: 'theme-glow-archive-chrome',
    secondaryClass: 'theme-secondary-archive-chrome',
    accent: '#e2e8f0',
    secondary: '#a78bfa',
    gridPrimary: '#cbd5e1',
    gridSecondary: '#8b5cf6',
    background: '#090b13',
    glow: 'rgba(167,139,250,0.36)',
  },
];

export function getThemeConfig(id?: string): ThemeConfig {
  return THEMES.find((theme) => theme.id === id) ?? THEMES[0];
}

export function isThemeId(id: string): boolean {
  return THEMES.some((theme) => theme.id === id);
}

