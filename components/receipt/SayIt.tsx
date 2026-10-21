"use client";

import { useEffect, useState } from "react";
import styles from "./receipt.module.css";

function hasKoreanVoice(): boolean {
  return window.speechSynthesis.getVoices().some((voice) => voice.lang.toLowerCase().startsWith("ko"));
}

// 발음 ▶: Web Speech API로 한글 이름을 읽는다. 한국어 음성이 없으면 ▶만 숨긴다
export function SayIt({ hangul, onPlay }: { hangul: string; onPlay?: () => void }) {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const update = () => setAvailable(hasKoreanVoice());
    update();
    window.speechSynthesis.addEventListener("voiceschanged", update);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", update);
  }, []);

  if (!available) return null;

  const play = () => {
    const utterance = new SpeechSynthesisUtterance(hangul);
    utterance.lang = "ko-KR";
    utterance.rate = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    onPlay?.();
  };

  return (
    <button type="button" className={styles.play} aria-label="Play pronunciation" onClick={play}>
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
        <path d="M2.5 1.2l6 3.8-6 3.8z" fill="#FFFFFF" />
      </svg>
    </button>
  );
}
