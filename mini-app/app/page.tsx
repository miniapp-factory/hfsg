import { description, title, url } from "@/lib/metadata";
"use client";
import { generateMetadata } from "@/lib/farcaster-embed";
import { Share } from "@/components/share";
import { Game2048 } from "@/components/2048-game";
import { useState } from "react";

export { generateMetadata };

export default function Home() {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  return (
    <main className="flex flex-col gap-3 place-items-center px-4">
      <span className="text-2xl">{title}</span>
      <span className="text-muted-foreground">{description}</span>
      <Game2048 onGameOver={(finalScore) => { setScore(finalScore); setGameOver(true); }} />
      {gameOver && (
        <Share text={`I scored ${score} points in 2048! ${url}`} />
      )}
    </main>
  );
}
