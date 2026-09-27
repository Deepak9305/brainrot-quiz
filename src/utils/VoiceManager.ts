export class VoiceManager {
  private voices: SpeechSynthesisVoice[] = [];
  private refreshVoices(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.voices = window.speechSynthesis.getVoices();
  }

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.refreshVoices();
      window.speechSynthesis.addEventListener('voiceschanged', () => this.refreshVoices());
    }
  }

  private getVoice(): SpeechSynthesisVoice | undefined {
    if (this.voices.length === 0) this.refreshVoices();
    return this.voices.find((voice) => voice.lang.toLowerCase().startsWith('en') && /natural|google|samantha|daniel|oliver/i.test(voice.name))
      ?? this.voices.find((voice) => voice.lang.toLowerCase().startsWith('en'))
      ?? this.voices[0];
  }

  speak(text: string, onEnd?: () => void): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }
    this.stop();
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = 1;
      utterance.pitch = 1;
      utterance.rate = 1;
      const voice = this.getVoice();
      if (voice) utterance.voice = voice;
      utterance.onend = () => onEnd?.();
      utterance.onerror = () => onEnd?.();
      window.speechSynthesis.speak(utterance);
    } catch {
      onEnd?.();
    }
  }

  stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  }
}

export const voiceManager = new VoiceManager();
