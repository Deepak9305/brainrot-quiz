import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

class AdsConfig {
  const AdsConfig({
    this.adsEnabled = true,
    this.interstitialEnabled = true,
    this.rewardedEnabled = true,
    this.bannerEnabled = false,
    this.minRoundsBetweenInterstitials = 2,
    this.minSecondsBetweenInterstitials = 105,
    this.firstSessionInterstitialDisabled = true,
    this.rewardMultiplier = 2,
    this.rewardedHintEnabled = true,
    this.rewardedSecondChanceEnabled = true,
  });

  final bool adsEnabled;
  final bool interstitialEnabled;
  final bool rewardedEnabled;
  final bool bannerEnabled;
  final int minRoundsBetweenInterstitials;
  final int minSecondsBetweenInterstitials;
  final bool firstSessionInterstitialDisabled;
  final int rewardMultiplier;
  final bool rewardedHintEnabled;
  final bool rewardedSecondChanceEnabled;
}

enum RewardKind { doubleCoins, saveStreak, hint, continueRush, impossibleMode }

abstract class AdsService {
  AdsConfig get config;
  Future<void> initialize();
  void recordCompletedRound();
  Future<void> showInterstitialIfEligible();
  Future<bool> showRewarded(RewardKind kind);
}

class AdMobAdsService implements AdsService {
  AdMobAdsService({this.config = const AdsConfig()});

  @override
  final AdsConfig config;
  RewardedAd? _rewardedAd;
  DateTime? _lastInterstitialAt;
  int _completedRounds = 0;
  bool _initialized = false;

  String get _rewardedUnitId => 'ca-app-pub-3940256099942544/5224354917';

  String get _interstitialUnitId => 'ca-app-pub-3940256099942544/1033173712';

  @override
  Future<void> initialize() async {
    if (kIsWeb || !config.adsEnabled || _initialized) return;
    _initialized = true;
    await MobileAds.instance.initialize();
    _loadRewarded();
  }

  void _loadRewarded() {
    if (kIsWeb || !config.adsEnabled || !config.rewardedEnabled) return;
    RewardedAd.load(
      adUnitId: _rewardedUnitId,
      request: const AdRequest(),
      rewardedAdLoadCallback: RewardedAdLoadCallback(
        onAdLoaded: (ad) => _rewardedAd = ad,
        onAdFailedToLoad: (_) => _rewardedAd = null,
      ),
    );
  }

  @override
  void recordCompletedRound() => _completedRounds++;

  @override
  Future<void> showInterstitialIfEligible() async {
    if (kIsWeb || !config.adsEnabled || !config.interstitialEnabled) return;
    if (config.firstSessionInterstitialDisabled && _completedRounds <= 1) {
      return;
    }
    if (_completedRounds < config.minRoundsBetweenInterstitials) return;
    final now = DateTime.now();
    if (_lastInterstitialAt != null &&
        now.difference(_lastInterstitialAt!).inSeconds <
            config.minSecondsBetweenInterstitials) {
      return;
    }
    final completer = Completer<void>();
    InterstitialAd.load(
      adUnitId: _interstitialUnitId,
      request: const AdRequest(),
      adLoadCallback: InterstitialAdLoadCallback(
        onAdLoaded: (ad) {
          _completedRounds = 0;
          _lastInterstitialAt = now;
          ad.fullScreenContentCallback = FullScreenContentCallback(
            onAdDismissedFullScreenContent: (ad) {
              ad.dispose();
              if (!completer.isCompleted) completer.complete();
            },
            onAdFailedToShowFullScreenContent: (ad, _) {
              ad.dispose();
              if (!completer.isCompleted) completer.complete();
            },
          );
          ad.show();
        },
        onAdFailedToLoad: (_) {
          if (!completer.isCompleted) completer.complete();
        },
      ),
    );
    await completer.future.timeout(
      const Duration(seconds: 8),
      onTimeout: () {},
    );
  }

  @override
  Future<bool> showRewarded(RewardKind kind) async {
    if (kIsWeb ||
        !config.adsEnabled ||
        !config.rewardedEnabled ||
        _rewardedAd == null) {
      _loadRewarded();
      return false;
    }
    final ad = _rewardedAd!;
    _rewardedAd = null;
    final completer = Completer<bool>();
    ad.fullScreenContentCallback = FullScreenContentCallback(
      onAdDismissedFullScreenContent: (ad) {
        ad.dispose();
        _loadRewarded();
        if (!completer.isCompleted) completer.complete(false);
      },
      onAdFailedToShowFullScreenContent: (ad, _) {
        ad.dispose();
        _loadRewarded();
        if (!completer.isCompleted) completer.complete(false);
      },
    );
    ad.show(
      onUserEarnedReward: (ad, reward) {
        if (!completer.isCompleted) completer.complete(true);
      },
    );
    return completer.future.timeout(
      const Duration(seconds: 45),
      onTimeout: () => false,
    );
  }
}
