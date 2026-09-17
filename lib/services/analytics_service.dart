abstract class AnalyticsService {
  void track(String event, [Map<String, Object?> parameters = const {}]);
}

class LocalAnalyticsService implements AnalyticsService {
  @override
  void track(String event, [Map<String, Object?> parameters = const {}]) {
    // A privacy-first local implementation. Wire Firebase Analytics later if desired.
  }
}
