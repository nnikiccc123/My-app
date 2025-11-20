import React, { useEffect, useRef } from "react";
import moment from "moment-timezone";
import "./AnalogClock.css";

interface Props {
  timeZone: string;
}

function drawFace(ctx: CanvasRenderingContext2D, radius: number) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, radius - 10, 0, Math.PI * 2);
  ctx.fillStyle = "pink";
  ctx.fill();

  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function drawNumbers(ctx: CanvasRenderingContext2D, radius: number) {
  ctx.save();
  ctx.font = `15px Arial`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  for (let num = 1; num <= 12; num++) {
    const angle = (num * Math.PI) / 6;

    const x = Math.sin(angle) * radius * 0.75;
    const y = -Math.cos(angle) * radius * 0.75;

    ctx.fillText(num.toString(), x, y);
  }
  ctx.restore();
}

function drawTime(
  ctx: CanvasRenderingContext2D,
  radius: number,
  timeZone: string
) {
  const now = moment().tz(timeZone);
  const hour = now.hour() % 12;
  const minute = now.minute();
  const second = now.second();

  // satna kazaljka
  const hourAngle =
    (hour * Math.PI) / 6 +
    (minute * Math.PI) / (6 * 60) +
    (second * Math.PI) / (360 * 60);
  drawHand(ctx, hourAngle, radius * 0.5, radius * 0.04, "black");

  // minutna kazaljka
  const minuteAngle = (minute * Math.PI) / 30 + (second * Math.PI) / (30 * 60);
  drawHand(ctx, minuteAngle, radius * 0.6, radius * 0.03, "black");

  // sekundna kazaljka
  const secondAngle = (second * Math.PI) / 30;
  drawHand(ctx, secondAngle, radius * 0.7, radius * 0.02, "red");
}

function drawHand(
  ctx: CanvasRenderingContext2D,
  angle: number,
  length: number,
  width: number,
  color: string
) {
  ctx.save();
  ctx.beginPath();
  ctx.lineCap = "round";
  ctx.moveTo(0, 0);
  ctx.rotate(angle);
  ctx.lineTo(0, -length);
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.rotate(-angle);
  ctx.restore();
}

function drawCentralPoint(ctx: CanvasRenderingContext2D, radius: number) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.05, 0, Math.PI * 2);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.restore();
}

const AnalogClock: React.FC<Props> = ({ timeZone }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const radius = width / 2;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.translate(radius, radius);

      //crtanje

      drawFace(ctx, radius);
      drawNumbers(ctx, radius);
      drawTime(ctx, radius, timeZone);
      drawCentralPoint(ctx, radius);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeZone]);

  return (
    <canvas ref={canvasRef} width={200} height={200} className="clock-canvas" />
  );
};

export default AnalogClock;
