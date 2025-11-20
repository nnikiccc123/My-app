import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Datum from "./Datum";
import Timer from "./Timer";
import Clock from "./Clock";
import AnalogClock from "./AnalogClock";
import Puzzle3x3 from "./Puzzle3x3";
import WalkingMan from "./WalkingMan";

function App() {
  return (
    <div>
      <Timer />
      <Datum />
      <Clock />
      <Puzzle3x3 />
      <WalkingMan />
    </div>
  );
}

export default App;
