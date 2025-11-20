import React, { useRef, useEffect } from "react";

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const MAN_SIZE = 20;
const LEG_LENGTH = 25;
const ARM_LENGTH = 15;
const STEP_SPEED = 0.1;

const WalkingMan: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // koristimo ref za poziciju i target da bi animacija bila glatka
  const manPosRef = useRef({ x: 100, y: 100 });
  const targetRef = useRef<{ x: number; y: number } | null>(null);
  const stepPhaseRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const { x, y } = manPosRef.current;

    const BODY_HEIGHT = 30; // visina tela
    const HEAD_CENTER_Y = y - MAN_SIZE; // centar glave
    const BODY_START_Y = HEAD_CENTER_Y + MAN_SIZE; // donja ivica glave, početak tela
    const BODY_END_Y = BODY_START_Y + BODY_HEIGHT;

    // Glava
    ctx.beginPath();
    ctx.arc(x, HEAD_CENTER_Y, MAN_SIZE, 0, Math.PI * 2);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    // Telo
    ctx.beginPath();
    ctx.moveTo(x, BODY_START_Y);
    ctx.lineTo(x, BODY_END_Y);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    // Noge
    const stepOffset = Math.sin(stepPhaseRef.current) * LEG_LENGTH * 0.2;
    ctx.beginPath();
    ctx.moveTo(x, BODY_END_Y);
    ctx.lineTo(x - LEG_LENGTH / 2, BODY_END_Y + LEG_LENGTH + stepOffset); // leva noga
    ctx.moveTo(x, BODY_END_Y);
    ctx.lineTo(x + LEG_LENGTH / 2, BODY_END_Y + LEG_LENGTH - stepOffset); // desna noga
    ctx.stroke();
    ctx.closePath();

    // Ruke – fiksne, ne pomeraju se
    ctx.beginPath();
    const ARM_Y = BODY_START_Y + BODY_HEIGHT / 2; // sredina tela
    ctx.moveTo(x, ARM_Y);
    ctx.lineTo(x - ARM_LENGTH, ARM_Y); // leva ruka – fiksna
    ctx.moveTo(x, ARM_Y);
    ctx.lineTo(x + ARM_LENGTH, ARM_Y); // desna ruka – fiksna
    ctx.stroke();
    ctx.closePath();
  };

  const animate = () => {
    if (!targetRef.current) {
      animationRef.current = null;
      return;
    }

    const { x: tx, y: ty } = targetRef.current;
    const { x: cx, y: cy } = manPosRef.current;

    const dx = tx - cx;
    const dy = ty - cy;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const speed = 3;

    // Ako smo dovoljno blizu cilja → stop
    if (distance <= speed) {
      manPosRef.current = { x: tx, y: ty };
      targetRef.current = null;

      // Noge miruju
      stepPhaseRef.current = 0;

      draw();
      animationRef.current = null;
      return;
    }

    // Normalno kretanje ka cilju
    manPosRef.current = {
      x: cx + (dx / distance) * speed,
      y: cy + (dy / distance) * speed,
    };

    // Povećaj stepPhase samo dok se telo kreće
    stepPhaseRef.current += 0.15;

    draw();
    animationRef.current = requestAnimationFrame(animate);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    targetRef.current = { x, y };

    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    draw();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ border: "2px solid black", cursor: "pointer" }}
        onClick={handleClick}
      />
      <p>Klikni na platno da cica-glisu hoda!</p>
    </div>
  );
};

export default WalkingMan;
