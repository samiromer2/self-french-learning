"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2, Square } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Speaks French text with the browser's SpeechSynthesis API. No audio files
// needed; `rate` < 1 slows speech for beginner levels.
export function AudioButton({
  text,
  rate = 0.85,
  label = "Listen",
}: {
  text: string;
  rate?: number;
  label?: string;
}) {
  const [speaking, setSpeaking] = useState(false);

  // Stop speech when the exercise (and this button) unmounts.
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback(() => {
    if (!("speechSynthesis" in window)) {
      toast.error("Audio isn't supported in this browser.");
      return;
    }
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = rate;
    const frVoice = synth
      .getVoices()
      .find((v) => v.lang.toLowerCase().startsWith("fr"));
    if (frVoice) utterance.voice = frVoice;

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    synth.cancel();
    synth.speak(utterance);
    setSpeaking(true);
  }, [text, rate, speaking]);

  return (
    <Button type="button" variant="outline" onClick={speak} className="gap-2">
      {speaking ? <Square className="size-4" /> : <Volume2 className="size-4" />}
      {speaking ? "Stop" : label}
    </Button>
  );
}
