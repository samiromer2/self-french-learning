"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Mic, MicOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AudioButton } from "@/features/listening/audio-button";
import type { SpeakingPromptData } from "@/types/exercises";

// Minimal typing for the (still-prefixed) Web Speech API.
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

function getRecognition(): SpeechRecognitionLike | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  const Ctor = (w.SpeechRecognition ?? w.webkitSpeechRecognition) as
    | (new () => SpeechRecognitionLike)
    | undefined;
  return Ctor ? new Ctor() : null;
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // recognition output is unreliable about accents
    .replace(/[.,!?;:«»"'’-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Share of target words present in the transcript; ≥ 0.7 passes.
function wordOverlap(target: string, transcript: string) {
  const targetWords = normalize(target).split(" ");
  const said = new Set(normalize(transcript).split(" "));
  if (targetWords.length === 0) return 0;
  const hit = targetWords.filter((word) => said.has(word)).length;
  return hit / targetWords.length;
}

export function SpeakingPrompt({
  data,
  onResult,
  revealed,
}: {
  data: SpeakingPromptData;
  onResult: (correct: boolean | null) => void;
  revealed: boolean;
}) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [recognitionFailed, setRecognitionFailed] = useState(false);
  const [selfAssessed, setSelfAssessed] = useState<boolean | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  function record() {
    const recognition = getRecognition();
    if (!recognition) {
      setRecognitionFailed(true);
      return;
    }
    recognitionRef.current = recognition;
    recognition.lang = "fr-FR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      if (data.mode === "repeat") {
        onResult(wordOverlap(data.text, text) >= 0.7);
      } else {
        // Free answers count when the learner says a few words.
        onResult(normalize(text).split(" ").length >= 3);
      }
    };
    recognition.onerror = () => {
      setListening(false);
      setRecognitionFailed(true);
    };
    recognition.onend = () => setListening(false);

    setTranscript(null);
    setListening(true);
    recognition.start();
  }

  function selfAssess(correct: boolean) {
    setSelfAssessed(correct);
    onResult(correct);
  }

  const listenText = data.mode === "answer" ? (data.question ?? data.text) : data.text;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <AudioButton
          text={listenText}
          rate={data.rate}
          label={data.mode === "answer" ? "Hear the question" : "Hear the sentence"}
        />
        {!recognitionFailed && (
          <Button
            type="button"
            variant={listening ? "destructive" : "default"}
            className="gap-2"
            disabled={revealed}
            onClick={() => (listening ? recognitionRef.current?.stop() : record())}
          >
            {listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
            {listening ? "Stop recording" : "Record yourself"}
          </Button>
        )}
      </div>

      {data.mode === "repeat" && (
        <p className="rounded-lg bg-muted px-4 py-3 font-medium">
          {data.text}
          {data.translation && (
            <span className="mt-1 block text-sm font-normal text-muted-foreground">
              {data.translation}
            </span>
          )}
        </p>
      )}

      {transcript && (
        <p className="text-sm">
          You said:{" "}
          <span className="font-medium">« {transcript} »</span>
        </p>
      )}

      {recognitionFailed && !revealed && (
        <div className="space-y-2 rounded-lg border border-dashed p-4">
          <p className="text-sm text-muted-foreground">
            Speech recognition isn&apos;t available here — say it aloud, then rate
            yourself honestly:
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={selfAssessed === true ? "default" : "outline"}
              className="gap-1"
              onClick={() => selfAssess(true)}
            >
              <Check className="size-4" /> I said it well
            </Button>
            <Button
              type="button"
              variant={selfAssessed === false ? "default" : "outline"}
              className="gap-1"
              onClick={() => selfAssess(false)}
            >
              <X className="size-4" /> Need more practice
            </Button>
          </div>
        </div>
      )}

      {revealed && data.mode === "answer" && (
        <p className="text-sm text-muted-foreground">
          Model answer:{" "}
          <span className="font-medium text-foreground">{data.text}</span>
          {data.translation && <> — {data.translation}</>}
        </p>
      )}
    </div>
  );
}
