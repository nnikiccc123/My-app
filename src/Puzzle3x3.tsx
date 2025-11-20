import React, { useEffect, useRef, useState } from "react";

const GRID_SIZE = 3; // 3x3 slagalica
const TILE_COUNT = GRID_SIZE * GRID_SIZE;
const TILE_SIZE = 100; // veličina jednog dela 100px

// ---------- FUNKCIJA: smanjuje sliku na 300x300 ----------
const getScaledImage = (image: HTMLImageElement) => {
  const offCanvas = document.createElement("canvas");
  offCanvas.width = GRID_SIZE * TILE_SIZE;
  offCanvas.height = GRID_SIZE * TILE_SIZE;

  const ctx = offCanvas.getContext("2d")!;
  ctx.drawImage(image, 0, 0, offCanvas.width, offCanvas.height);

  const scaled = new Image();
  scaled.src = offCanvas.toDataURL("image/png");

  return scaled;
};

const Puzzle3x3: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [tiles, setTiles] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [shuffling, setShuffling] = useState(false);

  // ---------- UČITAJ SLIKU I SMANJI JE ----------
  useEffect(() => {
    const image = new Image();
    image.src = "/puzzle.jpg"; // ubaci svoju sliku u public folder

    image.onload = () => {
      const scaled = getScaledImage(image);
      scaled.onload = () => setImg(scaled);
    };

    // napravi niz [0,1,2,...,8]
    const initial = Array.from({ length: TILE_COUNT }, (_, i) => i);
    setTiles(initial);
  }, []);

  // ---------- CRTANJE ----------
  useEffect(() => {
    if (img) drawPuzzle();
  }, [tiles, img]);

  const drawPuzzle = () => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // očisti canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Provera da li je slagalica rešena
    const solved = tiles.every((tile, index) => tile === index);

    // Nacrtaj sve delove slagalice
    tiles.forEach((tileIndex, i) => {
      const sx = (tileIndex % GRID_SIZE) * TILE_SIZE;
      const sy = Math.floor(tileIndex / GRID_SIZE) * TILE_SIZE;

      const dx = (i % GRID_SIZE) * TILE_SIZE;
      const dy = Math.floor(i / GRID_SIZE) * TILE_SIZE;

      ctx.drawImage(
        img,
        sx,
        sy,
        TILE_SIZE,
        TILE_SIZE,
        dx,
        dy,
        TILE_SIZE,
        TILE_SIZE
      );

      // Ako slagalica nije rešena, crtamo linije
      if (!solved) {
        ctx.strokeStyle = "#000";
        ctx.strokeRect(dx, dy, TILE_SIZE, TILE_SIZE);
      }
    });

    // Ako je slagalica rešena, prikaži crveni natpis
    if (solved) {
      ctx.font = "bold 50px Arial";
      ctx.fillStyle = "red";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
    }
  };

  // ---------- KLIK ZA ZAMENU ----------
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (shuffling) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedIndex =
      Math.floor(y / TILE_SIZE) * GRID_SIZE + Math.floor(x / TILE_SIZE);

    if (selected === null) {
      setSelected(clickedIndex);
    } else {
      const newTiles = [...tiles];
      [newTiles[selected], newTiles[clickedIndex]] = [
        newTiles[clickedIndex],
        newTiles[selected],
      ];
      setTiles(newTiles);
      setSelected(null);
    }
  };

  // ---------- ANIMACIJA MEŠANJA ----------
  const shuffleAnimation = () => {
    setShuffling(true);

    let counter = 0;
    const interval = setInterval(() => {
      setTiles((prev) => {
        const arr = [...prev];
        const i = Math.floor(Math.random() * TILE_COUNT);
        const j = Math.floor(Math.random() * TILE_COUNT);
        [arr[i], arr[j]] = [arr[j], arr[i]];
        return arr;
      });

      counter++;
      if (counter >= 30) {
        clearInterval(interval);
        setShuffling(false);
      }
    }, 80);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * TILE_SIZE}
        height={GRID_SIZE * TILE_SIZE}
        onClick={handleClick}
        style={{
          border: "2px solid black",
          cursor: shuffling ? "not-allowed" : "pointer",
        }}
      />
      <br />
      <button
        onClick={shuffleAnimation}
        disabled={shuffling}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        Promešaj puzzle
      </button>
      {selected !== null && <p>Izabrano polje: {selected + 1}</p>}
    </div>
  );
};

export default Puzzle3x3;
