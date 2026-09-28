import React, { useMemo, useState } from 'react';
import { Archive, Award, BarChart3, Check, Coins, Lock, Palette, Store, Trophy, X } from 'lucide-react';
import { ACHIEVEMENT_DEFINITIONS } from '../data/achievements';
import { ARCHIVE_ENTRIES } from '../data/archive';
import { COSMETICS, CosmeticDefinition, CosmeticType } from '../data/cosmetics';
import { LOCAL_MEDIA, getLocalMediaAsset } from '../data/media';
import { getThemeConfig } from '../data/themes';
import { UserStats } from '../types';
import { equipCosmetic, purchaseCosmetic } from '../utils/storage';
import { AnswerEffect } from './AnswerEffect';

type CollectionTab = 'achievements' | 'archive' | 'shop' | 'stats' | 'credits';

interface CollectionModalProps {
  stats: UserStats;
  initialTab?: CollectionTab;
  onClose: () => void;
  onUpdateStats: (stats: Partial<UserStats>) => void;
}

function achievementProgress(id: string, stats: UserStats): string | null {
  const values: Record<string, [number, number, string]> = {
    'first-rot': [stats.quizzesCompleted, 1, 'quizzes'],
    'locked-in': [stats.personalBests.combo ?? 0, 5, 'combo'],
    'aura-farmer': [stats.auraPoints, 5000, 'Aura'],
    'italian-scholar': [stats.correctByCategory.italian_brainrot ?? 0, 25, 'answers'],
    'speed-demon': [stats.highestRushScore, 5000, 'Rush'],
    'daily-grinder': [stats.streak, 7, 'day streak'],
    'touch-grass': [stats.quizzesCompleted, 50, 'quizzes'],
    'final-boss': [stats.finalBossWins, 1, 'clear'],
  };
  const value = values[id];
  return value ? `${Math.min(value[0], value[1]).toLocaleString()} / ${value[1].toLocaleString()} ${value[2]}` : null;
}

const typeLabel = (type: CosmeticType) => type === 'theme' ? 'THEMES' : type === 'card' ? 'CARD BORDERS' : 'ANSWER EFFECTS';

export const CollectionModal: React.FC<CollectionModalProps> = ({ stats, initialTab = 'achievements', onClose, onUpdateStats }) => {
  const [tab, setTab] = useState<CollectionTab>(initialTab);
  const [toast, setToast] = useState('');
  const unlockedAchievements = useMemo(() => new Set(stats.unlockedAchievements), [stats.unlockedAchievements]);
  const discovered = useMemo(() => new Set(stats.discoveredSubjects), [stats.discoveredSubjects]);
  const theme = getThemeConfig(stats.equippedTheme);
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  };
  const tabs: Array<[CollectionTab, string, React.ReactNode]> = [
    ['achievements', 'ACHIEVEMENTS', <Trophy className="h-4 w-4" />],
    ['archive', 'ARCHIVE', <Archive className="h-4 w-4" />],
    ['shop', 'SHOP', <Store className="h-4 w-4" />],
    ['stats', 'PROFILE', <BarChart3 className="h-4 w-4" />],
    ['credits', 'CREDITS', <Award className="h-4 w-4" />],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-md sm:p-5">
      <section style={{ borderColor: theme.accent, boxShadow: `0 0 50px ${theme.glow}` }} className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border-2 bg-zinc-950" aria-label="Brainrot collection">
        <button onClick={onClose} className="absolute right-3 top-3 z-10 rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-zinc-300 hover:text-white" aria-label="Close collection"><X className="h-4 w-4" /></button>
        <header className="border-b border-zinc-800 bg-gradient-to-r from-pink-950/50 via-zinc-950 to-cyan-950/40 px-5 pb-4 pt-5 sm:px-6">
          <div className="theme-primary-text font-mono text-[10px] font-black tracking-[0.25em]">BRAINROT COLLECTION</div>
          <div className="mt-1 flex items-end justify-between gap-3 pr-10"><h2 className="text-2xl font-black italic text-white sm:text-3xl">YOUR INTERNET RECEIPTS</h2><div className="flex items-center gap-1 rounded-xl border border-yellow-500/50 bg-yellow-500/10 px-2.5 py-1 text-xs font-black text-yellow-300"><Coins className="h-3.5 w-3.5" />{stats.auraPoints.toLocaleString()}</div></div>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-zinc-800 bg-zinc-950 px-3 py-2" aria-label="Collection sections">
          {tabs.map(([id, label, icon]) => <button key={id} onClick={() => setTab(id)} className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-black tracking-wide ${tab === id ? 'theme-button' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}>{icon}{label}</button>)}
        </nav>
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          {tab === 'achievements' && <AchievementsPanel stats={stats} unlocked={unlockedAchievements} />}
          {tab === 'archive' && <ArchivePanel discovered={discovered} />}
          {tab === 'shop' && <ShopPanel stats={stats} notify={notify} onUpdateStats={onUpdateStats} />}
          {tab === 'stats' && <StatsPanel stats={stats} discovered={discovered} onUpdateStats={onUpdateStats} />}
          {tab === 'credits' && <CreditsPanel />}
        </div>
        {toast && <div className="border-t border-zinc-800 bg-zinc-900 px-4 py-2 text-center text-xs font-black text-yellow-300" role="status">{toast}</div>}
      </section>
    </div>
  );
};

function AchievementsPanel({ stats, unlocked }: { stats: UserStats; unlocked: Set<string> }) {
  return <div className="grid gap-2 sm:grid-cols-2">{ACHIEVEMENT_DEFINITIONS.map((achievement) => {
    const isUnlocked = unlocked.has(achievement.id);
    return <article key={achievement.id} className={`rounded-2xl border p-3 ${isUnlocked ? 'border-yellow-400/70 bg-yellow-950/20' : 'border-zinc-800 bg-zinc-900/60'}`}>
      <div className="flex items-start gap-3"><div className={`rounded-xl p-2 ${isUnlocked ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-zinc-600'}`}>{isUnlocked ? <Check className="h-5 w-5" /> : <Lock className="h-5 w-5" />}</div><div className="min-w-0 flex-1"><div className={`text-xs font-black ${isUnlocked ? 'text-yellow-300' : 'text-zinc-400'}`}>{isUnlocked ? achievement.title : 'LOCKED ACHIEVEMENT'}</div><p className="mt-1 text-[11px] text-zinc-400">{isUnlocked ? achievement.description : 'Keep playing to reveal this receipt.'}</p>{achievementProgress(achievement.id, stats) && <div className="mt-2 font-mono text-[10px] font-bold text-cyan-300">{achievementProgress(achievement.id, stats)}</div>}</div></div>
    </article>;
  })}</div>;
}

type ArchiveFilter = 'ALL' | 'ITALIAN' | 'CLASSIC' | 'SLANG' | 'EMOJI';

function ArchivePanel({ discovered }: { discovered: Set<string> }) {
  const [filter, setFilter] = useState<ArchiveFilter>('ALL');
  const count = ARCHIVE_ENTRIES.filter((entry) => discovered.has(entry.subjectKey)).length;
  const nextMilestone = [5, 10, 20, ARCHIVE_ENTRIES.length].find((milestone) => count < milestone);
  const nextMilestoneLabel = nextMilestone === ARCHIVE_ENTRIES.length ? 'COMPLETE ARCHIVE' : nextMilestone === 20 ? 'ARCHIVE CURATOR' : `${nextMilestone} ENTRIES`;
  const filtered = ARCHIVE_ENTRIES.filter((entry) => filter === 'ALL' || entry.category.toUpperCase().includes(filter));
  return <div>
    <div className="mb-3 flex items-center justify-between gap-3"><div><div className="theme-primary-text font-mono text-[10px] font-black">BRAINROT ARCHIVE</div><p className="mt-1 text-xs text-zinc-400">Encounter characters and culture references to fill your Archive.</p></div><div className="shrink-0 font-mono text-sm font-black text-white">{count} / {ARCHIVE_ENTRIES.length}</div></div>
    <div className="mb-4 rounded-xl border border-zinc-800 bg-zinc-900/70 p-3"><div className="h-2 overflow-hidden rounded-full bg-zinc-800"><div className="theme-button h-full rounded-full transition-[width] duration-500" style={{ width: `${Math.round((count / ARCHIVE_ENTRIES.length) * 100)}%` }} /></div><div className="mt-2 flex items-center justify-between gap-2 text-[10px] font-mono text-zinc-400"><span>{count} / {ARCHIVE_ENTRIES.length} DISCOVERED</span>{nextMilestone ? <span>{nextMilestone - count} MORE → {nextMilestoneLabel}</span> : <span className="theme-primary-text">ARCHIVE COMPLETE</span>}</div></div>
    <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1">{(['ALL', 'ITALIAN', 'CLASSIC', 'SLANG', 'EMOJI'] as ArchiveFilter[]).map((item) => <button key={item} onClick={() => setFilter(item)} className={`shrink-0 rounded-lg px-3 py-1.5 text-[10px] font-black ${filter === item ? 'bg-cyan-400 text-black' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}>{item}</button>)}</div>
    <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5">{filtered.map((entry) => { const known = discovered.has(entry.subjectKey); const asset = entry.mediaKey ? getLocalMediaAsset(entry.mediaKey) : undefined; return <article key={entry.subjectKey} className={`overflow-hidden rounded-2xl border ${known ? 'theme-primary-border bg-cyan-950/20' : 'border-zinc-800 bg-zinc-900/60'}`}><div className="flex h-24 items-center justify-center bg-black/60 p-2">{known && asset ? <img src={asset.src} alt={entry.name} className={`h-full w-full rounded-xl ${asset.fit === 'contain' ? 'object-contain' : 'object-cover'}`} /> : <span className={`text-3xl ${known ? '' : 'grayscale opacity-30'}`}>{known ? entry.emoji : '???'}</span>}</div><div className="p-2.5"><div className={`truncate text-[11px] font-black ${known ? 'text-white' : 'text-zinc-600'}`}>{known ? entry.name : 'UNKNOWN SUBJECT'}</div>{known && <><div className="mt-1 text-[9px] font-mono text-cyan-300">{entry.era} • {entry.category}</div><p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-zinc-400">{entry.description}</p></>}</div></article>; })}</div>
  </div>;
}

function ThemeMiniPreview({ themeId }: { themeId: string }) {
  const theme = getThemeConfig(themeId);
  return <div className="relative overflow-hidden rounded-xl border p-2" style={{ background: theme.background, borderColor: theme.accent, boxShadow: `0 0 18px ${theme.glow}` }}><div className="flex items-center justify-between rounded-md border px-2 py-1 text-[8px] font-black" style={{ borderColor: theme.accent, color: theme.accent }}><span>BRAINROT</span><span>•••</span></div><div className="mt-2 rounded-lg border bg-black/30 p-2" style={{ borderColor: theme.secondary }}><div className="text-[9px] font-black text-white">QUESTION CARD</div><div className="mt-2 grid grid-cols-2 gap-1"><span className="rounded border px-1 py-1 text-center text-[8px]" style={{ borderColor: theme.accent, color: theme.accent }}>A</span><span className="rounded border px-1 py-1 text-center text-[8px]" style={{ borderColor: theme.secondary, color: theme.secondary }}>B</span></div></div></div>;
}

function CardMiniPreview({ cosmeticId }: { cosmeticId: string }) {
  const cardClass = cosmeticId === 'card_holo' ? 'card-cosmetic-holo' : cosmeticId === 'card_gold' ? 'card-cosmetic-gold' : 'border-zinc-600';
  return <div className={`relative overflow-hidden rounded-xl border-2 bg-zinc-950 p-2 ${cardClass}`}><div className="relative z-10 text-[9px] font-black text-white">WHO IS THIS?</div><div className="relative z-10 mt-2 grid grid-cols-2 gap-1"><span className="rounded-lg border border-emerald-400/70 bg-emerald-950/50 px-2 py-1 text-center text-[8px] text-emerald-200">A</span><span className="rounded-lg border border-zinc-700 px-2 py-1 text-center text-[8px] text-zinc-400">B</span></div></div>;
}

function CosmeticPreview({ cosmetic, triggerKey }: { cosmetic: CosmeticDefinition; triggerKey: string | null }) {
  if (cosmetic.type === 'theme') return <ThemeMiniPreview themeId={cosmetic.id} />;
  if (cosmetic.type === 'card') return <CardMiniPreview cosmeticId={cosmetic.id} />;
  return <div className="relative min-h-20 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950"><div className="relative z-10 p-2 text-[9px] font-black text-white">CORRECT ANSWER</div><AnswerEffect effectId={cosmetic.id} triggerKey={triggerKey} /></div>;
}

function ShopPanel({ stats, notify, onUpdateStats }: { stats: UserStats; notify: (message: string) => void; onUpdateStats: (stats: Partial<UserStats>) => void }) {
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [effectPreviewKey, setEffectPreviewKey] = useState<string | null>(null);
  const handleBuy = (id: string) => {
    const result = purchaseCosmetic(stats, id);
    onUpdateStats(result.updatedStats);
    notify(result.message);
  };
  const handleEquip = (id: string) => {
    onUpdateStats(equipCosmetic(stats, id));
    notify('EQUIPPED');
  };
  const previewCosmetic = (cosmetic: CosmeticDefinition) => {
    if (cosmetic.type === 'effect') {
      setPreviewId(cosmetic.id);
      setEffectPreviewKey(`${cosmetic.id}-${Date.now()}`);
      return;
    }
    setPreviewId((current) => current === cosmetic.id ? null : cosmetic.id);
  };
  return <div className="space-y-5"><div className="theme-primary-bg rounded-2xl border theme-primary-border p-3 text-xs"><div className="theme-primary-text font-mono text-[10px] font-black">NEXT TARGET</div><div className="mt-1 font-black text-white">{stats.unlockedCosmetics.includes('theme_cyber_pink') ? 'CYBER PINK UNLOCKED' : `${Math.max(0, 1500 - stats.auraPoints).toLocaleString()} AURA TO CYBER PINK`}</div></div>{(['theme', 'card', 'effect'] as CosmeticType[]).map((type) => <section key={type}><div className="theme-primary-text mb-2 flex items-center gap-2 text-xs font-black"><Palette className="h-4 w-4" />{typeLabel(type)}</div><div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2 sm:grid-cols-4">{COSMETICS.filter((cosmetic) => cosmetic.type === type).map((cosmetic) => { const owned = stats.unlockedCosmetics.includes(cosmetic.id); const equipped = stats.equippedTheme === cosmetic.id || stats.equippedCardStyle === cosmetic.id || stats.equippedEffect === cosmetic.id; const preview = previewId === cosmetic.id; const shortfall = Math.max(0, cosmetic.cost - stats.auraPoints); return <article key={cosmetic.id} className={`rounded-2xl border p-2.5 ${equipped ? 'border-emerald-400 bg-emerald-950/20' : 'border-zinc-800 bg-zinc-900/70'}`}><div className={`mb-2 h-16 rounded-xl bg-gradient-to-br ${cosmetic.swatch}`}>{preview && <CosmeticPreview cosmetic={cosmetic} triggerKey={cosmetic.type === 'effect' ? effectPreviewKey : null} />}</div><div className="text-[11px] font-black text-white">{cosmetic.name}</div><p className="mt-1 min-h-7 text-[10px] text-zinc-500">{cosmetic.description}</p><button onClick={() => previewCosmetic(cosmetic)} className="mt-2 w-full rounded-lg border border-zinc-700 py-1.5 text-[9px] font-black text-zinc-300 hover:border-[var(--theme-accent)] hover:text-white">{cosmetic.type === 'effect' ? 'PREVIEW EFFECT' : preview ? 'HIDE PREVIEW' : 'PREVIEW'}</button>{owned ? <button onClick={() => handleEquip(cosmetic.id)} className="mt-2 w-full rounded-lg bg-emerald-400 py-1.5 text-[10px] font-black text-black">{equipped ? 'EQUIPPED' : 'EQUIP'}</button> : cosmetic.exclusive ? <div className="mt-2 rounded-lg border border-cyan-500/40 bg-cyan-950/30 py-1.5 text-center text-[9px] font-black text-cyan-300">🔒 COMPLETE ARCHIVE</div> : <><button onClick={() => handleBuy(cosmetic.id)} disabled={stats.auraPoints < cosmetic.cost} className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg bg-yellow-400 py-1.5 text-[10px] font-black text-black disabled:bg-zinc-700 disabled:text-zinc-500"><Coins className="h-3 w-3" />{cosmetic.cost.toLocaleString()}</button>{shortfall > 0 && <div className="mt-1 text-center text-[9px] font-mono text-zinc-500">{stats.auraPoints.toLocaleString()} / {cosmetic.cost.toLocaleString()} AURA • {shortfall.toLocaleString()} TO GO</div>}</>}</article>; })}</div></section>)}</div>;
}

function StatsPanel({ stats, discovered, onUpdateStats }: { stats: UserStats; discovered: Set<string>; onUpdateStats: (stats: Partial<UserStats>) => void }) {
  const answered = stats.totalCorrect + stats.totalWrong;
  const values: Array<[string, string | number]> = [
    ['QUESTIONS ANSWERED', answered],
    ['ACCURACY', `${answered ? Math.round(stats.totalCorrect / answered * 100) : 0}%`],
    ['BEST COMBO', `${stats.personalBests.combo ?? 0}x`],
    ['RUSH BEST', stats.highestRushScore.toLocaleString()],
    ['CHALLENGE WINS', stats.challengeWins],
    ['DAILY STREAK', `${stats.streak} days`],
    ['LONGEST STREAK', `${stats.longestStreak} days`],
    ['AURA', stats.auraPoints.toLocaleString()],
    ['ARCHIVE', `${ARCHIVE_ENTRIES.filter((entry) => discovered.has(entry.subjectKey)).length}/${ARCHIVE_ENTRIES.length}`],
  ];
  return <div className="space-y-5"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{values.map(([label, value]) => <div key={label} className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4"><div className="font-mono text-[10px] text-zinc-500">{label}</div><div className="mt-1 text-2xl font-black text-white">{value}</div></div>)}</div><section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4"><div className="theme-primary-text font-mono text-[10px] font-black tracking-widest">TITLES</div><p className="mt-1 text-xs text-zinc-400">Equip a title you have earned. Unlocks are permanent.</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{stats.unlockedTitles.map((title) => <button key={title} onClick={() => onUpdateStats({ currentTitle: title })} className={`flex min-h-11 items-center justify-between rounded-xl border px-3 py-2 text-left text-xs font-black transition-colors ${stats.currentTitle === title ? 'theme-primary-border bg-white/10 text-white' : 'border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-zinc-500'}`}><span>{title}</span>{stats.currentTitle === title && <span className="theme-primary-text text-[10px]">✓ EQUIPPED</span>}</button>)}</div></section></div>;
}

function CreditsPanel() {
  return <div><div className="mb-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4"><div className="font-mono text-xs font-black text-cyan-300">MEDIA SOURCES / CREDITS</div><p className="mt-1 text-xs text-zinc-400">Bundled local references only. Attribution details are shown per asset.</p></div><div className="space-y-2">{Object.entries(LOCAL_MEDIA).map(([key, asset]) => <div key={key} className="flex flex-col gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-3 sm:flex-row sm:items-center"><img src={asset.src} alt="" className={`h-14 w-14 rounded-xl ${asset.fit === 'contain' ? 'object-contain' : 'object-cover'}`} /><div className="min-w-0 flex-1"><div className="text-xs font-black text-white">Reference: <span className="text-zinc-200">{asset.alt}</span></div><div className="mt-1 text-[10px] text-zinc-400">Creator: <span className="text-zinc-200">{asset.author ?? 'Unknown'}</span></div><div className="mt-1 text-[10px] text-zinc-400">License: <span className="text-zinc-200">{asset.licenseName ?? 'Not specified'}</span></div></div><a href={asset.sourceUrl} target="_blank" rel="noreferrer" className="text-[10px] font-black text-cyan-300 hover:text-cyan-100">SOURCE ↗</a></div>)}</div></div>;
}
