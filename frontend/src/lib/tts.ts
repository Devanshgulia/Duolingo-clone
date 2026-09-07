// Web Speech API Text-to-Speech Engine
export function speakText(text: string, lang: string = 'es') {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Clean punctuation that sounds awkward
  const clean = text.replace(/[¿¡]/g, '').trim();
  const utterance = new SpeechSynthesisUtterance(clean);

  // Map language codes
  let targetLang = 'es-ES';
  if (lang === 'fr') targetLang = 'fr-FR';
  else if (lang === 'de') targetLang = 'de-DE';
  else if (lang === 'en') targetLang = 'en-US';

  utterance.lang = targetLang;
  utterance.rate = 0.9; // Slightly slower for language learners
  utterance.pitch = 1.05; // Slightly cheerful pitch

  // Try to find a matching native voice
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang.startsWith(lang) || v.lang === targetLang);
  if (voice) {
    utterance.voice = voice;
  }

  window.speechSynthesis.speak(utterance);
}
