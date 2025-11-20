import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import AnalogClock from "./AnalogClock";

const Clock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeZone, setTimeZone] = useState("Europe/Belgrade");

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeZones: string[] = moment.tz.names();

  const formattedTime = moment(currentTime).tz(timeZone).format("hh.mm.ss A");

  return (
    <div>
      <h1>Digitalni sat:</h1>
      <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
        {timeZones.map((tz) => (
          <option key={tz} value={tz}>
            {tz}
          </option>
        ))}
      </select>
      <h2>{formattedTime}</h2>
      <h1>Analogni sat: </h1>
      <AnalogClock timeZone={timeZone} />
    </div>
  );
};

export default Clock;
