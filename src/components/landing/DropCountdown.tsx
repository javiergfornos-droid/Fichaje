"use client";

import { useEffect, useState } from "react";

interface DropCountdownProps {
  dropDate?: string;
}

function getNextMidnightCET(): Date {
  const now = new Date();
  // CET is UTC+1, CEST is UTC+2. Use Intl to get the correct offset.
  const cetString = now.toLocaleString("en-US", { timeZone: "Europe/Madrid" });
  const cetNow = new Date(cetString);

  const nextMidnight = new Date(cetNow);
  nextMidnight.setDate(nextMidnight.getDate() + 1);
  nextMidnight.setHours(0, 0, 0, 0);

  // Convert back: difference between cetNow and now gives the offset
  const offsetMs = cetNow.getTime() - now.getTime();
  return new Date(nextMidnight.getTime() - offsetMs);
}

function getTimeRemaining(target: Date): {
  hours: string;
  minutes: string;
  seconds: string;
} {
  const diff = Math.max(0, target.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

export default function DropCountdown({ dropDate }: DropCountdownProps) {
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [time, setTime] = useState({ hours: "--", minutes: "--", seconds: "--" });

  useEffect(() => {
    const target = dropDate ? new Date(dropDate) : getNextMidnightCET();
    setTargetDate(target);
    setTime(getTimeRemaining(target));
  }, [dropDate]);

  useEffect(() => {
    if (!targetDate) return;

    const interval = setInterval(() => {
      setTime(getTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <section className="py-16 px-6">
      <div className="max-w-xl mx-auto bg-tunnel-grey border border-tunnel-border rounded-sm p-8 text-center">
        {/* Title */}
        <h2 className="font-[family-name:var(--font-oswald)] uppercase text-floodlight-white text-2xl font-bold mb-6">
          Próximo drop en
        </h2>

        {/* Countdown display */}
        <div className="flex items-center justify-center gap-3">
          {[
            { value: time.hours, label: "HRS" },
            { value: time.minutes, label: "MIN" },
            { value: time.seconds, label: "SEG" },
          ].map((unit, i) => (
            <div key={unit.label} className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <span className="font-[family-name:var(--font-jetbrains)] text-whistle-gold text-5xl sm:text-6xl font-bold tabular-nums">
                  {unit.value}
                </span>
                <span className="font-[family-name:var(--font-jetbrains)] text-programme-cream text-xs mt-1 uppercase">
                  {unit.label}
                </span>
              </div>
              {i < 2 && (
                <span className="font-[family-name:var(--font-jetbrains)] text-whistle-gold text-5xl sm:text-6xl font-bold -mt-5">
                  :
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
