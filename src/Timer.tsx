import React, { useEffect, useState } from "react";

const Timer: React.FC = () => {
  const [seconds, setSecond] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: number | undefined;
    if (isActive) {
      interval = window.setInterval(() => {
        setSecond((prethodni) => prethodni + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, "0");

    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  return (
    <div>
      <h1>Timer</h1>
      <h2>{formatTime(seconds)}</h2>
      <button onClick={() => setIsActive(!isActive)}>
        {isActive ? "Pauziraj" : "Pokreni"}
      </button>
      <button onClick={() => setSecond(0)}>Resetuj</button>
    </div>
  );
};

export default Timer;
