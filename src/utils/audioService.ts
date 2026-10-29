/**
 * Web Speech API helper for Arabic Text-to-Speech (TTS) and Speech-to-Text (STT)
 */

export class ArabicAudioPlayer {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;

  static playArabicText(text: string, rate = 0.9, onEnd?: () => void) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = rate; // 0.85 - 1.0 is great for Arabic learners
    utterance.pitch = 1.0;

    // Try finding Arabic voice
    const voices = this.synth.getVoices();
    const arabicVoice = voices.find(v => v.lang.startsWith('ar') || v.name.toLowerCase().includes('arabic'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = () => onEnd();
    }

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  static stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  static isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }
}

// Speech recognition helper
export function createArabicSpeechRecognizer(
  onResult: (transcript: string) => void,
  onError?: (err: any) => void,
  onEnd?: () => void
) {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'ar-SA';
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: any) => {
    if (onError) onError(event.error);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  return recognition;
}
